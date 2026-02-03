# License Verification Setup Guide

This guide explains how to integrate license verification into your application and how to make the protection harder to remove.

## API Endpoint

**Endpoint:** `POST /api/verify-license`
**Content-Type:** `application/json`

### Request Body

```json
{
  "key": "your-license-key-here"
}
```

### Success Response (200 OK)

```json
{
  "valid": true,
  "message": "License is active",
  "license": {
    "clientName": "Acme Corp",
    "expiresAt": "2025-12-31T23:59:59.000Z"
  }
}
```

---

## High-Security Implementation Strategies

To make license checking harder to bypass or remove, follow these industry-standard practices:

### 1. Code Obfuscation
Never leave your verification logic in plain text. Use tools like **javascript-obfuscator** or **PyArmor** (for Python) to scramble the logic. This makes it significantly harder for a "cracker" to find the `if (licenseValid)` check.

### 2. Multi-Point Verification
Don't just check the license at startup. Scatter "silent" checks throughout your application's core features.
*   **Startup Check:** Simple validation to prevent initial launch.
*   **Heartbeat Check:** Periodically re-verify the license every 30-60 minutes.
*   **Feature Gate:** Link specific critical functions to a successful license check.

### 3. Server-Side Dependent Logic
The most secure way to protect an app is to move critical logic to the server.
*   Instead of just asking "is this key valid?", send data to the server and have the server process it only if the license is valid.
*   If the app can function entirely offline, it is fundamentally easier to crack.

### 4. Integrity Checks
Implement checksums for your application files. If a cracker modifies the binary to "jump" over the license check, the checksum will fail, and the app should refuse to run.

### 5. Environment Fingerprinting
When verifying, send a unique hardware ID (HWID) or machine ID to the server.
```javascript
// Example: Sending HWID for hardware locking
const response = await axios.post('...', {
  key: licenseKey,
  hwid: getMachineId() // Implement a function to get unique hardware ID
});
```

---

## Integration Examples

### Node.js (Hardened Example)

```javascript
const axios = require('axios');
const crypto = require('crypto');

// Use an environment variable for the URL to avoid hardcoding
const API_URL = process.env.LICENSE_SERVER_URL;

async function _internal_v_check(k) {
    try {
        // Add a random delay to prevent timing attacks
        await new Promise(r => setTimeout(r, Math.random() * 200));
        
        const res = await axios.post(`${API_URL}/api/verify-license`, { key: k });
        if (!res.data.valid) {
            // Don't just exit; corrupt some internal state or throw a vague error
            process.env.CORE_FEATURE_ENABLED = "false";
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

// Call this in multiple places, not just at the top
```

### cURL (Quick Test)

```bash
curl -X POST https://your-app-url.replit.app/api/verify-license \
  -H "Content-Type: application/json" \
  -d '{"key": "your-license-key-uuid"}'
```
