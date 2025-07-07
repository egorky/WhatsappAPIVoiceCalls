# Cloud API Calling
=================


Overview
---

The WhatsApp Business Calling API enables you to initiate and receive calls with users on WhatsApp using voice-over-internet protocol (VoIP).

### Architecture

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1432040817821113&version=1749668747)

(_Right click image and choose "Open in new tab" for enlarged image_)

[](#)

Get Started
---

### Step 1: Prerequisites

Before you get started with the Calling API, ensure that:

1.  [Your business number is in use with Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/phone-numbers) (not only the SMB app)
2.  Subscribe to the `“calls”` webhook field (unless you plan to use [SIP](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip))
3.  [Enable Calling features on your business phone number](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings)

### Step 2: Configure optional calling features

The WhatsApp Business Calling API offers a number of features that affect when and how calling features appear to users on your WhatsApp profile

*   Inbound call control allows you to prevent users from placing calls from your profile
*   Business call hours allows you to avoid missed calls and direct users to message when your call center is closed
*   Callback requests offer users the option to request a callback when you don’t pick up a call or if your call center is closed

[Learn more about call control settings](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

### Step 3: Make and receive calls

Cloud API Calling offers two call initiation paths:

*   **User-initiated calls:** Calls that are made from a WhatsApp user to your business
*   **Business-initiated calls:** Calls that are made from your business to a WhatsApp user
    *   If you are planning on making business-initiated calls to WhatsApp users, ensure that [a conversation is opened with the WhatsApp user you want to call](https://developers.facebook.com/docs/whatsapp/pricing#opening-conversations)

[](#)



# Configure Call Settings
=======================


**Calling is not default enabled on a business phone number**

Use the `POST /<PHONE_NUMBER_ID>/settings` endpoint to enable Calling API features on a business phone number.


Overview
--------

Use these endpoints to view and configure call settings for the WhatsApp Business Calling API.

You can also [configure session initiation protocol (SIP)](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip) for call signaling instead of using Graph API endpoint calls and webhooks.

[](#)

Configure/Update business phone number calling settings
-------------------------------------------------------

Use this endpoint to update call settings configuration for an individual business phone number.

### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

### Endpoint parameters

  

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are updating Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

### Request body

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT",
    "call\_hours": {
      "status": "ENABLED",
      "timezone\_id": "America/Manaus",
      "weekly\_operating\_hours": \[
        {
          "day\_of\_week": "MONDAY",
          "open\_time": "0400",
          "close\_time": "1020"
        },
        {
          "day\_of\_week": "TUESDAY",
          "open\_time": "0108",
          "close\_time": "1020"
        }
      \],
      "holiday\_schedule": \[
        {
          "date": "2026-01-01",
          "start\_time": "0000",
          "end\_time": "2359"
        }
      \]
    },
    "callback\_permission\_status": "ENABLED",
    "sip": {
      "status": "ENABLED | DISABLED (default)",
      "servers": \[
        {
          "hostname": SIP\_SERVER\_HOSTNAME,
          "port": SIP\_SERVER\_PORT,
          "request\_uri\_user\_params": {
            "KEY1": "VALUE1",
            "KEY2": "VALUE2"
          }
        }
      \]
    }
  }
}

### Body parameters

Parameter

Description

Sample Value

`status`

_String_

**Optional**

  

Enable or disable the Calling API for the given business phone number.

`“ENABLED”`

`“DISABLED”`

`call_icon_visibility`

_String_

**Optional**

  

Configure whether the WhatsApp call button icon displays for users when chatting with the business.

[View call icon visibility behavior details below](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

[View call icon visibility behavior details below](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

`call_hours`

_JSON object_

**Optional**

  

Allows you specify and trigger call settings for incoming calls based on your timezone, business operating hours, and holiday schedules.

Any previously configured values in `call_hours` will be replaced with the values passed in the request body of this API call.

[View call hours behavior details below](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

[View call hours behavior details below](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

`callback_permission_status`

_String_

**Optional**

  

Configure whether a WhatsApp user is prompted with a call permission request after calling your business.

Note: The call permission request is triggered from either a missed or connected call.

[View callback permission status behavior details below](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details)

`“ENABLED”`

`“DISABLED”`

`sip`

_JSON object_

**Optional**

  

Configure call signaling via signal initiation protocol (SIP).

**Note: When SIP is enabled, you cannot use calling related endpoints and will not receive calling related webhooks.**

[Learn how to configure and use SIP call signaling](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip)

"sip": {
   "status": "ENABLED | DISABLED (default)",
   "servers": \[// one server per app\]
     {
       "hostname": SIP\_SERVER\_HOSTNAME
       "port": SIP\_SERVER\_PORT,
       "request\_uri\_user\_params": {
         "KEY1": "VALUE1", // for cases like TGRP
         "KEY2": "VALUE2",
       }
     }
   \]
 }

### Parameter details

#### Calling status

When the `status` parameter is set to `“ENABLED”`, calling features are enabled for the business phone number. WhatsApp client applications will render the call button icon in both the business chat and business chat profile.

When the `status` parameter is set to `“DISABLED”`, calling features are **disabled**, and both the business chat and business chat profile **do not display the call button icon.**

Updates to `status` will update the call button icon in existing business chats in near real-time when the business phone number is in the WhatsApp user's contacts.

Otherwise, updates are real-time for a limited number of users in conversation with the business, and are eventual for the rest of conversations.

#### Call button icon visibility

When Calling API features are enabled for a business number, you can still choose whether to show the call button icon or not by using the `call_icon_visibility` parameter. Note: Disabling call button icon visibility **does not** disable a WhatsApp user’s ability to make unsolicited calls to your business.

The behavior for supported options is as follows:

`DEFAULT`

The Call button icon will be displayed in the chat menu bar and the business info page, allowing for unsolicited calls to the business by WhatsApp users.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1066489138741549&version=1749582134)  
  
  

`DISABLE ALL`

The call button icon is hidden in the chat menu bar and the business info page, and all other entry points external to the chat are also disabled. Consumers cannot make unsolicited calls to the business.

Your business can still [send interactive messages](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-button-messages-deep-links#send-interactive-message-with-a-whatsapp-call-button) or [template messages](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-button-messages-deep-links#create-and-send-whatsapp-call-button-template-message) with a Calling API CTA button.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=760206949774860&version=1749582503)  
  
  

#### Callback permissions

Calling a WhatsApp user requires explicit permission from the user. One way to obtain calling permissions is to request permission when a WhatsApp user calls your business.

You can configure the call permission UI to automatically show in the WhatsApp user’s client app when they call your business number. The user may change their permission selection at any time.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=742324024881417&version=1749582662)  
  
  

#### Call hours

With the `call_hours` setting, you can specify the timezone, business operating hours, and holiday schedules that will be enforced for all user-initiated calls.

Configuring this setting restricts calls only to available weekly hours you configure. User-initiated calls are unavailable outside of the weekly hours and holiday schedules you set.

The WhatsApp client app will show users an option to chat with the business, or request a callback, if `callback_permission_status` is `ENABLED`. The user will also be shown the next available calling slot on the option screen.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1226478535596042&version=1749583863)  
  
  

"call\_hours": {
  "status": "ENABLED",
  "timezone\_id": "America/Manaus",
  "weekly\_operating\_hours": \[
    {
      "day\_of\_week": "MONDAY",
      "open\_time": "04:00",
      "close\_time": "10:20"
    },
    {
      "day\_of\_week": "TUESDAY",
      "open\_time": "01:08",
      "close\_time": "10:20"
    }
  \],
  "holiday\_schedule": \[
    {
      "date": "2026-01-01",
      "start\_time": "00:00",
      "end\_time": "23:59"
    }
  \]
}

Parameter

Description

Sample Values

`status`

_String_

**Required**

  

Enable or disable the call hours for the business.

If call hours are disabled, the business is considered open all 24 hours of the day, 7 days a week.

`“ENABLED”`

`“DISABLED”`

`timezone_id`

_String_

**Required**

  

The timezone that the business is operating within.

[Learn more about supported values for `timezone_id`](https://developers.facebook.com/docs/facebook-business-extension/fbe/reference#time-zones)

`“America/Menominee”`

`“Asia/Singapore”`

`weekly_operating_hours`

_List of JSON object_

**Required**

  

The operating hours schedule for each day of the week.

Each entry is an JSON object with 3 key/value pairs:

`day_of_week` — (_Enum_) **\[Required\]**

The day of the week.

Can take one of seven values: `"MONDAY"`, `“TUESDAY”`, `“WEDNESDAY”`, `“THURSDAY”`, `“FRIDAY”`, `“SATURDAY”`, `“SUNDAY”`

`open_time` | `close_time` — (_Integer_) **\[Required\]**

Opening and closing times represented in 24 hour format, e.g. `”1130”` = 11:30AM

*   Maximum of 2 entries allowed per day of week
*   `open_time` must be before `close_time`
*   Overlapping entries not allowed

{
"day\_of\_week": "MONDAY",
"open\_time": "0400",
"close\_time": "1020"
},
{
"day\_of\_week":"TUESDAY",
"open\_time": "0108",
"close\_time": "1020"
}
...

`holiday_schedule`

_String_

**Optional**

  

An optional override to the weekly schedule.

Up to 20 overrides can be specified.

Note: If `holiday_schedule` is not passed in the request, then the existing `holiday_schedule` will be deleted and replaced with an empty schedule.

`date` — (_String_) **\[Required\]**

Date for which you want to specify the override.

YYYY-MM-DD format.

`open_time` | `close_time` — (_Integer_) **\[Required\]**

Opening and closing times represented in 24 hour format, e.g. `”1130”` = 11:30AM

*   Maximum of 2 entries allowed per day of week
*   `open_time` must be before `close_time`
*   Overlapping entries not allowed

{
"date": "2026-01-01",
"start\_time": "0000",
"end\_time": "2359",
}
...

### Success response

{
  "success": true
}

### Error response

Possible errors that can occur:

*   Permissions/Authorization errors
*   Invalid status
*   Invalid schedule for `call_hours`
*   Holiday given in `call_hours` is a past date
*   Timezone is invalid in `call_hours`
*   `weekly_operating_hours` in `call_hours` cannot be empty
*   Date format in `holiday_schedule` for call\_hours is invalid
*   More than 2 entries not allowed in `weekly_operating_hours` schedule in `call_hours`
*   Overlapping schedule in `call_hours` is not allowed

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Get phone number calling settings
---------------------------------

Use this endpoint to check the configuration of your Calling API feature settings.

This endpoint can return information for other Cloud API feature settings.

### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

### Endpoint parameters

  

Parameter

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are getting Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

### App permission required

`whatsapp_business_management`: Advanced access is required to update use the API for end business clients

### Response body

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT",
    "callback\_permission\_status": "ENABLED",
    "call\_hours": {
      "status": "ENABLED",
      "timezone\_id": "\[REDACTED\]",
      "weekly\_operating\_hours": \[
        {
          "day\_of\_week": "MONDAY",
          "open\_time": "0400",
          "close\_time": "1020"
        },
        {
          "day\_of\_week": "TUESDAY",
          "open\_time": "0108",
          "close\_time": "1020"
        }
      \],
      "holiday\_schedule": \[
        {
          "date": "2026-01-01",
          "start\_time": "0000",
          "end\_time": "2359"
        }
      \]
    },
    "sip": {
      "status": "ENABLED",
      "servers": \[
        {
          "hostname": "\[REDACTED\]",
          "sip\_user\_password": "\[REDACTED\]"
        }
      \]
    }
  },
  <Other non\-calling feature configuration...>
}

### Include SIP user password

Optionally, you can include SIP user credentials in your response body by adding the SIP credentials query parameter in the POST request:

POST /<PHONE\_NUMBER\_ID\>/settings?include\_sip\_credentials\=true  

Where the response will look like this:

{
  "calling": {
    ... // other calling api settings
    "sip": {
      "status": "ENABLED",
      "servers": \[
        {
          "hostname": "sip.example.com",
          "sip\_user\_password": "{SIP\_USER\_PASSWORD}"
        }
      \]
    }
  }
}

### Response details

The `GET /<PHONE_NUMBER_ID>/settings` endpoint returns Calling API settings, along with other configuration information for your WhatsApp business phone number.

[Learn more about Calling API settings and their values](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#body-parameters)

### Error response

Possible errors that can occur:

*   Permissions/Authorization errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Call settings available in WhatsApp Manager
-------------------------------------------

You can also control your call settings via the [WhatsApp Manager interface](https://business.facebook.com/).

To access calling controls in WhatsApp Manager:

1.  Click on **WhatsApp Accounts**
2.  Select your WhatsApp Account
3.  Click on **Phone Numbers**
4.  Click the gear icon next to the phone number you are using for calling
5.  Click the **More** dropdown, then select **Calls**

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1421905515924086&version=1749575493)

[](#)

Configure and use call signaling via session initiation protocol (SIP)
----------------------------------------------------------------------

Session Initiation Protocol (SIP) is a signaling protocol used for initiating, maintaining, modifying, and terminating real-time communication sessions between two or more endpoints. You can send and receive call signals using SIP instead of Graph API endpoints.

[Learn more about how to use and configure SIP](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip)

[](#)

# Business-initiated Calls
========================



Overview
--------

The Calling API supports making calls to WhatsApp users from your business.

The user dictates when calls can be received by [granting call permissions to the business phone number](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions).

### Call sequence diagram

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1080278697331057&version=1750265314&transcode_extension=webp)

(_Right click image and choose "Open in new tab" for enlarged image_)

_Note: The `ACCEPTED` call status webhook will typically always arrive after the call has been established. It is primarily sent for call event auditing._

[](#)

Prerequisites
-------------

Before you get started with business-initiated calling, ensure that:

*   [Calling APIs are enabled on your business phone number](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings)
*   Subscribe to the `“calls”` webhook field

Lastly, **before you can call a WhatsApp user, you must obtain their permission to do so.**

[Learn how to obtain WhatsApp user calling permissions here](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions)

[](#)

Business-initiated calling flow
-------------------------------

### Part 1: Obtain permission to call the WhatsApp user

Obtaining call permissions from the WhatsApp user can be done in one of the following ways:

#### Send a call permission request message

You can request call permissions by sending the WhatsApp user a permission request, either as a free form message during an open customer service window, or by using a template message that contains the request.

*   [Learn how to send a **free form** call permission request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions#how-to-send-a-free-form-call-permission-request-message)
*   [Learn how to send a **template** call permission request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions#how-to-create-and-send-call-permission-request-template-messages)

#### Enable `callback_permission_status` in call settings

When `callback_permission_status` is enabled, the user automatically provides call permission to your business when they place a call to you.

[Learn how to enable `callback_permission_status`](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#configure-update-business-phone-number-calling-settings)

### Part 2: Your business initiates a new call to the WhatsApp user

Now that you have user permission, you can initiate a new call to the WhatsApp user in question.

You can now call the `POST <PHONE_NUMBER_ID>/calls` endpoint with the following request body to initiate a new call:

POST <PHONE\_NUMBER\_ID\>/calls
{
  "messaging\_product": "whatsapp",
  "to":"12185552828", // The WhatsApp user's phone number (callee)
  "action":"connect", 
  "session" : {
      "sdp\_type" : "offer",
      "sdp" : "<<RFC 8866 SDP>>"   
  }
}

If there are no errors, you will receive a successful response:

{
  "messaging\_product": "whatsapp",
  "calls" : \[
     "id" : "wacid.HBgLMTIxODU1NTI4MjgVAgARGCAyODRQIAFRoA", // The WhatsApp call ID
   \]
}

_Note: Response with error code `138006` indicates a lack of a call request permission for this business number from the WhatsApp user._

### Part 3: You establish the call connection using webhook signaling

After successful initiation of a new call, you will receive a Call Connect webhook response that contains an `SDP Answer` from Cloud API. Your business will then apply the `SDP Answer` from this webhook to your WebRTC stack in order to initiate the media connection.

{
    "entry": \[
        {
            "changes": \[
                {
                    "field": "calls",
                    "value": {
                        "calls": \[
                            {
                                "biz\_opaque\_callback\_data": "TRx334DUDFTI4Mj", // Arbitrary string passed by business for tracking purposes
                                "session": {
                                    "sdp\_type": "answer",
                                    "sdp": "<RFC 8866 SDP>"
                                },
                                "from": "13175551399", // The business phone number placing the call (caller)
                                "connection": {
                                    "webrtc": {
                                        "sdp": "<RFC 8866 SDP>"
                                    }
                                },
                                "id": "wacid.HBgLMTIxODU1NTI4MjgVAgARGCAyODRQIAFRoA", // The WhatsApp call ID
                                "to": "12185552828", // The WhatsApp user's phone number (callee)
                                "event": "connect",
                                "timestamp": "1749196895",
                                "direction": "BUSINESS\_INITIATED"
                            }
                        \],
                        "metadata": { // ID and display number for the business phone number placing the call (caller)
                            "phone\_number\_id": "436666719526789",
                            "display\_phone\_number": "13175551399"
                        },
                        "messaging\_product": "whatsapp"
                    }
                }
            \],
            "id": "366634483210360" // WhatsApp Business Account ID associated with the business phone number
        }
    \],
    "object": "whatsapp\_business\_account"
},

You then receive an appropriate status webhook, indicating that the call is `RINGING`, `ACCEPTED`, or `REJECTED`:

{
  "entry": \[
    {
      "changes": \[
        {
          "field": "calls",
          "value": {
            "statuses": \[
              {
                "id": "wacid.HBgLMTIxODU1NTI4MjgVAgARGCAyODRQIAFRoA", // The WhatsApp call ID
                "type": "call",
                "status": "\[RINGING|ACCEPTED|REJECTED\]", // The current call status
                "timestamp": "1749197000",
                "recipient\_id": "12185552828" // The WhatsApp user's phone number (callee)
              }
            \],
            "metadata": { // ID and display number for the business phone number placing the call (caller)
              "phone\_number\_id": "436666719526789",
              "display\_phone\_number": "13175551399"
            },
            "messaging\_product": "whatsapp"
          }
        }
      \],
      "id": "366634483210360" // WhatsApp Business Account ID associated with the business phone number
    }
  \],
  "object": "whatsapp\_business\_account"
}

### Part 4: Your business or the WhatsApp user terminates the call

Both you or the WhatsApp user can terminate the call at any time.

You call the `POST <PHONE_NUMBER_ID>/calls` endpoint with the following request body to terminate the call:

POST <PHONE\_NUMBER\_ID\>/calls
{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.HBgLMTIxODU1NTI4MjgVAgARGCAyODRQIAFRoA", // The WhatsApp call ID
  "action" : "terminate"
}

If there are no errors, you will receive a success response:

{
  "success" : true
}

When either the business or the WhatsApp user terminates the call, you receive a Call Terminate webhook:

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "366634483210360", // WhatsApp Business Account ID associated with the business phone number
      "changes": \[
        {
          "value": {
            "messaging\_product": "whatsapp",
            "metadata": { // ID and display number for the business phone number placing the call (caller)
              "phone\_number\_id": "436666719526789"
              "display\_phone\_number": "13175551399",
              
            },
            "calls": \[
              {
                "id": "wacid.HBgLMTIxODU1NTI4MjgVAgARGCAyODRQIAFRoA",
                "to": "12185552828", // The WhatsApp user's phone number (callee)
                "from": "13175551399", // The business phone number placing the call (caller)
                "event": "terminate",
                "direction": "BUSINESS\_INITIATED",
                "timestamp": "1749197480",
                "status": \["Failed", "Completed"\],
                "start\_time": "1671644824", // Call start UNIX timestamp
                "end\_time": "1671644944", // Call end UNIX timestamp
                "duration": 480 // Call duration in seconds
              }
            \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

[](#)

Endpoints for business-initiated Calling
----------------------------------------

### Initiate call

Use this endpoint to initiate a call to a WhatsApp user by providing a phone number and a WebRTC call offer.

#### Request Syntax

POST <PHONE\_NUMBER\_ID\>/calls

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number from which you are initiating a new call from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "to": "14085551234",
  "action": "connect",
  "session": {
    "sdp\_type": "offer",
    "sdp": "<<RFC 8866 SDP>>"
  },
  "biz\_opaque\_callback\_data": "0fS5cePMok"
}

#### Body Parameters

Parameter

Description

Sample Value

`to`

_Integer_

**Required**

  

The number being called (callee)

`“17863476655”`

`action`

_String_

**Required**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“connect”`

`session`

_JSON object_

**Optional**

  

Contains the session description protocol (SDP) type and description language.

Requires two values:

`sdp_type` — (_String_) **Required**

"offer", to indicate SDP offer

`sdp` — (_String_) **Required**

The SDP info of the device on the other end of the call. The SDP must be compliant with [RFC 8866](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8866%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEerTvhjirMsIr0t8qKHv3Q9HNCORjlwGE5dsj8wiyh7NRjz22V36MTyABVW80_aem_yuO6WlBBRwzKLwdk6TiYnw&h=AT3_BBFl82ZJPpZ5EWaIoD2QQy6gha5o54RvncVgdaoK8cb0394RjOcoP5U5K_Acx7b9nB73rbVa_gBa2dUPpUP5W2W6BeiI73PBSXal1y5OBrVwql731cvpvjA8s3zKdBRqn7GGoy4).

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeDZg9mIzCzH3XXm_vDALnHmwHL375OtL6dLmfh6NwRGh75My8U__lI9-ivV0_aem_c_aEAGnsWd490hPi6yjsYQ&h=AT0mzIbDFttJWXeLOcjRVxRgLA3woJi-e_ABld4C7Y6Ue6h0z5noiI8MqoCAO_rSdonlTIDbLNMf44-svcEWJKggCCtGlKh_GHivBsQwbDfF_m9_O3t_ba0E7_l7sdrj_agfbluTIok)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

"session" :
{
"sdp\_type" : "offer",
"sdp" : "<<RFC 8866 SDP>>"
} 

`biz_opaque_callback_data`

_String_

**Optional**

  

An arbitrary string you can pass in that is useful for tracking and logging purposes.

Any app subscribed to the "calls" webhook field on your WhatsApp Business Account can receive this string, as it is included in the `calls` object within the subsequent [Call Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/business-initiated-calls#call-terminate-webhook) payload.

Cloud API does not process this field.

Maximum 512 characters

`“0fS5cePMok”`

#### Success Response

{
  "messaging\_product": "whatsapp",
  "calls" : \[{
     "id" : "wacid.ABGGFjFVU2AfAgo6V",
   }\]
}

#### Error Response

Possible errors that can occur:

*   Invalid `phone-number-id`
*   Permissions/Authorization errors
*   Request format validation errors, e.g. connection info, sdp, ice
*   SDP validation errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

  

### Terminate Call

Use this endpoint to terminate an active call.

This must be done even if there is an `RTCP BYE` packet in the media path. Ending the call this way also ensures pricing is more accurate.

When the WhatsApp user terminates the call, you do not have to call this endpoint. Once the call is successfully terminated, a [Call Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/business-initiated-calls#call-terminate-webhook) will be sent to you.

#### Request Syntax

POST <PHONE\_NUMBER\_ID/calls

Parameter

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are terminating a call from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`18274459827`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "terminate"
}

#### Body Parameters

Parameter

Description

Sample Value

`call_id`

_String_

**Required**

  

The ID of the phone call.

For inbound calls, you receive a call ID from the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/business-initiated-calls#call-connect-webhook) when a WhatsApp user initiates the call.

`“wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh”`

`action`

_String_

**Required**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“terminate”`

#### Success Response

{
  "messaging\_product": "whatsapp",
  "success" : true
}

#### Error Response

Possible errors that can occur:

*   Invalid `call id`
*   Invalid `phone-number-id`
*   The WhatsApp user has already terminated the call
*   Reject call is already in progress
*   Permissions/Authorization errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Webhooks for business-initiated calling
---------------------------------------

With all Calling API webhooks, there is a `”calls”` object inside the `”value”` object of the webhook response. The `”calls”` object contains metadata about the call that is used to action on each call placed or received by your business.

To receive Calling API webhooks, subscribe to the "calls" webhook field.

[Learn more about Cloud API webhooks here](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object)

### Call Connect webhook

A webhook notification is sent in near real-time when a call initiated by your business is ready to be connected to the whatsapp user (an `SDP Answer`).

Critically, the webhook contains information required to establish a call connection via WebRTC.

Once you receive the Call Connect webhook, you can apply the `SDP Answer` recieved in the webhook to your WebRTC stack in order to initiate the media connection.

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "<WHATSAPP\_BUSINESS\_ACCOUNT\_ID>",
      "changes": \[
        {
          "value": {
            "messaging\_product": "whatsapp",
            "metadata": {
              "display\_phone\_number": "16315553601",
              "phone\_number\_id": "<PHONE\_NUMBER\_ID>"
            },
            "contacts": \[
              {
                "profile": {
                  "name": "<CALLEE\_NAME>"
                },
                "wa\_id": "16315553602"
              }
            \],
            "calls": \[
              {
                "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
                "to": "16315553601",
                "from": "16315553602",
                "event": "connect",
                "timestamp": "1671644824",
                "direction": "BUSINESS\_INITIATED",
                "session": {
                  "sdp\_type": "answer",
                  "sdp": "<<RFC 8866 SDP>>"
                }
              }
            \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

#### Webhook values for `"calls"`

Placeholder

Description

`id`

_String_

A unique ID for the call

`to`

_Integer_

The number being called (callee)

`from`

_Integer_

The number of the caller

`event`

_Integer_

The calling event that this webhook is notifying the subscriber of

`timestamp`

_Integer_

The UNIX timestamp of the webhook event

`direction`

_String_

The direction of the call being made.

Can contain either:

`BUSINESS_INITIATED`, for calls initiated by your business.

`USER_INITIATED`, for calls initiated by a WhatsApp user.

`session`

_JSON object_

**Optional**

  

Contains the session description protocol (SDP) type and description language.

Requires two values:

`sdp_type` — (_String_) **Required**

"offer", to indicate SDP offer

`sdp` — (_String_) **Required**

The SDP info of the device on the other end of the call. The SDP must be compliant with [RFC 8866](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8866%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEerTvhjirMsIr0t8qKHv3Q9HNCORjlwGE5dsj8wiyh7NRjz22V36MTyABVW80_aem_yuO6WlBBRwzKLwdk6TiYnw&h=AT0e3YbfuzdTAauqQh77GI8aKiNNBUptArBR6JcEcQX-XfbndtOYHvyjM3o8ZRu2ewXzDduzmsGp7HbuF9WLFHpghGMLQAnPNu_xgmGum1EA5IdytZa3p808tIrbiwTsDcEKJEzSdcM).

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeDZg9mIzCzH3XXm_vDALnHmwHL375OtL6dLmfh6NwRGh75My8U__lI9-ivV0_aem_c_aEAGnsWd490hPi6yjsYQ&h=AT0OzacoSMZ6rOvI11EM7cb6desSXE_gPzR0VrcDrpITgXFRe5se723KgzwjO_T2qkHs0InSbTm0eb2W4IqYCpQE5Ur2awg2Zx260EdAbHxKZtWfpyJEmUU2mTyHLsjaO_fflCUr0qU)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

`contacts`

_JSON object_

Profile information of the callee.

Contains two values:

`name` — The WhatsApp profile name of the callee.

`wa_id` — The WhatsApp ID of the callee.

  

### Call Status webhook

This webhook is sent during the following calling events:

1.  Ringing: When the WhatsApp user’s client device begins ringing
2.  Accepted: When the WhatsApp user accepts the call
3.  Rejected: When the call is rejected by the WhatsApp user. You'll also receive the call terminate webhook in this case

The Webhook structure here is similar to the Status webhooks used for the Cloud API messages.

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "<WHATSAPP\_BUSINESS\_ACCOUNT\_ID>",
      "changes": \[
        {
          "value": {
              "messaging\_product": "whatsapp",
              "metadata": {
                   "display\_phone\_number": "16315553601",
                   "phone\_number\_id": "<PHONE\_NUMBER\_ID>",
              },
              "statuses": \[{
                    "id": "wacid.ABGGFjFVU2AfAgo6V",
                    "timestamp": "1671644824",
                    "type": "call"
                    "status": "\[RINGING|ACCEPTED|REJECTED\]",
                    "recipient\_id": "163155536021",
                    "biz\_opaque\_callback\_data": "random\_string",
               }\]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

[_Learn more about Cloud API status webhooks_](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object)

#### Webhook values for `"statuses"`

Placeholder

Description

`id`

_String_

A unique ID for the call

`timestamp`

_Integer_

The UNIX timestamp of the webhook event

`recipient_id`

_Integer_

The phone number of the WhatsApp user receiving the call

`status`

_Integer_

The current call status.

Possible values:

`RINGING`: Business initiated call is ringing the user

`ACCEPTED`: Business initiated call is accepted by the user

`REJECTED`: Business initiated call is rejected by the user

`biz_opaque_callback_date`

_String_

Arbitrary string your business passes into the call for tracking and logging purposes.

Will only be returned if provided through [Initiate New Call API requests](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/business-initiated-calls#initiate-a-new-call)

  

### Call Terminate webhook

A webhook notification is sent whenever the call has been terminated for any reason, such as when the WhatsApp user hangs up, or when the business calls the `POST /<PHONE_NUMBER_ID>/calls` endpoint with an action of `terminate` or `reject`.

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "<WHATSAPP\_BUSINESS\_ACCOUNT\_ID>",
      "changes": \[
        {
          "value": {
              "messaging\_product": "whatsapp",
              "metadata": {
                   "display\_phone\_number": "16505553602",
                   "phone\_number\_id": "<PHONE\_NUMBER\_ID>",
              },
               "calls": \[
                {
                    "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
                    "to": "16315553601",
                    "from": "16315553602",
                    "event": "terminate"
                    "direction": "BUSINESS\_INITIATED",
                    "biz\_opaque\_callback\_data": "random\_string",
                    "timestamp": "1671644824",
                    "status" : \[FAILED | COMPLETED\],
                    "start\_time" : "1671644824",
                    "end\_time" : "1671644944",
                    "duration" : 120
                }
              \],
              "errors": \[
                {
                    "code": INT\_CODE,
                    "message": "ERROR\_TITLE",
                    "href": "ERROR\_HREF",
                    "error\_data": {
                        "details": "ERROR\_DETAILS"
                    }
                }
              \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

#### Webhook values for `"calls"`

Placeholder

Description

`id`

_String_

A unique ID for the call

`to`

_Integer_

The number being called (callee)

`from`

_Integer_

The number of the caller

`event`

_Integer_

The calling event that this webhook is notifying the subscriber of

`timestamp`

_Integer_

The UNIX timestamp of the webhook event

`direction`

_String_

The direction of the call being made.

Can contain either:

`BUSINESS_INITIATED`, for calls initiated by your business.

`USER_INITIATED`, for calls initiated by a WhatsApp user.

`start_time`

_Integer_

The UNIX timestamp of when the call started.

Only present when the call was picked up by the other party.

`end_time`

_Integer_

The UNIX timestamp of when the call ended.

Only present when the call was picked up by the other party.

`duration`

_Integer_

Duration of the call in seconds.

Only present when the call was picked up by the other party.

`biz_opaque_callback_date`

_String_

Arbitrary string your business passes into the call for tracking and logging purposes.

Will only be returned if provided through an [Initiate Call API request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/business-initiated-calls#initiate-call) or [Accept Call request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#accept-call)

[](#)

SDP Overview and Sample SDP Structures
--------------------------------------

Session Description Protocol (SDP) is a text-based format used to describe the characteristics of multimedia sessions, such as voice and video calls, in real-time communication applications. SDP provides a standardized way to convey information about the session's media streams, including the type of media, codecs, protocols, and other parameters necessary for establishing and managing the session.

In the context of WebRTC, SDP is used to negotiate the media parameters between the sender and receiver, enabling them to agree on the specifics of the media exchange.

[View SDP sample structures for business-initiated calls](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

[](#)

# Obtain User Call Permissions
============================


Overview
--------

If you want to place a call to a WhatsApp user, your business must receive user permission first. When a WhatsApp user grants call permissions, they are always temporary.

You can obtain calling permission from a WhatsApp user in any of the following ways:

1.  **Send a call permission request to the user** — Send a free-form or templated message requesting calling permission from the user
2.  **Callback permission is provided by the WhatsApp user** —The WhatsApp user automatically provides temporary call permissions by placing a call to the business. The [callback setting must be enabled](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#configure-update-business-phone-number-calling-settings) on the business phone number.
3.  **WhatsApp user provides call permission via Business Profile** — The WhatsApp user provides call permissions to the business through their business profile.

### Limits (Per business + WhatsApp user pair)

*   Temporary permissions are **granted for 7 calendar days (168 hours)**
    *   Calculated as the number of seconds in a day multiplied by 7, from time of user’s approval.
*   Your business can make only **5 connected calls every 24 hours**
*   These limits are on the **business phone number**

These limits are in place to protect WhatsApp users from unwanted calls

[](#)

Call permission request basics
------------------------------

You may proactively request a calling permission from a WhatsApp user by sending a permission request message, either as a:

*   Free form interactive message
*   Template message

The WhatsApp user may approve, decline, or simply not respond to a call permission request.

**With permissioning, the WhatsApp user is in control.** Even if the user provides calling permission, they can revoke that granted permission request at any time. Conversely, if the user declines a permission request, they can still grant calling permission, up until the permission request expires.

**A call permission request expires** when any of the following occurs:

*   The WhatsApp user interacts with a subsequent new call permission request from the business
*   7 days after the permission was accepted or declined by the consumer
*   7 days after the permission was delivered if the consumer does not respond to the request

[View client UI behavior for expired permission requests](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions#call-permission-request-expiration-scenarios)

To ensure an optimal user experience around business initiated calling, the following limits are enforced:

1.  **When sending a calling permission request message**
    
    *   Maximum of 1 permission request in 24h
    *   Maximum 2 permission requests within 7 days.
        *   _These limits reset when any connected call (business-initiated/user-initiated) is made between the business and WhatsApp user._
        *   _These limits apply toward permissions requests sent either as free form or template messages._
2.  **When business-initiated calls go unanswered or are rejected**
    
    *   2 consecutive unanswered calls result in system message to reconsider an approved permission
    *   4 consecutive unanswered calls result in an approved permission being automatically revoked. The user may again update this if they so choose.

[View client UI behavior for consecutive unanswered calls](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions#consecutive-unanswered-calls)

[](#)

Free form vs template call permission request message
-----------------------------------------------------

Call permission request messages are subject to [messaging charges](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)

A call permission request message can be sent to users in one of the following ways:

**Send a free form message**

*   When you are within a customer service window with a WhatsApp user, you can send a free form message with a call permission request.
*   Although a text body will be optional, you should send one to build context with the user. In the case of free form calling permission request messages, header and footer sections are not supported.
*   Since the customer service window is open, there is no need to create a conversation window.

**Create and send a template message**

*   Sending a template message allows you to initiate a user conversation with a call permission request.
*   Context (i.e. a text body) is required when sending a template message with a call permission request.
*   With template messages, you can further customize your permission request by adding a message header and footer.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=725187926708148&version=1749607928)

[](#)

Client Application UI Experience
--------------------------------

### Call permission request flow and sample messages

Click the dropdowns below to see UI images

Call permission request flow

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1091825416094403&version=1749603790)

Free form message (with header, footer and body)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1410228683520843&version=1749601899)

Free form message (body only)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1795278694353628&version=1749602255)

Template message (no text body)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=724301996758810&version=1749602752)

Template message (body only)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=648553858207690&version=1749602739)

### Consecutive unanswered calls

Click the dropdowns below to see UI images

2 consecutive unanswered calls — System message for user to update permission

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1007337364722698&version=1749604383)

4 consecutive unanswered calls — Permissions automatically revoked

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1455607722554344&version=1749604391)

### Call permission request expiration scenarios

Click the dropdowns below to see UI images

Permission request expires after 7 days — User interacts with request

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=421286877746643&version=1749604625)

Permission request expires after 7 days — User does not interact

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2902395536633753&version=1749604880)

Previous permission request expires immediately — User does not interact / New call permission request is received

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=646812688395703&version=1749605064)

Previous permission request expires immediately — User allows / Interacts with the new request

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1438473433828839&version=1749605402)![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2409997942715362&version=1749605636)

### Call permissions provided through user-initiated call

A user initiated call to a business is considered as a strong signal of a user’s willingness to converse with a business and hence results in a granted call permission being sent to the business.

This feature is disabled by default and needs to be explicitly enabled for a business phone number via the call settings api.

[Learn how to configure callback settings](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#configure-update-business-phone-number-calling-settings)

Click the dropdowns below to see UI images

Call permissions provided to business — User calls business

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=4000887023574435&version=1749607123)

[](#)

Send free form call permission request message
----------------------------------------------

Call permission request messages are subject to [messaging charges](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)

Use this endpoint to send a free form interactive message with a call permission request during a [customer service window](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#customer-service-windows). A standard [message status webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object) will be sent in response to this message send.

**Note:** The call permission request interactive object cannot be edited by the business. Only the message body can be customized.

[See how this message is rendered on the WhatsApp client](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions#call-permission-request-flow-and-sample-messages)

#### Request syntax

POST <PHONE\_NUMBER\_ID\>/messages

Parameter

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are sending messages from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+18274459827`

#### Request body

{
  "messaging\_product": "whatsapp",
  "recipient\_type": "individual",
  "to": "<PHONE\_NUMBER\_ID> or <WHATSAPP\_ID>",
  "type": "interactive",
  "interactive": {
    "type": "call\_permission\_request",
    "action": {
      "name": "call\_permission\_request"
    },
    "body": {
      "text": "We would like to call you to help support your query on Order No: ON-12853."
    }
  }
}

#### Body parameters

Parameter

Description

Sample Value

`to`

_Integer_

**Required**

  

The phone number of the WhatsApp user you are messaging

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+17863476655`

`type`

_String_

**Required**

  

The type of interactive message you are sending.

In this case, you are sending a `call_permission_request`.

[Learn more about interactive messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/#interactive-object)

`“call_permission_request”`

`action`

_String_

**Required**

  

The action of your interactive message.

Must be `call_permission_request`.

`“call_permission_request”`

`body`

_String_

**Optional**

  

The body of your message.

Although this field is optional, it is highly recommended you give context to the WhatsApp user when you request permission to call them.

`“Allow us to call you so we can support you with your order.`

#### Success response

{
  "messaging\_product": "whatsapp",
  "contacts": \[{
      "input": "+1-408-555-1234",
      "wa\_id": "14085551234",
    }\]
  "messages": \[{
      "id": "wamid.gBGGFlaCmZ9plHrf2Mh-o",
    }\]
}

[_Learn more about messaging success responses_](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/#successful-response)

#### Error response

Possible errors that can occur:

*   Invalid `phone-number-id`
*   Permissions/Authorization errors
*   Rate limit reached
*   Sending this message to users on older app versions will result in error webhook with error code [131026](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes/)
*   Calling not enabled

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Create and send call permission request template messages
---------------------------------------------------------

Call permission request messages are subject to [messaging charges](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)

Use these endpoints to create and send a call permission request message template.

Once your permission request template message is created, your business can send the template message to the user as a call permission request outside of a customer service window.

[Learn more about creating and managing message templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)

### Create message template

Use this endpoint to create a call permission request message template.

#### Request syntax

POST/<WHATSAPP\_BUSINESS\_ACCOUNT\_ID\>/message\_templates

Parameter

Description

Sample Value

`<WHATSAPP_BUSINESS_ACCOUNT_ID>`

_String_

**Required**

  

Your WhatsApp Business Account ID.

[Learn how to find your WABA ID](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/whatsapp-business-accounts)

`“waba-90172398162498126”`

#### Request body

{
  "name": "sample\_cpr\_template",
  "language": "en",
  "category": "\[MARKETING|UTILITY\]",
  "components": \[
     {
      "type": "HEADER",
      "text": "Support of Order No: {{1}}",
      "example": {
        "body\_text": \[
          \[
            "ON-12345"
          \]
        \]
      }
    },    
    {
      "type": "BODY",
      "text": "We would like to call you to help support your query on Order No: {{1}} for the item {{2}}.",
      "example": {
        "body\_text": \[
          \[
            "ON-12345",
            "Avocados"
          \]
        \]
      }
    },
    {
      "type": "FOOTER",
      "text": "Talk to you soon!"
    },
    {
      "type": "call\_permission\_request"
    }
  \]
}

#### Body parameters

Creating and managing template messages can be done both through Cloud API and the WhatsApp Business Manager interface.

When creating your call permission request template, ensure you configure `type` as `call_permission_request`.

[Learn more about creating and managing message templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)

Parameter

Description

Sample Value

`type`

_String_

**Required**

  

The type of template message you are creating.

In this case, you are creating a `call_permission_request`.

`“call_permission_request”`

#### Template status response

{
  "id": "<ID>",
  "status": "<STATUS>",
  "category": "<CATEGORY>"
}

[_Learn more about template status response_](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates#template-status)

#### Error response

Possible errors that can occur:

*   Invalid WABA id
*   Permissions/Authorization errors
*   Template structure/component validation alerts

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

### Send message template

Use this endpoint to send a call permission request message template

The following is a simplified sample of the send template message request, however you can [learn more about how to send message templates here.](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

#### Request syntax

POST/<PHONE\_NUMBER\_ID\>/messages

Parameter

Description

Sample Value

`<PHONE_NUMBER_ID>`

_String_

**Required**

  

The business phone number which you are sending a message from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+18762639988`

#### Request body

{
  "messaging\_product": "whatsapp",
  "recipient\_type": "individual",
  "to": "+13287759822", // The WhatsApp user who will recieve the template message
  "type": "template",
  "template": {
    "name": "sample\_cpr\_template", // The call permission request template name
    "language": {
      "code": "en"
    },
    "components": \[ // Body text parameters such as customer name and order number
      {
        "type": "body",
        "parameters": \[
          {
            "type": "text",
            "text": "John Smith"
          },
          {
            "type": "text",
            "text": "order #1522"
          }
        \]
      }
    \]
  }
}

[Learn more about sending template messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

[](#)

Get current call permission state
---------------------------------

Use this endpoint to get the call permission state for a business phone number with a single WhatsApp user phone number.

### Request syntax

GET /<PHONE\_NUMBER\_ID\>/call\_permissions?user\_wa\_id\=<CONSUMER\_WHATSAPP\_ID\>

### Request parameters

Parameter

Description

Sample Value

`<PHONE_NUMBER_ID>`

_String_

**Required**

  

The business phone number you are fetching permissions against.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+18762639988`

`<CONSUMER_WHATSAPP_ID>`

_Integer_

**Required**

  

The phone number of the WhatsApp user who you are requesting call permissions from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+13057765456`

#### Response body

{
  "messaging\_product": "whatsapp",
  "permission": {
    "status": "temporary",
    "expiration\_time": 1745343479
  },
  "actions": \[
    {
      "action\_name": "send\_call\_permission\_request",
      "can\_perform\_action": true,
      "limits": \[
        {
          "time\_period": "PT24H",
          "max\_allowed": 1,
          "current\_usage": 0,
        },
        {
          "time\_period": "P7D",
          "max\_allowed": 2,
          "current\_usage": 1,
        }
      \]
    },
    {
      "action\_name": "start\_call",
      "can\_perform\_action": false,
      "limits": \[
        {
          "time\_period": "PT24H",
          "max\_allowed": 5,
          "current\_usage": 5,
          "limit\_expiration\_time": 1745622600,
        }
      \]
    }
  }
}

#### Response parameters

Parameter

Description

`permission`

_JSON Object_

The permission object contains two values:

`status` _(String)_ — The current status of the permission.

Can be either:

*   `“no_permission”`
*   `"temporary"`

`expiration` _(Integer)_ — The Unix time at which the permission will expire in UTC timezone.

`actions`

_JSON Object_

A list of actions a business phone number may undertake to facilitate a call permission or a business initiated call.

Current actions are:

`send_call_permission_request`: Represents the action of sending new call permissions request messages to the WhatsApp user.

`start_call`: Represents the action of establishing a new call with the WhatsApp user. Establishing a new call means that the call was successfully picked up by the consumer.

For example, `send_call_permission_request` having a `can_perform_action` of `true` means that your business can send a call permission request to the WhatsApp user in question

`can_perform_action` (_Boolean_) —

A flag indicating whether the action can be performed now, taking into account all limits.

`limits`

_JSON Object_

A list of time-bound restrictions for the given `action_name`.

Each `action_name` has 1 or more restrictions depending on the timeframe.

For example, a business can only send 2 permission requests in a 24-hour period.

`limits` contains the following fields:

`time_period` (_String_) — The span of time in which the limit applies, represented in the ISO 8601 format.

`max_allowed` (_Integer_) — The maximum number of actions allowed within the specified time period.

`current_usage` (_Integer_) — The current number of actions the business has taken within the specified time period.

`limit_expiration_time` (_Integer_) — The Unix time at which the limit will expire in UTC timezone.

If `current_usage` is under the max allowed for the limit, this field won’t be present.

#### Error response

Possible errors that can occur:

*   Invalid `phone-number-id`
*   If the consumer phone number is uncallable, the api response will be `no_permission`.
*   Permissions/Authorization errors.
*   Rate limit reached. A maximum of 5 requests in a 1 second window can be made to the API.
*   Calling is not enabled for the business phone number.

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

User calling permission request webhook
---------------------------------------

This webhook is sent back after requesting user calling permissions.

The webhook changes depending on if the user:

*   accepts or rejects the request
*   gives permission by responding to a request or by calling the business

#### Webhook sample

{
. . .
  "interactive": {
     "type":  "call\_permission\_reply",
     "call\_permission\_reply": {
          "response": "accept",
          "expiration\_timestamp": {timestamp},
          "response\_source": "\[user\_action|automatic\]"
     }
  }
. . .
}

#### Webhook values

Placeholder

Description

`response`

_String_

The WhatsApp users response to the call permission request message

Can be `accept` or `reject`

`expiration_timestamp`

_Integer_

Time in seconds when this call permission expires if the WhatsApp user approved it

`response_source`

_String_

The source of this permission

Possible values for accepted call permissions are:

*   `user_action`: User approved or rejected the permission
*   `automatic`: An automatic permission approval due to the WhatsApp user initiating the call

[](#)


# User-initiated Calls
====================


Overview
--------

The Calling API supports receiving calls made by WhatsApp users to your business.

Your business dictates when calls can be received by [configuring business calling hours and holiday unavailability](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings#parameter-details).

[](#)

Prerequisites
-------------

Before you get started with user-initiated calling, ensure that:

*   [Enable Calling API features on your business phone number](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/call-settings)
*   Subscribe to the "calls" webhook field

### Call sequence diagram

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1609679066656382&version=1749613548)

[](#)

User-initiated calling flow
---------------------------

### Part 1: A WhatsApp user calls your business from their client app

When a WhatsApp user calls your business, a Call Connect webhook will be triggered with an `SDP Offer`:

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "366634483210360", // WhatsApp Business Account ID associated with the business phone number
      "changes": \[
        {
          "value": {
            "messaging\_product": "whatsapp",
            "metadata": { // ID and display number for the business phone number placing the call (caller)
              "phone\_number\_id": "436666719526789",
              "display\_phone\_number": "13175551399",
            },
            "calls": \[
              {
                "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh", // The WhatsApp call ID
                "to": "16315553601", // The WhatsApp user's phone number (callee)
                "from": "13175551399",
                "event": "connect",
                "timestamp": "1671644824",
                "session": {
                  "sdp\_type": "offer",
                  "sdp": "<<RFC 8866 SDP>>"
                }
              }
            \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

### Part 2: Your business pre-accepts the call (Recommended)

In essence, when you pre-accept an inbound call, you are allowing the calling media connection to be established before attempting to send call media through the connection.

Pre-accepting calls is recommended because it facilitates faster connection times and avoids [audio clipping issues](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting#audio-clipping-issue-and-solution).

To pre-accept, You call the `POST <PHONE_NUMBER_ID>/calls` endpoint with the `call_id` from the previous webhook, an `action` of `pre-accept`, and an `SDP Answer`:

POST <PHONE\_NUMBER\_ID\>/calls
{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "pre\_accept",
  "session": {
     "sdp\_type": "answer"
     "sdp": "<<RFC 8866 SDP>>"
  }
}

If there are no errors, you’ll receive a success response:

{
  "success" : true
}

### Part 3: Your business accepts the call after the WebRTC connection is made

Once the WebRTC connection is made on your end, you can accept the call.

Once you accept the call, wait until you receive a `200 OK` back from the endpoint. Media will begin flowing immediately since the connection was established prior to call connect.

You can now call the `POST <PHONE_NUMBER_ID>/calls` endpoint with the following request body to accept the call:

POST <PHONE\_NUMBER\_ID\>/calls
{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "accept",
  "session" : {
      "sdp\_type" : "answer",
      "sdp" : "<<RFC 8866 SDP>>"
   },
}

### Part 4: Your business or the WhatsApp user terminates the call

Both the business or the WhatsApp user can terminate the call at any time.

You call the `POST <PHONE_NUMBER_ID>/calls` endpoint with the following request body to terminate the call:

POST <PHONE\_NUMBER\_ID\>/calls
{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action" : "terminate"
}

If there are no errors, you’ll receive a success response:

{
  "success" : true
}

When either the business or the WhatsApp user terminates the call, you receive a Call Terminate webhook:

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "366634483210360", // WhatsApp Business Account ID associated with the business phone number
      "changes": \[
        {
          "value": {
            "messaging\_product": "whatsapp",
            "metadata": { // ID and display number for the business phone number placing the call (caller)
              "phone\_number\_id": "436666719526789"
              "display\_phone\_number": "13175551399",

            },
            "calls": \[
              {
                "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
                "to": "16315553601", // The WhatsApp user's phone number (callee)
                "from": "13175551399", // The business phone number placing the call (caller)
                "event": "terminate",
                "direction": "USER\_INITIATED",
                "timestamp": "1749197480",
                "status": \["Failed", "Completed"\],
                "start\_time": "1671644824", // Call start UNIX timestamp
                "end\_time": "1671644944", // Call end UNIX timestamp
                "duration": 480 // Call duration in seconds
              }
            \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

[](#)

Endpoints for user-initiated calling
------------------------------------

### Pre-accept call

In essence, when you pre-accept an inbound call, you are allowing the calling media connection to be established before attempting to send call media through the connection.

When you then call the accept call endpoint, media begins flowing immediately since the connection has already been established

Pre-accepting calls is recommended because it facilitates faster connection times and avoids [audio clipping issues](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting#audio-clipping-issue-and-solution).

There is about 30 to 60 seconds after the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) is sent for the business to accept the phone call. If the business does not respond, the call is terminated on the WhatsApp user side with a "Not Answered" notification and a [Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook) is delivered back to you.

**Note:** Since the WebRTC connection is established before calling the [Accept Call endpoint](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#accept-call), make sure to flow the call media only after you receive a 200 OK response back.

If call media flows too early, the caller will miss the first few words of the call. If call media flows too late, callers will hear silence.

#### Request Syntax

POST <PHONE\_NUMBER\_ID/calls

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are using Calling API features from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "pre\_accept",
  "session" : {
      "sdp\_type" : "answer",
      "sdp" : "<<RFC 8866 SDP>>"
   }   
}

#### Body Parameters

Parameter

Description

Sample Value

`call_id`

_String_

**Required**

  

The ID of the phone call.

For inbound calls, you receive a call ID from the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) when a WhatsApp user initiates the call.

`“wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh”`

`action`

_String_

**Optional**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“pre_accept”`

`session`

_JSON object_

**Optional**

  

Contains the session description protocol (SDP) type and description language.

Requires two values:

`sdp_type` — (_String_) **Required**

"offer", to indicate SDP offer

`sdp` — (_String_) **Required**

The SDP info of the device on the other end of the call. The SDP must be compliant with [RFC 8866](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8866%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeVKFgLlMlYHwAxGoJDKkyl7udrVakfeejrE-84lhegdhjVyyQOqO3SKH6mfQ_aem_QEYN3woURr7QnZ8Ju2tbjw&h=AT2m5kGzXnnjeMai2TS6yU88_0oxknrQccUe7B7DLYBjhusI8GwQQv_bVvfTodvlUZxVFOxLuzMZjrNg9RviqVSFs-PT3tleQiygKz6MrP37DXZm2dQ-VsGCkq88t_acLBPw2toJpQo).

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeJYJBE42b3-f0yruuu6PbZVDa1LeSeZ8g6PoDkX6gezk5YnxdgHcaINu8CKk_aem_fnjobse7_-UShMb62gb8Hg&h=AT24ZN4Rb987bgaMbk_qLGliWfINPI_yHx4FHFY5sNfXkJ3xLMy_U16YWmpbZL4S0LKh9QtRdp3NmV-cE9Vvb2NoH-PAJrCjw8FdVTXu6eu5gvu9o1LwMXbuPhKSQ7mpd4a4VUu5bq0)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

"session" :
{
"sdp\_type" : "offer",
"sdp" : "<<RFC 8866 SDP>>"
} 

#### Success Response

{
  "messaging\_product": "whatsapp",
  "success" : true
}

#### Error Response

Possible errors that can occur:

*   Invalid `call-id`
*   Invalid `phone-number-id`
*   Error related to your payment method
*   Invalid Connection info eg sdp, ice
*   Accept/Reject an already In Progress/Completed/Failed call
*   Permissions/Authorization errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

  

### Accept call

Use this endpoint to connect to a call by providing a call agent's SDP.

You have about 30 to 60 seconds after the [Call Connect Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) is sent to accept the phone call. If your business does not respond, the call is terminated on the WhatsApp user side with a "Not Answered" notification and a [Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook) is delivered back to you.

#### Request Syntax

POST <PHONE\_NUMBER\_ID/calls

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are using Calling API features from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "accept",
  "session" : {
      "sdp\_type" : "answer",
      "sdp" : "<<RFC 8866 SDP>>"
   },
   "biz\_opaque\_callback\_data": "random\_string",
  }
}

#### Body Parameters

Parameter

Description

Sample Value

`call_id`

_String_

**Required**

  

The ID of the phone call.

For inbound calls, you receive a call ID from the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) when a WhatsApp user initiates the call.

`“wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh”`

`action`

_String_

**Optional**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“accept”`

`session`

_JSON object_

**Optional**

  

Contains the session description protocol (SDP) type and description language.

Requires two values:

`sdp_type` — (_String_) **Required**

"offer", to indicate SDP offer

`sdp` — (_String_) **Required**

The SDP info of the device on the other end of the call. The SDP must be compliant with [RFC 8866](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8866%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeVKFgLlMlYHwAxGoJDKkyl7udrVakfeejrE-84lhegdhjVyyQOqO3SKH6mfQ_aem_QEYN3woURr7QnZ8Ju2tbjw&h=AT3HMxCyTTGpxBbkBklITAW57LJnX2sXzp7QJZBdFOyruRbM5O0qeu3zh6iZXY-7qm6laAeijHxJq31YUeTLzT0FkAH7TgRZE4fPOWjr3HsC37KJhT26YhGYR0XKApVkE4kNWPNuIyQ).

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeJYJBE42b3-f0yruuu6PbZVDa1LeSeZ8g6PoDkX6gezk5YnxdgHcaINu8CKk_aem_fnjobse7_-UShMb62gb8Hg&h=AT0qre98Wx_Q0UUxyMkcY7XLWYSrgzyLP2bMfOslPjGVCxVnHLJsVSjQ71ZNs64CSyJJLnC9ch-srPSWYnB-eAZbhy2iHDCQezzY1dhpzEPQQHZ2diV5LGI-13zs-iaeNbbYlaB5WeiopjbjkNobMtuQ)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

"session" :
{
"sdp\_type" : "offer",
"sdp" : "<<RFC 8866 SDP>>"
} 

`biz_opaque_callback_data`

_String_

**Optional**

  

An arbitrary string you can pass in that is useful for tracking and logging purposes.

Any app subscribed to the "calls" webhook field on your WhatsApp Business Account can receive this string, as it is included in the `calls` object within the subsequent [Terminate webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook) payload.

Cloud API does not process this field, it just returns it as part of the [Terminate webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook).

Maximum 512 characters

`“8huas8d80nn”`

#### Success Response

{
  "messaging\_product": "whatsapp",
  "success" : true
}

#### Error Response

Possible errors that can occur:

*   Invalid `call-id`
*   Invalid `phone-number-id`
*   Error related to your payment method
*   Invalid Connection info eg sdp, ice etc
*   Accept/Reject an already In Progress/Completed/Failed call
*   Permissions/Authorization errors
*   SDP answer provided in accept does not match the SDP answer given in the [Pre-Accept endpoint](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#pre-accept-call) for the same `call-id`

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

  

### Reject call

Use this endpoint to reject a call.

You have about 30 to 60 seconds after the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) is sent to accept the phone call. If the business does not respond the call is terminated on the WhatsApp user side with a "Not Answered" notification and a [Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook) is delivered back to you.

#### Request Syntax

POST <PHONE\_NUMBER\_ID/calls

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are using Calling API features from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "reject"
}

#### Body Parameters

Parameter

Description

Sample Value

`call_id`

_String_

**Required**

  

The ID of the phone call.

For inbound calls, you receive a call ID from the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) when a WhatsApp user initiates the call.

`“wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh”`

`action`

_String_

**Optional**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“reject”`

#### Success Response

{
  "messaging\_product": "whatsapp",
  "success" : true
}

#### Error Response

Possible errors that can occur:

*   Invalid `call-id`
*   Invalid `phone-number-id`
*   Accept/Reject an already In Progress/Completed/Failed call
*   Permissions/Authorization errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

  

### Terminate call

Use this endpoint to terminate an active call.

This must be done even if there is an `RTCP BYE` packet in the media path. Ending the call this way also ensures pricing is more accurate.

When the WhatsApp user terminates the call, you do not have to call this endpoint. Once the call is successfully terminated, a [Call Terminate Webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-terminate-webhook) will be sent to you.

#### Request Syntax

POST <PHONE\_NUMBER\_ID/calls

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number which you are using Calling API features from.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request Body

{
  "messaging\_product": "whatsapp",
  "call\_id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
  "action": "terminate"
}

#### Body Parameters

Parameter

Description

Sample Value

`call_id`

_String_

**Required**

  

The ID of the phone call.

For inbound calls, you receive a call ID from the [Call Connect webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#call-connect-webhook) when a WhatsApp user initiates the call.

`“wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh”`

`action`

_String_

**Optional**

  

The action being taken on the given call ID.

Values can be `connect` | `pre_accept` | `accept` | `reject` | `terminate`

`“terminate”`

#### Success Response

{
  "messaging\_product": "whatsapp",
  "success" : true
}

#### Error Response

Possible errors that can occur:

*   Invalid `call-id`
*   Invalid `phone-number-id`
*   Accept/Reject an already In Progress/Completed/Failed call
*   Reject call is already in progress
*   Permissions/Authorization errors

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Webhooks for user-initiated calling
-----------------------------------

With all Calling API webhooks, there is a `”calls”` object inside the `”value”` object of the webhook response. The `”calls”` object contains metadata about the call that is used to action on each call received by your business.

To receive Calling API webhooks, subscribe to the calls webhook field.

[Learn more about Cloud API webhooks here](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object)

### Call Connect webhook

A webhook notification is sent in near real-time when a call initiated by your business is ready to be connected to the whatsapp user (an `SDP Answer`).

Critically, the webhook contains information required to establish a call connection via WebRTC.

Once you receive the Call Connect webhook, you can apply the `SDP Answer` recieved in the webhook to your WebRTC stack in order to initiate the media connection.

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "<WHATSAPP\_BUSINESS\_ACCOUNT\_ID>",
      "changes": \[
        {
          "value": {
            "messaging\_product": "whatsapp",
            "metadata": {
              "display\_phone\_number": "16315553601",
              "phone\_number\_id": "<PHONE\_NUMBER\_ID>"
            },
            "contacts": \[
              {
                "profile": {
                  "name": "<CALLEE\_NAME>"
                },
                "wa\_id": "16315553602"
              }
            \],
            "calls": \[
              {
                "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
                "to": "16315553601",
                "from": "16315553602",
                "event": "connect",
                "timestamp": "1671644824",
                "direction": "BUSINESS\_INITIATED",
                "session": {
                  "sdp\_type": "answer",
                  "sdp": "<<RFC 8866 SDP>>"
                }
              }
            \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

#### Webhook values for `"calls"`

Placeholder

Description

`id`

_String_

A unique ID for the call

`to`

_Integer_

The number being called (callee)

`from`

_Integer_

The number of the caller

`event`

_Integer_

The calling event that this webhook is notifying the subscriber of

`timestamp`

_Integer_

The UNIX timestamp of the webhook event

`direction`

_String_

The direction of the call being made.

Can contain either:

`BUSINESS_INITIATED`, for calls initiated by your business.

`USER_INITIATED`, for calls initiated by a WhatsApp user.

`session`

_JSON object_

**Optional**

  

Contains the session description protocol (SDP) type and description language.

Requires two values:

`sdp_type` — (_String_) **Required**

"offer", to indicate SDP offer

`sdp` — (_String_) **Required**

The SDP info of the device on the other end of the call. The SDP must be compliant with [RFC 8866](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc8866%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeVKFgLlMlYHwAxGoJDKkyl7udrVakfeejrE-84lhegdhjVyyQOqO3SKH6mfQ_aem_QEYN3woURr7QnZ8Ju2tbjw&h=AT2nJzY6Zruxuap7ymV4fM2qHVx1qkueKLnKnBMCwTtOVouBJWFF0GeUq1VLrvm37Zz5IpBYmXKz1j-mDJb01EIZjPJyR-5Dmst-88m0ICfVPkPmK0_xyJfQKYvHZYx9CJG3-WjQ924).

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeJYJBE42b3-f0yruuu6PbZVDa1LeSeZ8g6PoDkX6gezk5YnxdgHcaINu8CKk_aem_fnjobse7_-UShMb62gb8Hg&h=AT2BP_puaTjZWC3-b-qzzwQfrW0nuVk44c4UdnkkAirYvx9GTpEY5Jrg8INa5CB-K83DrdA9rP3xBwI7hcanNjwjDQbRMYNl13pnTQd0NOjw_Eu7IeMlR1KdYynEMTQZiyouUdJwNw0)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

`contacts`

_JSON object_

Profile information of the callee.

Contains two values:

`name` — The WhatsApp profile name of the callee.

`wa_id` — The WhatsApp ID of the callee.

  

### Call Terminate webhook

A webhook notification is sent whenever the call has been terminated for any reason, such as when the WhatsApp user hangs up, or when the business calls the `POST /<PHONE_NUMBER_ID>/calls` endpoint with an action of `terminate` or `reject`.

{
  "object": "whatsapp\_business\_account",
  "entry": \[
    {
      "id": "<WHATSAPP\_BUSINESS\_ACCOUNT\_ID>",
      "changes": \[
        {
          "value": {
              "messaging\_product": "whatsapp",
              "metadata": {
                   "display\_phone\_number": "16505553602",
                   "phone\_number\_id": "<PHONE\_NUMBER\_ID>",
              },
               "calls": \[
                {
                    "id": "wacid.ABGGFjFVU2AfAgo6V-Hc5eCgK5Gh",
                    "to": "16315553601",
                    "from": "16315553602",
                    "event": "terminate"
                    "direction": "BUSINESS\_INITIATED",
                    "biz\_opaque\_callback\_data": "random\_string",
                    "timestamp": "1671644824",
                    "status" : \[FAILED | COMPLETED\],
                    "start\_time" : "1671644824",
                    "end\_time" : "1671644944",
                    "duration" : 120
                }
              \],
              "errors": \[
                {
                    "code": INT\_CODE,
                    "message": "ERROR\_TITLE",
                    "href": "ERROR\_HREF",
                    "error\_data": {
                        "details": "ERROR\_DETAILS"
                    }
                }
              \]
          },
          "field": "calls"
        }
      \]
    }
  \]
}

#### Webhook values for `"calls"`

Placeholder

Description

`id`

_String_

A unique ID for the call

`to`

_Integer_

The number being called (callee)

`from`

_Integer_

The number of the caller

`event`

_Integer_

The calling event that this webhook is notifying the subscriber of

`timestamp`

_Integer_

The UNIX timestamp of the webhook event

`direction`

_String_

The direction of the call being made.

Can contain either:

`BUSINESS_INITIATED`, for calls initiated by your business.

`USER_INITIATED`, for calls initiated by a WhatsApp user.

`start_time`

_Integer_

The UNIX timestamp of when the call started.

Only present when the call was picked up by the other party.

`end_time`

_Integer_

The UNIX timestamp of when the call ended.

Only present when the call was picked up by the other party.

`duration`

_Integer_

Duration of the call in seconds.

Only present when the call was picked up by the other party.

`biz_opaque_callback_date`

_String_

Arbitrary string your business passes into the call for tracking and logging purposes.

Will only be returned if provided through an [Initiate Call request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#initiate-call) or [Accept Call request](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-initiated-calls#accept-call)

[](#)

Dual tone multi frequency (DTMF) support
----------------------------------------

**The dialpad provided by the Calling API only supports DTMF use cases.**

It does not support consumer-to-consumer calls and does not change any other calling behaviors. For example, the dialpad cannot be used to dial a number and initiate a call or message on WhatsApp.

WhatsApp Business Calling API supports DTMF tones, with the intention to enable BSP applications to support IVR-based systems.

WhatsApp users can press tone buttons on their client app and these DTMF tones are injected into the WebRTC RTP stream established as a part of the VoIP connection.

Our WebRTC stream conforms to [RFC 4733](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc4733%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeM5HxOyRatxiz20WfTOq_YlD3N-VbB8hTUvKhdFmChXTL-JgFENuuMAX_w-c_aem_JnDvUct0LU1pJrCFBBvdYQ&h=AT1h_KaCy1p5R4Xx1-DNuKLSqT-MG0z9kF_fUMpiui4X2-LkY5mSHoUk1d1tKaOcnY2j0BdeVq09Fn8NknVIzPwKYzOPvpg9gC6syey-kc5YAVHc8uAEQikLYcHEWntjs_aFB3-9SvI) for the transfer of DTMF Digits via RTP Payload.

There is no webhook for conveying DTMF digits.

### Sending DTMF digits on consumer WhatsApp client

WhatsApp client applications are enhanced to have a dialpad for calls with CloudAPI business phone numbers. The WhatsApp user can press the buttons on the dialpad and send DTMF tones.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=4161893324131796&version=1749622164)

[](#)

SDP Overview and Sample SDP Structures
--------------------------------------

Session Description Protocol (SDP) is a text-based format used to describe the characteristics of multimedia sessions, such as voice and video calls, in real-time communication applications. SDP provides a standardized way to convey information about the session's media streams, including the type of media, codecs, protocols, and other parameters necessary for establishing and managing the session.

In the context of WebRTC, SDP is used to negotiate the media parameters between the sender and receiver, enabling them to agree on the specifics of the media exchange.

[View SDP sample structures for user-initiated calls](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

[](#)


# Configure and Use Session Initiation Protocol (SIP)
===================================================


When SIP is enabled, you **cannot use calling related Graph API endpoints** and **calling related webhooks are not sent**.

Overview
--------

Session Initiation Protocol ([SIP](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3261%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEevQGtJuNwAJkxo9pfb4vSx1nRrMY45vP8JHZajCzYB_tcjPzh8IQBVPdmcgs_aem_vPAfxYVbpM28_Ixiyf-IPw&h=AT3t9I42hmIwFplxFGVbirEwnR7KtVGqjeKXh_ld-GyjWvsqXtN4T9WCXr-G_haqP2_QvcafRZktolRwjo1hRAdkUoDYB3PfE6N3oY1e7mjMhGRmFkA5lBiQVq7p5GSeAKIXVqBJako)) is a signaling protocol used for initiating, maintaining, modifying, and terminating real-time communication sessions between two or more endpoints.

WhatsApp Business Calling API supports use of SIP as the signaling protocol instead of our Graph API endpoints and Webhooks.

### Before you get started

Before you get started with SIP call signaling, confirm the following:

*   Your app has messaging permissions for the business phone number you want to enable SIP for.
    *   Test this by sending and receiving messages using Graph API messaging endpoints, then use the same app to configure your SIP server on the business phone number for calling.
*   Your app mode is “Live”, not “Development”.

### Signaling and media possible configurations

  

Default configuration after enabling calling

SIP with WebRTC

SIP with SDES media

Signaling protocol

Graph APIs + Webhooks

SIP (needs explicit [enablement](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#configure-update-sip-settings-on-business-phone-number))

SIP (needs explicit [enablement](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#configure-update-sip-settings-on-business-phone-number))

Media protocol

WebRTC (ICE + DTLS + SRTP)

WebRTC (ICE + DTLS + SRTP)

[SDES](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc4568%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeEQnyRvheNBLL_eSlSz5_2ZO36YU0wM801x29InUdIaeIbN6cR2CAR38-igU_aem_YOjg25dzFtLfFCIW2Atnug&h=AT2MqxEuhXruGvN0Pb6Y1r17LCo5KBhlJ-Vby98aOVI0EBwjZj0_2MDcFhsT01HagtNbJG0GdcVdKROTUn32rjULQSdfvTnPEyfpn0q_CdiE-76ZoULHyjW0FLbFlwh-4vcR5b_by-c) SRTP (needs explicit [enablement](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#configure-sdes-for-srtp-key-exchange-protocol))

Audio codec

OPUS

OPUS

OPUS

[](#)

Calling flows using SIP
-----------------------

Before you start, make sure you have [enabled and configured SIP on the business phone number](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#configure-update-sip-settings-on-business-phone-number). Meta generates a unique SIP user password for each business phone number + app combination. You will need this information and can retrieve it by using the [get Call Settings endpoint.](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#get-phone-number-calling-settings--sip-)

### Security

*   TLS transport is mandatory for SIP. Meta will present a valid server cert with subject name that covers our SIP domain wa.meta.vc. Your SIP server should do the same as Meta ensures your cert is valid and subject name covers SIP domain you configured on the business phone number
*   For business initiated calls, SIP invite from your SIP server will be challenged using digest auth. See [business-initiated calls](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#business-initiated-calls) for more details
*   For user initiated calls, it is highly recommended that you challenge SIP INVITE request form Meta, to use digest auth for more security. See [business-initiated calls](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#user-initiated-calls) for more details

### Business-initiated Calls

#### Prerequisites

*   You have the required call permission approval from the WhatsApp user
    *   [Learn how to obtain user calling permissions](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/user-call-permissions)

#### Calling flow

1.  Send an initial [SIP INVITE](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#business-initiated-calls--with-webrtc-media-) to our servers. Our SIP domain is wa.meta.vc. To initiate a call to WhatsApp user with phone number 11234567890, the SIP request URI should be 'sip:+11234567890@wa.meta.vc;transport=tls'
    *   This request will fail with an “SIP 407 Proxy Authentication required” message.
2.  Send a 2nd [SIP INVITE](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#business-initiated-calls--with-webrtc-media-) with proper Authorization header as per [RFC 3261](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3261%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeoePsARLs-WJwzDeuWI-sXFy-qaRQuFWfgVxPAjSgwzkyplj1Lrowxf1PdqQ_aem_d9FJhC7Abssr0j9v9P1AHw%23section-22&h=AT2ePly-r-wuDNEKg4c6Km8o9qVKkDXlPDBfVjye_NVaHTpEJF3MnmBFxoaAqWhoZaPZOvUF2CtZNMPcAd2Vs7WnxE5qaXpTOND3q3DNpBMo0OpWhyKd67HSrKEWiuoRjkeyuqo5in0).
    *   The Authorization field’s username attribute must match the from header’s user name which is the business phone number
    *   The password is generated by Meta and you can retrieve it using [get Call Settings endpoint](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#get-phone-number-calling-settings--sip-)
    *   The username portion of the from header must be the fully normalized business phone number
    *   The domain name of the from header must match the SIP server you configured on the business phone number
    *   The `SDP Offer` you include supports ICE, DTLS-SRTP and OPUS (essentially WebRTC media)
3.  Send the [SIP INVITE](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#business-initiated-calls--with-webrtc-media-) to the WhatsApp user number you want to call.

### User-initiated Calls

#### Calling flow

1.  The WhatsApp user calls business phone number and is unaware of whether the business is using SIP or Graph API. In other words, the user experience is identical
2.  If the business phone number is SIP enabled, Meta will send an [SIP INVITE](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#user-initiated-calls--with-webrtc-media-) to the SIP server configured on the business phone number
    *   Configure SIP settings on the business phone number below
3.  You respond with [SIP challenge](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#user-initiated-calls-with-digest-auth--with-sdes-media-) (recommended) or [SIP OK](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#user-initiated-calls--with-webrtc-media-) and pass in an SDP answer

  

[View sample SIP requests](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip#sample-sip-requests)

[Learn more about Session Description Protocol (SDP)](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.rfc-editor.org%2Frfc%2Frfc8866.html%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEe3jBwWJ8MWqUjSFoyq7v9yWX6CzLBEoodNuxpx3HfXvxkhoD4BP3H-clU654_aem_uMwAO4wYqlTr3W80NftY9A&h=AT3vRyznYSZFXqet3yA8Qw6W0mTnN6NvQe3p1VphlLKYbpLGeDzpxTC-mQ_aLayAu_QJKudUtdYCS7ss3Bv0XuE7alriaCHE8k2UhjsxSi0AW0NbU6835tVgW4HnWARvE5V5chinS3k)

[View example SDP structures](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/reference#sdp-overview-and-sample-sdp-structures)

[](#)

Configure/Update SIP settings on business phone number
------------------------------------------------------

Use this endpoint to update call settings configuration for an individual business phone number.

### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

### Endpoint parameters

  

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are updating Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

### Request body

{
  "calling": {
    ... // other calling api settings
    "sip": {
      "status": "ENABLED",
      "servers": \[
        {
         "hostname": SIP\_SERVER\_HOSTNAME
          "port": SIP\_SERVER\_PORT,
          "request\_uri\_user\_params": {
            "KEY1": "VALUE1", // for cases like trunk groups (tgrp)
            "KEY2": "VALUE2",
        }
      \]
    }
  },
  // Other non calling api feature configurations
}

### Body parameters

Parameter

Description

Sample Value

`status`

_String_

**Optional**

  

Enable or disable SIP call signaling for the given business phone number.

Default is `DISABLED`.

When `status` is `ENABLED`, this phone number will exclusively use SIP for call signaling and will not work with Graph APIs. No webhooks are sent.

When `status` is set to `DISABLED`, the SIP `servers` values are not reset.

If you enable SIP on the same phone number again, the previously configured `servers` values will take effect.

You can configure both status and SIP servers in the same request

`“ENABLED”`

`“DISABLED”`

`servers`

_String_

**Optional**

  

The SIP server routing configuration.

Each application can have only 1 SIP server configured for it.

The associated app is extracted from the access token used to make the API call.

Since a business phone number may be used with multiple applications, each number can be serviced by multiple SIP servers.

To delete a previously configured SIP server, pass an empty array to this field.

`hostname` — (_String_) **Required**

The host name of the SIP server.

Requests must use TLS.

`port` — (_String_) **Required**

The port within your SIP server that will accept requests.

Requests must use TLS.

Default port is 5061

`request_uri_user_params` — (_String_) **Optional**

An optional field for passing any parameters you want included in the user portion of the request URI used in our SIP INVITE to your SIP server.

Max key/value size is 128 characters.

An example use case would be Trunk Groups ([RFC 4904](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc4904%3Ffbclid%3DIwZXh0bgNhZW0CMTEAYnJpZBExa1JIMEhndWpmbGFlWFAyWQEeyJJc-t07Qviqp4DZVNLFd23R7Xtu1p59BV9yDe0AxPgIM3jt9-nBmqP5Qt8_aem_8QXBzrxyNj71F_hVLxpCSg&h=AT0Y5X2P5gKHkRA_uj85F9Pet55QeIRoow3JwxgXhAZ_n8wHlnhAtKnqB0cG0bcCDnCxEZbUHXbPyMziG0J7uo1DEj3ErK3iM4ct_CK1ymMC1_ou3ZZSfoodzL3NJ2S89iejX6Njc3M))

*   sip:+1234567890@sip.example.com;
*   tgrp=wacall;
*   trunk-context=byoc.example.com

This example has two user parameters for tgrp, and trunk-context.

"servers": \[
   {
      "hostname": SIP\_SERVER\_HOSTNAME
      "port": SIP\_SERVER\_PORT,
      "request\_uri\_user\_params": {
         "KEY1": "VALUE1",
         "KEY2": "VALUE2",
      }
   }
\]

### Success response

{
  "success": true
}

### Error response

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Get phone number calling settings (SIP)
---------------------------------------

Use this endpoint to check the configuration of your Calling API feature settings, including SIP values.

This endpoint can return information for other Cloud API feature settings.

### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

### Endpoint parameters

  

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are retrieving Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### App Permission Required

`whatsapp_business_management`: Advanced access is required to update use the API for end business clients

### Response body

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT",
    "callback\_permission\_status": "ENABLED",
    "sip": {
      "status": "ENABLED",
      "servers": \[
        {
          "hostname": "sip.example.com",
          "sip\_user\_password": "{SIP\_USER\_PASSWORD}"
        }
      \]
    }
  }
}

### Include SIP User Password

Optionally, you can include SIP user credentials in your response body by adding the SIP credentials query parameter in the POST request:

POST /<PHONE\_NUMBER\_ID\>/settings?include\_sip\_credentials\=true  

Where the response will look like this:

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT",
    "callback\_permission\_status": "ENABLED",
    "sip": {
      "status": "ENABLED",
      "servers": \[
        {
          "hostname": "sip.example.com",
          "sip\_user\_password": "{SIP\_USER\_PASSWORD}"
        }
      \]
    }
  }
}

### Error response

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)

Sample SIP requests
-------------------

### Business-initiated calls (with WebRTC media)

Click on the dropdowns below to view code samples

Initial SIP INVITE request

INVITE sip:12195550714@wa.meta.vc;transport\=tls SIP/2.0
Record\-Route: <sip:159.65.244.171:5061;transport\=tls;lr;ftag\=Kc9QZg4496maQ;nat\=yes\>
Via: SIP/2.0/TLS 159.65.244.171:5061;received\=2803:6081:798c:93f8:5f9b:bfe8:300:0;branch\=z9hG4bK0da2.36614b8977461b486ceabc004c723476.0;i\=617261
Via: SIP/2.0/TLS 137.184.87.1:35181;rport\=56533;received\=137.184.87.1;branch\=z9hG4bKQNa6meey5Dj2g
Max\-Forwards: 69
From: <sip:17125550259@meta\-voip.example.com\>;tag\=Kc9QZg4496maQ
To: <sip:12195550714@wa.meta.vc\>
Call\-ID: dc2c5b33\-1b81\-43ee\-9213\-afb56f4e56ba
CSeq: 96743476 INVITE
Contact: <sip:mod\_sofia@137.184.87.1:35181;transport\=tls;swrad\=137.184.87.1~56533~3\>
User\-Agent: SignalWire
Allow: INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY
Supported: timer, path, replaces
Allow\-Events: talk, hold, conference, refer
Session\-Expires: 600;refresher\=uac
Min\-SE: 90
Content\-Type: application/sdp
Content\-Disposition: session
Content\-Length: 2427
X\-Relay\-Call\-ID: dc2c5b33\-1b81\-43ee\-9213\-afb56f4e56ba
Remote\-Party\-ID: <sip:17125550259@meta\-voip.example.com\>;party\=calling;screen\=yes;privacy\=off
Content\-Type: application/sdp
Content\-Length:  2427

<<SDP omitted for brevity\>>

407 response from Meta

SIP/2.0 407 Proxy Authentication Required
Via: SIP/2.0/TLS 159.65.244.171:5061;received\=2803:6081:798c:93f8:5f9b:bfe8:300:0;branch\=z9hG4bK0da2.36614b8977461b486ceabc004c723476.0;i\=617261
Via: SIP/2.0/TLS 137.184.87.1:35181;rport\=56533;received\=137.184.87.1;branch\=z9hG4bKQNa6meey5Dj2g
Record\-Route: <sip:159.65.244.171:5061;transport\=tls;lr;ftag\=Kc9QZg4496maQ;nat\=yes\>
Call\-ID: dc2c5b33\-1b81\-43ee\-9213\-afb56f4e56ba
From: <sip:17125550259@meta\-voip.example.com\>;tag\=Kc9QZg4496maQ
To: <sip:12195550714@wa.meta.vc\>;tag\=z9hG4bK0da2.36614b8977461b486ceabc004c723476.0
CSeq: 96743476 INVITE
Proxy\-Authenticate: Digest realm\="wa.meta.vc",nonce\="419ac2415577f8e1",opaque\="440badfc05072367",algorithm\=MD5,qop\="auth"
Content\-Length:  0

Second SIP INVITE send with authorization

INVITE sip:12195550714@wa.meta.vc;transport\=tls SIP/2.0
Record\-Route: <sip:159.65.244.171:5061;transport\=tls;lr;ftag\=Kc9QZg4496maQ;nat\=yes\>
Via: SIP/2.0/TLS 159.65.244.171:5061;received\=2803:6081:798c:93f8:5f9b:bfe8:300:0;branch\=z9hG4bK1da2.ed8900012befced853927008d619d374.0;i\=617261
Via: SIP/2.0/TLS 137.184.87.1:35181;rport\=56533;received\=137.184.87.1;branch\=z9hG4bKry3yp9y12p8mc
Max\-Forwards: 69
From: <sip:17125550259@meta\-voip.example.com\>;tag\=Kc9QZg4496maQ
To: <sip:12195550714@wa.meta.vc\>
Call\-ID: dc2c5b33\-1b81\-43ee\-9213\-afb56f4e56ba
CSeq: 96743477 INVITE
Contact: <sip:mod\_sofia@137.184.87.1:35181;transport\=tls;swrad\=137.184.87.1~56533~3\>
User\-Agent: SignalWire
Allow: INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY
Supported: timer, path, replaces
Allow\-Events: talk, hold, conference, refer
Proxy\-Authorization: Digest username\="17125550259", realm\="wa.meta.vc", nonce\="419ac2415577f8e1", uri\="sip:12195550714@wa.meta.vc;transport=tls", response\="blah", algorithm\=MD5, cnonce\="/mVZtYFCEj65YQJCrBEAAg", opaque\="440badfc05072367", qop\=auth, nc\=00000001
Session\-Expires: 600;refresher\=uac
Min\-SE: 90
Content\-Type: application/sdp
Content\-Disposition: session
Content\-Length: 2427
X\-Relay\-Call\-ID: dc2c5b33\-1b81\-43ee\-9213\-afb56f4e56ba
Remote\-Party\-ID: <sip:17125550259@meta\-voip.example.com\>;party\=calling;screen\=yes;privacy\=off
Content\-Type: application/sdp
Content\-Length:  2427
<<SDP omitted for brevity\>>

Example error response

SIP/2.0 403 SIP server wa.meta.vc from INVITE does not match any SIP server configured for phone number id {ID}
Via: SIP/2.0/TLS \[2803:6080:c954:b533:ecfb:5cec:300:0\]:39459;rport\=39459;received\=2803:6080:c954:b533:ecfb:5cec:300:0;branch\=z9hG4bKPjf9f3d0bddb3dbe0c9b1e3b486f39784a;alias
Via: SIP/2.0/TLS 148.72.155.236:5061;rport\=30498;received\=2803:6080:d014:8e40:ddbb:4ed7:300:0;branch\=z9hG4bKPjfd270ec8\-7aaf\-4a65\-b290\-4bef3b50b7b7;alias
Record\-Route: <sip:onevc\-sip\-proxy\-dev.fbinfra.net:8191;transport\=tls;lr\>
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Call\-ID: 91578781\-44f1\-4268\-9a7f\-d7efec1abf72
From: <sip:17125550259@wa.meta.vc\>;tag\=3a63b370\-a697\-4a5a\-82b4\-e8105e23f176
To: <sip:12195550714@wa.meta.vc\>;tag\=e0d30a05\-657b\-47ec\-a668\-e05ca79f9f05
CSeq: 15659 INVITE
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
X\-FB\-External\-Domain: wa.meta.vc
Warning: 399 wa.meta.vc "SIP server wa.meta.vc from INVITE does not match any SIP server configured for phone number id {ID}"
Content\-Length: 0
Content\-Length:  0

SIP BYE

BYE sip:+5559800000693@wa.meta.vc;transport\=tls;ob SIP/2.0
Via: SIP/2.0/TLS 137.184.4.155:5061;received\=2803:6080:c074:cac:10ed:4b05:400:0;i\=8d2dc2
Via: SIP/2.0/TLS 143.198.136.243:35181;rport\=38087;received\=143.198.136.243
Route: <sip:wa.meta.vc;transport\=tls;lr\>
Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Max\-Forwards: 69
From: <sip:+12145551869@meta\-voip.example.com\>;tag\=NcKQ6mtDKSDQB
To: "5559800000693" <sip:+5559800000693@wa.meta.vc\>;tag\=92a01092\-ee78\-4870\-865f\-bc176203a6bd
Call\-ID: outgoing:wacid.HBgPMjAwNzU2OTA0ODY5OTY1FRIAEhggMjQ4QzUwOUQ1REQ0NDUwNENEQzRFMTgwRTNGQjAwNjEcGAsxMjE0NTU1MTg2ORUCAAA
CSeq: 98734935 BYE
User\-Agent: SignalWire
Allow: INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY
Supported: timer, path, replaces
Reason: Q.850;cause\=16;text\="NORMAL\_CLEARING"
Content\-Length: 0
X\-Relay\-Call\-ID: b72c0c65\-e319\-41b3\-afb7\-19ebcca05d38
Content\-Length:  0

SIP Invite (with SDES)

INVITE sip:12195550714@wa.meta.vc;transport\=tls SIP/2.0
Record\-Route: <sip:54.172.60.1:5061;transport\=tls;lr;r2\=on\>
Record\-Route: <sip:54.172.60.1;lr;r2\=on\>
CSeq: 2 INVITE
From: "12145551869" <sip:12145551869@meta\-voip.example.com\>;tag\=28460006\_c3356d0b\_5cdada8c\-cbf0\-4369\-b02d\-cc97d3c36f2b
To: <sip:12195550714@wa.meta.vc\>
Max\-Forwards: 66
P\-Asserted\-Identity: <sip:12145551869@meta\-voip.example.com\>
Min\-SE: 120
Call\-ID: f304a1d2cafb8139c1f9ff93a7733586@0.0.0.0
Contact: "12145551869" <sip:12145551869@172.25.10.217:5060;transport\=udp\>
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, NOTIFY
Via: SIP/2.0/TLS 54.172.60.1:5061;received\=2803:6080:f934:8894:7eb5:24f9:300:0;branch\=z9hG4bK1e5a.0da2ace9cc912d9e5f2595ca4acb9847.0
Via: SIP/2.0/UDP 172.25.10.217:5060;rport\=5060;branch\=z9hG4bK5cdada8c\-cbf0\-4369\-b02d\-cc97d3c36f2b\_c3356d0b\_54\-457463274351249162
Supported: timer
User\-Agent: Twilio Gateway
Proxy\-Authorization: Digest username\="12145551869", realm\="wa.meta.vc", nonce\="2a487cb01d4ed43b", uri\="sip:12195550714@wa.meta.vc;transport=tls", response\="3f58df7af575b948625aeffd51bf9060", algorithm\=MD5, cnonce\="b338deb7f0e004e66353e26d34ad62b7", opaque\="725a06fb2cd89a32", qop\=auth, nc\=00000002
Content\-Type: application/sdp
X\-Twilio\-CallSid: CA93eac6be615da5e6836c7059e9555348
Content\-Length: 422
Content\-Type: application/sdp
Content\-Length:   422

v\=0
o\=root 1185414872 1185414872 IN IP4 172.18.155.180
s\=Twilio Media Gateway
c\=IN IP4 168.86.138.232
t\=0 0
m\=audio 19534 RTP/SAVP 107 0 8 101
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=rtpmap:0 PCMU/8000
a\=rtpmap:107 opus/48000/2
a\=fmtp:107 useinbandfec\=1
a\=rtpmap:8 PCMA/8000
a\=rtpmap:101 telephone\-event/8000
a\=fmtp:101 0\-16
a\=ptime:20
a\=maxptime:20
a\=sendrecv

SIP OK (with SDES)

SIP/2.0 200 OK
Via: SIP/2.0/TLS 54.172.60.1:5061;received\=2803:6080:f934:8894:7eb5:24f9:300:0;branch\=z9hG4bK1e5a.0da2ace9cc912d9e5f2595ca4acb9847.0
Via: SIP/2.0/UDP 172.25.10.217:5060;rport\=5060;branch\=z9hG4bK5cdada8c\-cbf0\-4369\-b02d\-cc97d3c36f2b\_c3356d0b\_54\-457463274351249162
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:54.172.60.1:5061;transport\=tls;lr;r2\=on\>
Record\-Route: <sip:54.172.60.1;lr;r2\=on\>
Call\-ID: f304a1d2cafb8139c1f9ff93a7733586@0.0.0.0
From: "12145551869" <sip:12145551869@meta\-voip.example.com\>;tag\=28460006\_c3356d0b\_5cdada8c\-cbf0\-4369\-b02d\-cc97d3c36f2b
To: <sip:12195550714@wa.meta.vc\>;tag\=0d185053\-2615\-46c7\-8ff2\-250bda494cf1
CSeq: 2 INVITE
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
Supported: timer
X\-FB\-External\-Domain: wa.meta.vc
Contact: <sip:12195550714@wa.meta.vc;transport\=tls;ob;X\-FB\-Sip\-Smc\-Tier\=collaboration.sip\_gateway.sip.prod\>;isfocus
Content\-Type: application/sdp
Content\-Length:   645

v\=0
o\=- 1746657286595 2 IN IP4 127.0.0.1
s\=-
t\=0 0
a\=group:BUNDLE audio
a\=msid\-semantic: WMS 42da9643\-cb50\-4eca\-95d3\-ca41b3f1f4bb
m\=audio 3480 RTP/SAVP 107 101
c\=IN IP4 157.240.19.130
a\=rtcp:9 IN IP4 0.0.0.0
a\=mid:audio
a\=sendrecv
a\=msid:42da9643\-cb50\-4eca\-95d3\-ca41b3f1f4bb WhatsAppTrack1
a\=rtcp\-mux
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=rtpmap:107 opus/48000/2
a\=fmtp:107 maxaveragebitrate\=20000;maxplaybackrate\=16000;minptime\=20;sprop\-maxcapturerate\=16000;useinbandfec\=1
a\=rtpmap:101 telephone\-event/8000
a\=maxptime:20
a\=ptime:20
a\=ssrc:1238967757 cname:WhatsAppAudioStream1

### User-initiated calls (with WebRTC media)

Click on the dropdowns below to view code samples

SIP INVITE

INVITE sip:17015558857@meta\-voip.example.com SIP/2.0
Via: SIP/2.0/TLS \[2803:6080:e888:51aa:d4a4:c5e0:300:0\]:33819;rport\=33819;received\=2803:6080:e888:51aa:d4a4:c5e0:300:0;branch\=z9hG4bKPjNvs.IZBnUa1W4l8oHPpk3SUMmcx3MMcE;alias
Max\-Forwards: 70
From: "12195550714" <sip:12195550714@wa.meta.vc\>;tag\=bbf1ad6e\-79bb\-4d9c\-8a2c\-094168a10bea
To: <sip:17015558857@meta\-voip.example.com\>
Contact: <sip:12195550714@wa.meta.vc;transport\=tls;ob\>;isfocus
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCAzODg1NTE5NEU1NTBEMTc1RTFFQUY5NjNCQ0FCRkEzRhwYCzE3MDE1NTU4ODU3FQIAAA\==
CSeq: 2824 INVITE
Route: <sip:onevc\-sip\-proxy\-dev.fbinfra.net:8191;transport\=tls;lr\>
X\-FB\-External\-Domain: wa.meta.vc
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
User\-Agent: Facebook SipGateway
Content\-Type: application/sdp
Content\-Length: 1028

v\=0
o\=- 1741113186367 2 IN IP4 127.0.0.1
s\=-
t\=0 0
a\=group:BUNDLE audio
a\=msid\-semantic: WMS 632a909f\-1060\-4369\-96a4\-7bd03e291ee7
a\=ice\-lite
m\=audio 3480 UDP/TLS/RTP/SAVPF 111 126
c\=IN IP4 57.144.135.35
a\=rtcp:9 IN IP4 0.0.0.0
a\=candidate:1775469887 1 udp 2122260223 57.144.135.35 3480 typ host generation 0 network\-cost 50
a\=candidate:3355715111 1 udp 2122262783 2a03:2880:f343:131:face:b00c:0:699c 3480 typ host generation 0 network\-cost 50
a\=ice\-ufrag:RmDDkfzkwbexPfbC
a\=ice\-pwd:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=fingerprint:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=setup:actpass
a\=mid:audio
a\=sendrecv
a\=msid:632a909f\-1060\-4369\-96a4\-7bd03e291ee7 WhatsAppTrack1
a\=rtcp\-mux
a\=rtpmap:111 opus/48000/2
a\=rtcp\-fb:111 transport\-cc
a\=fmtp:111 maxaveragebitrate\=20000;maxplaybackrate\=16000;minptime\=20;sprop\-maxcapturerate\=16000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=maxptime:20
a\=ptime:20
a\=ssrc:849255537 cname:WhatsAppAudioStream1

SIP BYE

BYE sip:+5559800000693@wa.meta.vc;transport\=tls;ob SIP/2.0
Via: SIP/2.0/TLS 137.184.4.155:5061;received\=2803:6080:c074:cac:10ed:4b05:400:0;i\=8d2dc2
Via: SIP/2.0/TLS 143.198.136.243:35181;rport\=38087;received\=143.198.136.243
Route: <sip:wa.meta.vc;transport\=tls;lr\>
Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Max\-Forwards: 69
From: <sip:+12145551869@meta\-voip.example.com\>;tag\=NcKQ6mtDKSDQB
To: "5559800000693" <sip:+5559800000693@wa.meta.vc\>;tag\=92a01092\-ee78\-4870\-865f\-bc176203a6bd
Call\-ID: outgoing:wacid.HBgPMjAwNzU2OTA0ODY5OTY1FRIAEhggMjQ4QzUwOUQ1REQ0NDUwNENEQzRFMTgwRTNGQjAwNjEcGAsxMjE0NTU1MTg2ORUCAAA
CSeq: 98734935 BYE
User\-Agent: SignalWire
Allow: INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY
Supported: timer, path, replaces
Reason: Q.850;cause\=16;text\="NORMAL\_CLEARING"
Content\-Length: 0
X\-Relay\-Call\-ID: b72c0c65\-e319\-41b3\-afb7\-19ebcca05d38
Content\-Length:  0

SIP Invite (with SDES)

INVITE sip:+12145551869@meta\-voip.example.com;transport\=tls SIP/2.0
Via: SIP/2.0/TLS \[2803:6080:f948:9597::\]:57363;rport;branch\=z9hG4bKPj3a9f2ad89e4a3df61408aa84f7d9a63e;alias
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Via: SIP/2.0/TLS \[2803:6080:f948:9597:d33c:e00:400:0\]:5061;branch\=z9hG4bKPj3a9f2ad89e4a3df61408aa84f7d9a63e
Via: SIP/2.0/TLS \[2803:6080:f948:9597:1ac5:cdf8:300:0\]:63057;rport\=63057;received\=2803:6080:f948:9597:1ac5:cdf8:300:0;branch\=z9hG4bKPj\-phic0sbns27DiP0OlrxRxgLtNg4mio7;alias
Max\-Forwards: 69
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=8a0f7e65\-6e9e\-4801\-bf92\-85c3ef2485d9
To: <sip:+12145551869@meta\-voip.example.com\>
Contact: <sip:+12195550714@wa.meta.vc;transport\=tls;ob\>;isfocus
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA4QkY1MTJCQkNFNTgxMEVFRERFRTUzNTFERkE1MDU0MhwYCzEyMTQ1NTUxODY5FQIAAA
CSeq: 31159 INVITE
X\-FB\-External\-Domain: wa.meta.vc
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
User\-Agent: Facebook SipGateway
Content\-Type: application/sdp
Content\-Length:   645

v\=0
o\=- 1746659966980 2 IN IP4 127.0.0.1
s\=-
t\=0 0
a\=group:BUNDLE audio
a\=msid\-semantic: WMS 07092115\-d151\-427e-8722\-26c70936b104
m\=audio 3480 RTP/SAVP 111 126
c\=IN IP4 157.240.19.130
a\=rtcp:9 IN IP4 0.0.0.0
a\=mid:audio
a\=sendrecv
a\=msid:07092115\-d151\-427e-8722\-26c70936b104 WhatsAppTrack1
a\=rtcp\-mux
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=rtpmap:111 opus/48000/2
a\=fmtp:111 maxaveragebitrate\=20000;maxplaybackrate\=16000;minptime\=20;sprop\-maxcapturerate\=16000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=maxptime:20
a\=ptime:20
a\=ssrc:1615009994 cname:WhatsAppAudioStream1

SIP OK (with SDES)

SIP/2.0 200 OK
CSeq: 31159 INVITE
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA4QkY1MTJCQkNFNTgxMEVFRERFRTUzNTFERkE1MDU0MhwYCzEyMTQ1NTUxODY5FQIAAA
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=8a0f7e65\-6e9e\-4801\-bf92\-85c3ef2485d9
To: <sip:+12145551869@meta\-voip.example.com\>;tag\=66596922\_c3356d0b\_fee164be\-566a\-4679\-a80d\-5bfdf1d0aa9e
Via: SIP/2.0/TLS 157.240.229.209:5061;rport\=51830;received\=69.171.251.115;branch\=z9hG4bKPj3a9f2ad89e4a3df61408aa84f7d9a63e;alias
Via: SIP/2.0/TLS \[2803:6080:f948:9597:d33c:e00:400:0\]:5061;branch\=z9hG4bKPj3a9f2ad89e4a3df61408aa84f7d9a63e
Via: SIP/2.0/TLS \[2803:6080:f948:9597:1ac5:cdf8:300:0\]:63057;rport\=63057;received\=2803:6080:f948:9597:1ac5:cdf8:300:0;branch\=z9hG4bKPj\-phic0sbns27DiP0OlrxRxgLtNg4mio7;alias
Record\-Route: <sip:54.172.60.1:5060;lr;r2\=on;twnat\=sip:69.171.251.115:51830\>
Record\-Route: <sip:54.172.60.1:5061;transport\=tls;lr;r2\=on;twnat\=sip:69.171.251.115:51830\>
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Server: Twilio
Contact: <sip:172.25.16.223:5060\>
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, NOTIFY
Content\-Type: application/sdp
X\-Twilio\-CallSid: CAb0d74508fe5fcdf6ec70ea3cf4e9b90b
Content\-Length: 446
Content\-Type: application/sdp
Content\-Length:   446

v\=0
o\=root 1353670385 1353670385 IN IP4 172.18.164.24
s\=Twilio Media Gateway
c\=IN IP4 168.86.138.176
t\=0 0
m\=audio 15822 RTP/SAVP 111 126
a\=rtpmap:111 opus/48000/2
a\=fmtp:111 maxplaybackrate\=16000;sprop\-maxcapturerate\=16000;maxaveragebitrate\=20000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=fmtp:126 0\-16
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=ptime:20
a\=maxptime:20
a\=sendrecv

### User-initiated calls with Digest Auth (with SDES media)

Meta SIP server supports digest auth for user initiated calls. Your SIP server should respond with digest auth challenge and Meta will resend the SIP INVITE with challenge response. The username used for digest auth is the (normalized) business phone number and the password is generated by Meta and retrievable using the [get Call settings endpoint](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/sip/#include-sip-user-password).

Click on the dropdowns below to view code samples

First INVITE request from Meta

INVITE sip:+12145551869@meta\-voip.example.com;transport\=tls SIP/2.0
Via: SIP/2.0/TLS \[2803:6080:f948:9597::\]:47237;rport;branch\=z9hG4bKPj1e6c665db16b3ecacf32cadb4497fe77;alias
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Via: SIP/2.0/TLS \[2803:6080:f948:9597:7253:922a:400:0\]:5061;branch\=z9hG4bKPj1e6c665db16b3ecacf32cadb4497fe77
Via: SIP/2.0/TLS \[2803:6080:f8bc:9272:e488:9927:400:0\]:58279;rport\=58279;received\=2803:6080:f8bc:9272:e488:9927:400:0;branch\=z9hG4bKPjr33j97A1mx5J8HWHEy2zIgqZYCCIb4Fb;alias
Max\-Forwards: 69
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=ece2da15\-39e7\-4983\-ac65\-e312f325d94a
To: <sip:+12145551869@meta\-voip.example.com\>
Contact: <sip:+12195550714@wa.meta.vc;transport\=tls;ob\>;isfocus
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA2MUI2QUY0MDRCMTUyOTM4QkE5ODEwN0ZGQTAwODkxORwYCzEyMTQ1NTUxODY5FQIAFRoA
CSeq: 9989 INVITE
X\-FB\-External\-Domain: wa.meta.vc
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
User\-Agent: Facebook SipGateway
Content\-Type: application/sdp
Content\-Length:   643

v\=0
o\=- 1750716867913 2 IN IP4 127.0.0.1
s\=-
t\=0 0
a\=group:BUNDLE audio
a\=msid\-semantic: WMS 4e37b099\-8aef\-45d0\-be4f\-1cde2ca5a37d
m\=audio 3480 RTP/SAVP 111 126
c\=IN IP4 57.144.219.49
a\=rtcp:9 IN IP4 0.0.0.0
a\=mid:audio
a\=sendrecv
a\=msid:4e37b099\-8aef\-45d0\-be4f\-1cde2ca5a37d WhatsAppTrack1
a\=rtcp\-mux
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=rtpmap:111 opus/48000/2
a\=fmtp:111 maxaveragebitrate\=20000;maxplaybackrate\=16000;minptime\=20;sprop\-maxcapturerate\=16000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=maxptime:20
a\=ptime:20
a\=ssrc:215879358 cname:WhatsAppAudioStream1

407 Response from partner SIP server

SIP/2.0 407 Proxy Authentication required
CSeq: 9989 INVITE
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA2MUI2QUY0MDRCMTUyOTM4QkE5ODEwN0ZGQTAwODkxORwYCzEyMTQ1NTUxODY5FQIAFRoA
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=ece2da15\-39e7\-4983\-ac65\-e312f325d94a
To: <sip:+12145551869@meta\-voip.example.com\>;tag\=45065608\_c3356d0b\_16001fd8\-76d2\-45f0\-bb35\-e0441d6dc4a2
Via: SIP/2.0/TLS 31.13.66.215:5061;rport\=62080;received\=69.171.251.112;branch\=z9hG4bKPj1e6c665db16b3ecacf32cadb4497fe77;alias
Via: SIP/2.0/TLS \[2803:6080:f948:9597:7253:922a:400:0\]:5061;branch\=z9hG4bKPj1e6c665db16b3ecacf32cadb4497fe77
Via: SIP/2.0/TLS \[2803:6080:f8bc:9272:e488:9927:400:0\]:58279;rport\=58279;received\=2803:6080:f8bc:9272:e488:9927:400:0;branch\=z9hG4bKPjr33j97A1mx5J8HWHEy2zIgqZYCCIb4Fb;alias
Contact: <sip:172.25.58.54:5060\>
Proxy\-Authenticate: Digest realm\="sip.twilio.com",nonce\="eyOam\_8-l5FVugxsyxFRjnlxq9vy1TjQIMB3mBfJuAvB5gV4",opaque\="4a6a068be2ca2032a57912b9a2a6adf7",qop\="auth"
Content\-Length: 0
Content\-Length:  0

Second INVITE with authorization from Meta

INVITE sip:+12145551869@meta\-voip.example.com;transport\=tls SIP/2.0
Via: SIP/2.0/TLS 31.13.66.215:5061;rport;branch\=z9hG4bKPj16be0694dc6763eb66de5ec5f262db03;alias
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Via: SIP/2.0/TLS \[2803:6080:f948:9597:7253:922a:400:0\]:5061;branch\=z9hG4bKPj16be0694dc6763eb66de5ec5f262db03
Via: SIP/2.0/TLS \[2803:6080:f8bc:9272:e488:9927:400:0\]:58279;rport\=58279;received\=2803:6080:f8bc:9272:e488:9927:400:0;branch\=z9hG4bKPjYp9LqI0D8zJ.wly5wyMyVaH9fUwIU921;alias
Max\-Forwards: 69
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=ece2da15\-39e7\-4983\-ac65\-e312f325d94a
To: <sip:+12145551869@meta\-voip.example.com\>
Contact: <sip:+12195550714@wa.meta.vc;transport\=tls;ob\>;isfocus
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA2MUI2QUY0MDRCMTUyOTM4QkE5ODEwN0ZGQTAwODkxORwYCzEyMTQ1NTUxODY5FQIAFRoA
CSeq: 9990 INVITE
X\-FB\-External\-Domain: wa.meta.vc
Allow: INVITE, ACK, BYE, CANCEL, NOTIFY, OPTIONS
User\-Agent: Facebook SipGateway
Proxy\-Authorization: Digest username\="12145551869", realm\="sip.twilio.com", nonce\="eyOam\_8-l5FVugxsyxFRjnlxq9vy1TjQIMB3mBfJuAvB5gV4", uri\="sip:+12145551869@meta-voip.example.com", response\="b28ed6b8bf1418e3c6eca05ef8c7a0b1", cnonce\="TY2SszvYCKitUCBlVLpGiPKMQfmBbj", opaque\="4a6a068be2ca2032a57912b9a2a6adf7", qop\=auth, nc\=00000001
Content\-Type: application/sdp
Content\-Length:   643

v\=0
o\=- 1750716867913 2 IN IP4 127.0.0.1
s\=-
t\=0 0
a\=group:BUNDLE audio
a\=msid\-semantic: WMS 4e37b099\-8aef\-45d0\-be4f\-1cde2ca5a37d
m\=audio 3480 RTP/SAVP 111 126
c\=IN IP4 57.144.219.49
a\=rtcp:9 IN IP4 0.0.0.0
a\=mid:audio
a\=sendrecv
a\=msid:4e37b099\-8aef\-45d0\-be4f\-1cde2ca5a37d WhatsAppTrack1
a\=rtcp\-mux
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=rtpmap:111 opus/48000/2
a\=fmtp:111 maxaveragebitrate\=20000;maxplaybackrate\=16000;minptime\=20;sprop\-maxcapturerate\=16000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=maxptime:20
a\=ptime:20
a\=ssrc:215879358 cname:WhatsAppAudioStream1

SIP OK from partner SIP server

SIP/2.0 200 OK
CSeq: 9990 INVITE
Call\-ID: outgoing:wacid.HBgLMTIxOTU1NTA3MTQVAgASGCA2MUI2QUY0MDRCMTUyOTM4QkE5ODEwN0ZGQTAwODkxORwYCzEyMTQ1NTUxODY5FQIAFRoA
From: "12195550714" <sip:+12195550714@wa.meta.vc\>;tag\=ece2da15\-39e7\-4983\-ac65\-e312f325d94a
To: <sip:+12145551869@meta\-voip.example.com\>;tag\=29360930\_c3356d0b\_4933dc58\-f035\-4597\-b075\-04b19e552329
Via: SIP/2.0/TLS 31.13.66.215:5061;rport\=62080;received\=69.171.251.112;branch\=z9hG4bKPj16be0694dc6763eb66de5ec5f262db03;alias
Via: SIP/2.0/TLS \[2803:6080:f948:9597:7253:922a:400:0\]:5061;branch\=z9hG4bKPj16be0694dc6763eb66de5ec5f262db03
Via: SIP/2.0/TLS \[2803:6080:f8bc:9272:e488:9927:400:0\]:58279;rport\=58279;received\=2803:6080:f8bc:9272:e488:9927:400:0;branch\=z9hG4bKPjYp9LqI0D8zJ.wly5wyMyVaH9fUwIU921;alias
Record\-Route: <sip:54.172.60.0:5060;lr;r2\=on;twnat\=sip:69.171.251.112:62080\>
Record\-Route: <sip:54.172.60.0:5061;transport\=tls;lr;r2\=on;twnat\=sip:69.171.251.112:62080\>
Record\-Route: <sip:wa.meta.vc;transport\=tls;lr\>
Record\-Route: <sip:onevc\-sip\-proxy.fbinfra.net:8191;transport\=tls;lr\>
Contact: <sip:172.25.43.84:5060\>
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, NOTIFY
Content\-Type: application/sdp
X\-Twilio\-CallSid: CAd4d6e59a356c4d1b0ee85323b2d9dab5
Content\-Length: 444
Content\-Type: application/sdp
Content\-Length:   444

v\=0
o\=root 477560318 477560318 IN IP4 172.18.156.61
s\=Twilio Media Gateway
c\=IN IP4 168.86.137.174
t\=0 0
m\=audio 12710 RTP/SAVP 111 126
a\=rtpmap:111 opus/48000/2
a\=fmtp:111 maxplaybackrate\=16000;sprop\-maxcapturerate\=16000;maxaveragebitrate\=20000;useinbandfec\=1
a\=rtpmap:126 telephone\-event/8000
a\=fmtp:126 0\-16
a\=crypto:\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
a\=ptime:20
a\=maxptime:20
a\=sendrecv

[](#)

Configure SDES for SRTP key exchange protocol
---------------------------------------------

The Secure Real-time Transport Protocol (SRTP) key exchange is a cryptographic protocol used to securely exchange encryption keys between two parties over an insecure communication channel.

You can configure SRTP key exchange to one of two options:

*   DTLS (default) — Industry-standard encrypted key exchange. Recommended.
*   SDES — Plain text key is defined in the SDP which is sent over secure signaling protocol (SIP).

Note: SDES can be used only when SIP signaling is enabled.

### Configure/update SRTP key exchange protocol

#### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

#### Endpoint parameters

  

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are updating Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Request body

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT"
  . . .
    "srtp\_key\_exchange\_protocol": "DTLS (default) | SDES",
  . . .
  }
. . .
}

#### Body parameters

Parameter

Description

Sample Value

`srtp_key_exchange_protocol`

_String_

**Optional**

  

Enable or disable use of SRTP key exchange protocol.

Possible values are `SDES` and `DTLS`.

Default is `DTLS`.

Note: Meta still expects the business side to send the maiden SRTP packet for both user and business initiated calls

`“SDES”`

#### Success response

{
  "success": true
}

### Error response

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

### Get SRTP key exchange protocol

#### Request syntax

POST /<PHONE\_NUMBER\_ID\>/settings  

#### Endpoint parameters

  

Placeholder

Description

Sample Value

`<PHONE_NUMBER_ID>`

_Integer_

**Required**

  

The business phone number for which you are updating Calling API settings.

[Learn more about formatting phone numbers in Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#whatsapp-user-phone-number-formats)

`+12784358810`

#### Response body

{
  "calling": {
    "status": "ENABLED",
    "call\_icon\_visibility": "DEFAULT"
  . . .
    "srtp\_key\_exchange\_protocol": "DTLS | SDES",
  . . .
  }
. . .
}

#### Response parameters

Parameter

Description

Sample Value

`srtp_key_exchange_protocol`

_String_

The type of SRTP key exchange protocol configured for the business phone number queried

Possible values are `SDES` and `DTLS`.

Default is `DTLS`.

**Note: If this field has not been explicitly set, it will not be returned.**

`“SDES”`

#### Error response

[View Calling API Error Codes and Troubleshooting for more information](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/troubleshooting)

[View general Cloud API Error Codes here](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

[](#)



