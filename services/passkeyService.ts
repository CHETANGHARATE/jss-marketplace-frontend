import { apiClient } from './apiClient';

// Helper utilities to convert between Base64 and ArrayBuffer
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const padded = base64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export interface PasskeyItem {
  id: number;
  credential_id: string;
  device_name: string;
  sign_count: number;
  last_used_at: string | null;
  created_at: string;
}

export const passkeyService = {
  /**
   * Check if user's browser/device supports WebAuthn Passkeys (Face ID, Touch ID, Windows Hello)
   */
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.PublicKeyCredential &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    );
  },

  /**
   * Register a new passkey on this device (Feature 171)
   */
  async registerPasskey(deviceName?: string): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      throw new Error('Passkeys are not supported on this browser/device.');
    }

    // 1. Fetch registration options & challenge from backend
    const optRes = await apiClient.get('/auth/passkey/register-options');
    const options = optRes.data.data;

    // Decode challenge and user ID to ArrayBuffer
    const challengeBuffer = base64ToBuffer(options.challenge);
    const userIdBuffer = base64ToBuffer(options.user.id);

    const createOptions: CredentialCreationOptions = {
      publicKey: {
        rp: options.rp,
        user: {
          id: userIdBuffer,
          name: options.user.name,
          displayName: options.user.displayName,
        },
        challenge: challengeBuffer,
        pubKeyCredParams: options.pubKeyCredParams,
        timeout: options.timeout || 60000,
        attestation: options.attestation || 'none',
        authenticatorSelection: options.authenticatorSelection,
      },
    };

    // 2. Prompt browser WebAuthn prompt
    const credential = (await navigator.credentials.create(createOptions)) as PublicKeyCredential;
    if (!credential) {
      throw new Error('Credential creation was cancelled.');
    }

    const rawIdBase64 = bufferToBase64(credential.rawId);
    const response = credential.response as AuthenticatorAttestationResponse;
    const publicKeyBase64 = bufferToBase64(response.attestationObject);

    // 3. Send back to backend for storage
    const verifyRes = await apiClient.post('/auth/passkey/verify-register', {
      credential_id: rawIdBase64,
      public_key: publicKeyBase64,
      device_name: deviceName || 'Personal Device',
      transports: (response as any).getTransports ? (response as any).getTransports() : ['internal'],
    });

    return verifyRes.data;
  },

  /**
   * Sign in using existing device Passkey (Biometrics / Security Key)
   */
  async loginWithPasskey(): Promise<{ token: string; user: any }> {
    if (!this.isSupported()) {
      throw new Error('Passkeys are not supported on this browser/device.');
    }

    // 1. Fetch challenge & options from backend
    const optRes = await apiClient.get('/auth/passkey/login-options');
    const options = optRes.data.data;

    const challengeBuffer = base64ToBuffer(options.challenge);

    const getOptions: CredentialRequestOptions = {
      publicKey: {
        challenge: challengeBuffer,
        timeout: options.timeout || 60000,
        rpId: options.rpId || window.location.hostname,
        userVerification: options.userVerification || 'preferred',
      },
    };

    // 2. Prompt browser passkey selector
    const credential = (await navigator.credentials.get(getOptions)) as PublicKeyCredential;
    if (!credential) {
      throw new Error('Passkey login cancelled.');
    }

    const rawIdBase64 = bufferToBase64(credential.rawId);

    // 3. Verify with backend and obtain Sanctum token
    const verifyRes = await apiClient.post('/auth/passkey/verify-login', {
      credential_id: rawIdBase64,
      session_token: options.session_token,
    });

    return {
      token: verifyRes.data.token,
      user: verifyRes.data.data.user,
    };
  },

  /**
   * List user's registered passkeys
   */
  async listPasskeys(): Promise<PasskeyItem[]> {
    const res = await apiClient.get('/auth/passkeys');
    return res.data.data || [];
  },

  /**
   * Remove a passkey
   */
  async deletePasskey(id: number): Promise<void> {
    await apiClient.delete(`/auth/passkeys/${id}`);
  },
};
