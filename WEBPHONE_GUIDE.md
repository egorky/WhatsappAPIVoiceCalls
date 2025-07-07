# Webphone Guide

This document provides information on running and embedding the SvelteKit-based WebRTC SIP client included in this repository.

## Table of Contents

1.  [Running the Webphone Locally](#running-the-webphone-locally)
2.  [Configuration](#configuration)
3.  [Embedding in an Iframe](#embedding-in-an-iframe)

## Running the Webphone Locally

The webphone is a SvelteKit application. To run it in a development environment:

1.  **Install Dependencies:**
    If you haven't already, install the project dependencies:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    This will typically start the development server on `https://localhost:5173` (Vite uses HTTPS by default with `vite-plugin-mkcert`).

3.  **Access:**
    Open your browser and navigate to the URL provided by the development server. You will likely see a browser warning for a self-signed SSL certificate (`mkcert`); you can proceed past this for local development.

## Configuration

The webphone client (`src/lib/client-phone/`) is designed to connect to a SIP server (like Asterisk configured in this project). The core SIP registration details (username, password, server WebSocket URI) are typically entered through the webphone's UI.

*   **SIP Server / WebSocket URL:** When configuring a profile in the webphone UI, you'll need to provide the WebSocket URL for your Asterisk PJSIP transport. For example:
    *   `ws://your_asterisk_server_ip:8088/ws` (for unsecure WebSockets)
    *   `wss://your_asterisk_server_ip:8089/ws` (for secure WebSockets, recommended for production)
    Ensure this matches the `transport-ws` or `transport-wss` configuration in your `pjsip.conf`.
*   **SIP Username:** The username for the PJSIP endpoint (e.g., `webclientuser` from `pjsip.conf`).
*   **SIP Password:** The password for that PJSIP endpoint.
*   **Display Name:** Any name you want to appear for caller ID purposes (may be overridden by Asterisk).

Refer to the `client-phone` component's UI for inputting these settings.

## Embedding in an Iframe

The webphone application is generally suitable for embedding within an `<iframe>` on an external webpage.

**Investigation Summary:**
*   The SvelteKit application codebase (`src/app.html`, `svelte.config.js`, `vite.config.ts`) does not appear to set any `X-Frame-Options` or restrictive `Content-Security-Policy: frame-ancestors` headers that would inherently prevent iframe embedding.

**To embed the webphone:**

1.  **Parent Page HTML:**
    On the external webpage where you want to embed the webphone, use an `iframe` tag:
    ```html
    <iframe
        src="https://your-deployed-webphone-url.com"
        width="400"  <!-- Adjust width as needed -->
        height="700" <!-- Adjust height as needed -->
        allow="microphone; autoplay" <!-- Crucial permissions -->
        frameborder="0"
        scrolling="no" <!-- Optional, if the webphone handles its own scrolling -->
        title="Webphone"
    ></iframe>
    ```
    *   **`src`**: Replace `https://your-deployed-webphone-url.com` with the actual URL where your SvelteKit webphone application is hosted.
    *   **`width` / `height`**: Adjust these to fit your layout. The webphone's UI should be responsive, but test for usability within these dimensions.
    *   **`allow="microphone; autoplay"`**: This is **critical**.
        *   `microphone`: Grants the iframe permission to request access to the user's microphone for WebRTC calls.
        *   `autoplay`: May be needed for audio elements (like ringtones or call audio) to play without explicit user interaction within the iframe, though browser policies around autoplay are strict and can vary. It's good practice to include it.
    *   **`frameborder` / `scrolling`**: Optional styling attributes.

2.  **Deployment Platform Configuration:**
    *   If you are deploying the webphone to a platform like Vercel, Netlify, or your own server, ensure that the platform itself is not injecting restrictive HTTP headers like `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN`.
    *   Similarly, check for any `Content-Security-Policy` headers set at the platform level that might restrict `frame-ancestors`.
    *   For Vercel, this might be configured in a `vercel.json` file. For other platforms, consult their documentation on setting custom headers. To allow embedding from any site, ensure `X-Frame-Options` is not set, and if using CSP, `frame-ancestors *` or `frame-ancestors https://your-embedding-site.com` would be appropriate.

3.  **HTTPS:**
    *   The parent page embedding the iframe **must** be served over HTTPS if the webphone (iframe source) is served over HTTPS. This is a browser security requirement for WebRTC (microphone access) and generally for iframes accessing sensitive features.
    *   Since the dev server uses `mkcert` for HTTPS, and production deployments should always use HTTPS, this is a key consideration.

4.  **Potential Considerations:**
    *   **Storage:** `localStorage` and `sessionStorage` within the iframe are sandboxed to the iframe's origin. This is generally fine as the webphone will manage its own state.
    *   **Cookies:** If the webphone relied on third-party cookies for any functionality (unlikely for this SIP client), those might be blocked by browser privacy settings when in an iframe.
    *   **UI/UX:** Test the webphone's appearance and usability within the iframe dimensions you intend to use. The current design is full-page, so ensure it adapts well or consider specific CSS adjustments for an "embedded" mode if needed.

By following these guidelines, you should be able to embed the webphone application into an external webpage.
