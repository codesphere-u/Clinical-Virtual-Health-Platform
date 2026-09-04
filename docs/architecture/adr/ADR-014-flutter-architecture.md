# ADR-014: Modular Shared Flutter Architecture for Mobile & Desktop

## Status
Accepted

## Context
The platform requires native client applications for:
1. Nigerian Patients on mobile (Android & iOS).
2. Clinicians on mobile (Android & iOS) for schedule reviews and on-the-go alerts.
3. Clinicians on desktop (Windows & macOS) for high-density clinical workstations.
Rebuilding networking, authentication, video, and design systems separately for each application leads to duplication and bugs.

## Decision
We organize Flutter applications into a **Modular Flutter Workspace** with decoupled packages:

```text
flutter/
├── apps/
│   ├── patient/            # Mobile-optimized patient journey (Cards, touch, bottom nav)
│   ├── clinician/          # Mobile-optimized clinician schedule & alert app
│   └── desktop/            # Desktop workstation (Multi-window, shortcuts, high density)
└── packages/
    ├── core/               # Shared primitives, base bloc/notifier, logger, errors
    ├── design_system/      # Aura Clinical Flutter widgets, typography, colors, assets
    ├── auth/               # Biometrics, secure token storage, session listener
    ├── networking/         # Dio HTTP client, offline cache, retry interceptor
    ├── storage/            # Encrypted local database (Hive/Isar/sqlite-cipher)
    ├── clinical/           # SOAP models, vitals formatters, timeline widgets
    ├── appointments/       # Booking state, slot pickers, calendar widgets
    ├── video/              # LiveKit WebRTC client integration & room controller
    ├── notifications/      # Local notifications & push handlers
    ├── localization/       # Internationalization strings (en-NG, en-GB, future)
    └── security/           # Anti-tamper, jailbreak/root detection, cert pinning
```

## Consequences
- Clean separation between patient touch ergonomics and dense clinician workstation UI while 100% reusing networking, auth, and business logic.
