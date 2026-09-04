# ADR-003: Authentication Architecture & Identity Verification

## Status
Accepted

## Context
Cross-border telemedicine requires military-grade identity verification for both patients (to combat impersonation and ensure correct medical records) and clinicians (to verify medical licenses with the UK GMC and Nigerian MDCN).

## Decision
1. **Stateless JWTs + State-Aware Refresh Tokens**:
   - Short-lived Access Tokens (15 minutes) carrying user ID, tenant ID, active role, and cryptographic session identifier (`sid`).
   - Long-lived Refresh Tokens (30 days) stored in an HTTP-only, `SameSite=Strict`, `Secure` cookie on web, and OS Secure Enclave / Keystore on mobile.
   - Refresh Token Rotation (RTR): Every refresh invalidates the prior token. Reuse detection triggers immediate revocation of the entire token family.
2. **Multi-Factor Authentication (MFA)**:
   - Mandatory TOTP (RFC 6238) for all Clinicians and Administrators.
   - Biometric authentication (FaceID/TouchID/Fingerprint) enabled on Flutter mobile and desktop.
3. **Identity Verification & Anti-Spoofing Pipeline**:
   - Patient onboarding integrates passive camera selfie liveness analysis to block static photo spoofing (animals, screens, objects).
   - Nigerian National Identity (NIN/BVN) verification with encrypted, hashed storage.
   - Clinician license verification against GMC / MDCN registers.

## Consequences
- No raw passwords stored (Argon2id hashing used exclusively).
- Strict revocation blacklist maintained in Redis Cluster.
