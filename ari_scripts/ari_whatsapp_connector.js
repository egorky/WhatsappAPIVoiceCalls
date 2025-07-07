'use strict';

const client = require('ari-client');
const util = require('util');

// Asterisk connection details
const ARI_URL = process.env.ARI_URL || 'http://localhost:8088'; // e.g., http://asterisk_ip:8088
const ARI_USERNAME = process.env.ARI_USERNAME || 'asterisk_ari_user'; // Ensure this user exists in ari.conf
const ARI_PASSWORD = process.env.ARI_PASSWORD || 'ari_password';   // Ensure this password matches ari.conf
const ARI_APP_NAME = process.env.ARI_APP_NAME || 'whatsapp-ari-app'; // Stasis app name in extensions.conf

// Configuration for call routing
const WEBRTC_CLIENT_ENDPOINT = process.env.WEBRTC_CLIENT_ENDPOINT || 'PJSIP/web_client'; // PJSIP endpoint of your WebRTC client
const WHATSAPP_TRUNK_ENDPOINT_FOR_OUTBOUND = process.env.WHATSAPP_TRUNK_ENDPOINT_FOR_OUTBOUND || 'PJSIP/whatsapp_trunk_endpoint'; // PJSIP endpoint for dialing out to WhatsApp
const YOUR_WHATSAPP_BUSINESS_NUMBER = process.env.YOUR_WHATSAPP_BUSINESS_NUMBER || '+12345678901'; // Your WhatsApp business number for outbound CallerID

console.log(`Connecting to ARI: ${ARI_URL} as ${ARI_USERNAME}`);
console.log(`ARI App Name: ${ARI_APP_NAME}`);
console.log(`WebRTC Client Endpoint: ${WEBRTC_CLIENT_ENDPOINT}`);
console.log(`WhatsApp Trunk for Outbound: ${WHATSAPP_TRUNK_ENDPOINT_FOR_OUTBOUND}`);
console.log(`WhatsApp Business Number for CallerID: ${YOUR_WHATSAPP_BUSINESS_NUMBER}`);


client.connect(ARI_URL, ARI_USERNAME, ARI_PASSWORD)
  .then(function (ari) {
    console.log('Successfully connected to ARI!');

    async function stasisStart(event, channel) {
      console.log(util.format('Channel %s entered Stasis app %s', channel.name, ARI_APP_NAME));

      // Answer the incoming channel
      try {
        await channel.answer();
        console.log(util.format('Channel %s answered', channel.name));
      } catch (err) {
        console.error(util.format('Error answering channel %s: %s', channel.name, err.message));
        // channel.hangup().catch(e => console.error(`Error hanging up channel ${channel.name}: ${e.message}`));
        return; // Exit if we can't answer
      }

      const dialedExten = event.args[0]; // Get the first argument passed to Stasis app (original dialed number)
      console.log(`Dialed extension/argument for channel ${channel.name}: ${dialedExten}`);

      // Determine if this is an inbound call from WhatsApp or an outbound call from WebRTC client
      // This is a simplified check. A more robust way might involve checking channel variables
      // or having separate Stasis apps for inbound and outbound if logic differs greatly.
      const isIncomingFromWhatsApp = channel.name.toLowerCase().includes('pjsip/whatsapp_trunk_endpoint'); // Heuristic

      if (isIncomingFromWhatsApp) {
        console.log(`Incoming call from WhatsApp (channel ${channel.id}) to ${dialedExten}. Routing to WebRTC client.`);
        await handleIncomingWhatsAppCall(channel);
      } else {
        // Assuming calls not matching the WhatsApp trunk are from internal clients (e.g. WebRTC)
        // and the 'dialedExten' is the number they want to reach on WhatsApp.
        // This part is less likely if your dialplan directly dials out for WebRTC users.
        // If WebRTC users are also put into Stasis for outbound, this logic would apply.
        console.log(`Outgoing call from internal client (channel ${channel.id}) to ${dialedExten}. Routing to WhatsApp.`);
        await handleOutboundToWhatsApp(channel, dialedExten);
      }
    }

    async function handleIncomingWhatsAppCall(incomingChannel) {
      let outgoingChannel;
      let bridge;

      try {
        console.log(util.format('Originating call from %s to WebRTC client %s', incomingChannel.name, WEBRTC_CLIENT_ENDPOINT));
        outgoingChannel = await ari.channels.originate({
          endpoint: WEBRTC_CLIENT_ENDPOINT,
          callerId: incomingChannel.caller.number, // Pass original caller ID to WebRTC client
          app: ARI_APP_NAME, // Keep the new channel in the same app for simpler event handling
          appArgs: 'dialed_by_ari', // Optional: argument for the new channel if it re-enters Stasis
          timeout: 30 // Timeout for originating the call
        });
        console.log(util.format('Originated outgoing channel %s to WebRTC client', outgoingChannel.name));

        // Create a mixing bridge
        bridge = ari.Bridge();
        await bridge.create({ type: 'mixing' });
        console.log(util.format('Bridge %s created', bridge.id));

        // Add channels to the bridge
        await bridge.addChannel({ channel: [incomingChannel.id, outgoingChannel.id] });
        console.log(util.format('Channels %s and %s added to bridge %s', incomingChannel.id, outgoingChannel.id, bridge.id));

        // Setup hangup handlers
        incomingChannel.once('StasisEnd', async () => {
          console.log(util.format('Incoming channel %s hung up', incomingChannel.name));
          if (outgoingChannel) {
            console.log(util.format('Hanging up outgoing channel %s', outgoingChannel.name));
            outgoingChannel.hangup().catch(err => console.error(util.format('Error hanging up outgoing channel %s: %s', outgoingChannel.name, err.message)));
          }
          if (bridge) {
            console.log(util.format('Destroying bridge %s', bridge.id));
            bridge.destroy().catch(err => console.error(util.format('Error destroying bridge %s: %s', bridge.id, err.message)));
          }
        });

        outgoingChannel.once('StasisEnd', async () => {
          console.log(util.format('Outgoing channel %s hung up', outgoingChannel.name));
          // incomingChannel is already handled by its own StasisEnd
          // if (bridge) {
          //   console.log(util.format('Destroying bridge %s (from outgoing hangup)', bridge.id));
          //   bridge.destroy().catch(err => console.error(util.format('Error destroying bridge %s: %s', bridge.id, err.message)));
          // }
        });

        outgoingChannel.once('ChannelDestroyed', async () => {
            console.log(util.format('Outgoing channel %s destroyed', outgoingChannel.name));
             if (incomingChannel && incomingChannel.state !== 'Down' && incomingChannel.state !== 'Up') { // Avoid hanging up if already down or if it's up (which means it's in StasisEnd)
                console.log(util.format('Hanging up incoming channel %s due to outgoing channel destruction', incomingChannel.name));
                incomingChannel.hangup().catch(err => console.error(util.format('Error hanging up incoming channel %s: %s', incomingChannel.name, err.message)));
            }
            if (bridge) {
                console.log(util.format('Destroying bridge %s (from outgoing channel destroyed)', bridge.id));
                bridge.destroy().catch(err => console.error(util.format('Error destroying bridge %s: %s', bridge.id, err.message)));
            }
        });


      } catch (err) {
        console.error(util.format('Error during incoming call handling for %s: %s', incomingChannel.name, err.message));
        if (outgoingChannel) {
          outgoingChannel.hangup().catch(e => console.error(util.format('Cleanup: Error hanging up outgoing channel %s: %s', outgoingChannel.name, e.message)));
        }
        incomingChannel.hangup().catch(e => console.error(util.format('Cleanup: Error hanging up incoming channel %s: %s', incomingChannel.name, e.message)));
        if (bridge) {
          bridge.destroy().catch(e => console.error(util.format('Cleanup: Error destroying bridge %s: %s', bridge.id, e.message)));
        }
      }
    }

    async function handleOutboundToWhatsApp(initiatingChannel, numberToDial) {
      // This function would be called if a WebRTC client (or other internal source)
      // is placed into this Stasis app with the intention of dialing out to WhatsApp.
      // The current extensions.conf routes WebRTC outbound calls directly, not via this ARI app.
      // If you change extensions.conf to route WebRTC outbound calls to this Stasis app,
      // this logic would be used.

      console.log(`Attempting outbound call from ${initiatingChannel.name} to WhatsApp number ${numberToDial}`);
      let whatsAppChannel;
      let bridge;

      try {
        whatsAppChannel = await ari.channels.originate({
          endpoint: `${WHATSAPP_TRUNK_ENDPOINT_FOR_OUTBOUND}/${numberToDial}`, // Dial format PJSIP/endpoint/extension
          callerId: YOUR_WHATSAPP_BUSINESS_NUMBER, // Set your WhatsApp Business number as CallerID
          app: ARI_APP_NAME,
          appArgs: 'dialed_by_ari_to_whatsapp',
          timeout: 45
        });
        console.log(util.format('Originated outgoing channel %s to WhatsApp user %s', whatsAppChannel.name, numberToDial));

        bridge = ari.Bridge();
        await bridge.create({ type: 'mixing' });
        console.log(util.format('Bridge %s created for outbound call', bridge.id));

        await bridge.addChannel({ channel: [initiatingChannel.id, whatsAppChannel.id] });
        console.log(util.format('Channels %s and %s added to bridge %s', initiatingChannel.id, whatsAppChannel.id, bridge.id));

        // Setup hangup handlers
        initiatingChannel.once('StasisEnd', async () => {
          console.log(util.format('Initiating (WebRTC) channel %s hung up', initiatingChannel.name));
          if (whatsAppChannel) {
            whatsAppChannel.hangup().catch(err => console.error(util.format('Error hanging up WhatsApp channel %s: %s', whatsAppChannel.name, err.message)));
          }
          if (bridge) {
            bridge.destroy().catch(err => console.error(util.format('Error destroying bridge %s: %s', bridge.id, err.message)));
          }
        });

        whatsAppChannel.once('StasisEnd', async () => {
          console.log(util.format('WhatsApp channel %s hung up', whatsAppChannel.name));
          // initiatingChannel is handled by its own StasisEnd
        });
         whatsAppChannel.once('ChannelDestroyed', async () => {
            console.log(util.format('WhatsApp channel %s destroyed', whatsAppChannel.name));
             if (initiatingChannel && initiatingChannel.state !== 'Down' && initiatingChannel.state !== 'Up') {
                console.log(util.format('Hanging up initiating channel %s due to WhatsApp channel destruction', initiatingChannel.name));
                initiatingChannel.hangup().catch(err => console.error(util.format('Error hanging up initiating channel %s: %s', initiatingChannel.name, err.message)));
            }
            if (bridge) {
                console.log(util.format('Destroying bridge %s (from WhatsApp channel destroyed)', bridge.id));
                bridge.destroy().catch(err => console.error(util.format('Error destroying bridge %s: %s', bridge.id, err.message)));
            }
        });


      } catch (err) {
        console.error(util.format('Error during outbound call handling for %s to %s: %s', initiatingChannel.name, numberToDial, err.message));
        if (whatsAppChannel) {
          whatsAppChannel.hangup().catch(e => console.error(util.format('Cleanup: Error hanging up WhatsApp channel %s: %s', whatsAppChannel.name, e.message)));
        }
        initiatingChannel.hangup().catch(e => console.error(util.format('Cleanup: Error hanging up initiating channel %s: %s', initiatingChannel.name, e.message)));
        if (bridge) {
          bridge.destroy().catch(e => console.error(util.format('Cleanup: Error destroying bridge %s: %s', bridge.id, e.message)));
        }
      }
    }

    ari.on('StasisStart', stasisStart);

    // Start the Stasis application
    ari.start(ARI_APP_NAME);
    console.log(util.format('Stasis application %s registered and listening for events.', ARI_APP_NAME));

  })
  .catch(function (err) {
    console.error('Error connecting to ARI or starting Stasis app:', err.message);
    if (err.response && err.response.body) {
        console.error('ARI Response Body:', err.response.body);
    }
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', function () {
  console.log('Caught SIGINT, shutting down ARI client...');
  // ari.stop(); // This would require `ari` to be in a broader scope or handled differently
  // For simplicity, just exit. Proper cleanup would involve stopping the app and disconnecting.
  process.exit(0);
});
