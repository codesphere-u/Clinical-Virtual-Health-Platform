# ADR-008: Secure Document & Medical Imaging Storage

## Status
Accepted

## Context
The platform stores sensitive identification cards, medical diplomas, clinical letters, lab reports, and high-resolution medical imaging studies (DICOM/PNG/PDF). These files represent high-value targets for exfiltration and require robust malware protection.

## Decision
1. **Encrypted Object Storage (S3 / MinIO)**:
   - All object storage buckets enforce server-side AES-256-GCM encryption with customer-managed keys (CMEK).
   - Zero public bucket access. All client uploads and downloads operate via time-limited, pre-signed URLs ($\le 15\text{ minutes}$).
2. **Asynchronous Anti-Malware & Validation Pipeline**:
   - Files are initially uploaded into a quarantined bucket (`/quarantine`).
   - Background worker processes MIME-type sniffing, magic-byte verification, and antivirus scanning (ClamAV) before moving clean files to the secure clinical bucket (`/clinical-vault`).
   - Executable extensions (`.exe`, `.bat`, `.sh`, `.vbs`, etc.) are unconditionally rejected at the API gateway.
3. **Medical Imaging Processing**:
   - Web & mobile clients receive optimized downscaled WebP preview thumbnails for low-bandwidth Nigerian mobile connections, while clinicians on workstation desktop apps can retrieve full lossless diagnostic fidelity.

## Consequences
- File URLs are never saved permanently in database records; only immutable object paths (`s3://...`) are stored, with pre-signed URLs generated on demand upon verified authorization.
