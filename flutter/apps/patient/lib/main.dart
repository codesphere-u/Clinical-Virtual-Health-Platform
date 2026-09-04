import 'package:flutter/material.dart';
import 'package:aura_design_system/aura_design_system.dart';
import 'package:aura_appointments/appointments.dart';

void main() {
  runApp(const PatientApp());
}

class PatientApp extends StatelessWidget {
  const PatientApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aura Patient Care',
      debugShowCheckedModeBanner: false,
      theme: AuraTheme.lightTheme,
      home: const PatientRootNavigation(),
    );
  }
}

class PatientRootNavigation extends StatefulWidget {
  const PatientRootNavigation({super.key});

  @override
  State<PatientRootNavigation> createState() => _PatientRootNavigationState();
}

class _PatientRootNavigationState extends State<PatientRootNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    PatientHomeScreen(),
    PatientAppointmentsScreen(),
    PatientRecordsScreen(),
    PatientMessagesScreen(),
    PatientProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        indicatorColor: AuraColors.tealLight,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: AuraColors.tealPrimary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today, color: AuraColors.tealPrimary),
            label: 'Appointments',
          ),
          NavigationDestination(
            icon: Icon(Icons.description_outlined),
            selectedIcon: Icon(Icons.description, color: AuraColors.tealPrimary),
            label: 'Records',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble, color: AuraColors.tealPrimary),
            label: 'Messages',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: AuraColors.tealPrimary),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 1. HOME SCREEN
// ---------------------------------------------------------------------------
class PatientHomeScreen extends StatelessWidget {
  const PatientHomeScreen({super.key});

  void _showWaitingRoomModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const WaitingRoomBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Welcome back,', style: TextStyle(fontSize: 12, color: AuraColors.slateTextSecondary)),
            Text('Olumide Babalola', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AuraColors.slateTextPrimary)),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AuraColors.amberBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AuraColors.amberWarning.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.phone_in_talk, size: 14, color: AuraColors.amberWarning),
                SizedBox(width: 4),
                Text('ER: 112', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AuraColors.amberWarning)),
              ],
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Next Consultation Card
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: AuraColors.tealPrimary, width: 1.5),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AuraColors.tealLight,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Next Video Consultation',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AuraColors.tealPrimary),
                        ),
                      ),
                      const Text('Today, 14:00', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 20,
                        backgroundColor: AuraColors.tealLight,
                        child: Icon(Icons.medical_services_outlined, color: AuraColors.tealPrimary),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Dr. Elizabeth Adeyemi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                          Text('Cardiology • GMC #7654321 (UK)', style: TextStyle(color: AuraColors.slateTextSecondary, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AuraColors.tealPrimary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.videocam_outlined),
                      label: const Text('Enter Waiting Room'),
                      onPressed: () => _showWaitingRoomModal(context),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Vitals Quick Glance
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AuraColors.slateBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Recent Vitals', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AuraColors.slateTextPrimary)),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: const [
                    _VitalItem(label: 'Blood Pressure', value: '142/90', unit: 'mmHg', isWarning: true),
                    _VitalItem(label: 'Heart Rate', value: '76', unit: 'bpm'),
                    _VitalItem(label: 'SpO2', value: '98%', unit: 'Oxygen'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VitalItem extends StatelessWidget {
  final String label;
  final String value;
  final String unit;
  final bool isWarning;

  const _VitalItem({required this.label, required this.value, required this.unit, this.isWarning = false});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AuraColors.slateTextSecondary)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isWarning ? AuraColors.roseCritical : AuraColors.tealPrimary)),
        Text(unit, style: const TextStyle(fontSize: 10, color: AuraColors.slateTextSecondary)),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// 2. APPOINTMENTS SCREEN
// ---------------------------------------------------------------------------
class PatientAppointmentsScreen extends StatelessWidget {
  const PatientAppointmentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final sampleApt = ClinicalAppointment(
      id: 'apt-001',
      clinicianId: 'c1',
      clinicianName: 'Dr. Elizabeth Adeyemi',
      clinicianSpecialty: 'Cardiology',
      clinicianLicense: 'GMC #7654321',
      scheduledStart: DateTime.now().add(const Duration(hours: 2)),
      scheduledEnd: DateTime.now().add(const Duration(hours: 3)),
      status: FlutterAppointmentStatus.booked,
      roomSid: 'cvh-room-001',
      presentingReason: 'Hypertension titration & ambulatory BP review',
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Appointments & Visits', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.only(top: 8),
        children: [
          AppointmentCardWidget(
            appointment: sampleApt,
            onActionPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (ctx) => const WaitingRoomBottomSheet(),
              );
            },
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: OutlinedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening Slot Booking Engine...')),
                );
              },
              icon: const Icon(Icons.add_circle_outline, color: AuraColors.tealPrimary),
              label: const Text('Book New Telemedicine Consultation', style: TextStyle(color: AuraColors.tealPrimary)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AuraColors.tealPrimary),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 3. RECORDS & RESULTS SCREEN
// ---------------------------------------------------------------------------
class PatientRecordsScreen extends StatelessWidget {
  const PatientRecordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clinical Records & Prescriptions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Allergy Alert Banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AuraColors.roseBackground,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AuraColors.roseCritical.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: AuraColors.roseCritical),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('DOCUMENTED CLINICAL ALLERGY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AuraColors.roseCritical)),
                      Text('Penicillin (Life-Threatening) • Sulfa Drugs (Moderate)', style: TextStyle(fontSize: 12, color: Colors.black87)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Active Prescriptions Card
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: AuraColors.slateBorder),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Active E-Prescriptions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Chip(
                        label: Text('SHA-256 SEALED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AuraColors.emeraldVerified)),
                        backgroundColor: AuraColors.emeraldBackground,
                        visualDensity: VisualDensity.compact,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(
                      backgroundColor: AuraColors.tealLight,
                      child: Icon(Icons.medication, color: AuraColors.tealPrimary),
                    ),
                    title: const Text('Amlodipine Besylate 10mg', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('1 tablet once daily • 30 days supply\nPrescription: RX-2026-88491', style: TextStyle(fontSize: 12)),
                    trailing: IconButton(
                      icon: const Icon(Icons.qr_code, color: AuraColors.tealPrimary),
                      onPressed: () {},
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Diagnostic Lab Orders
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: AuraColors.slateBorder),
            ),
            child: const Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Recent Lab Investigations', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  SizedBox(height: 8),
                  Text('• LAB-2026-10492: Lipid Profile & Serum Creatinine (Resulted: Normal)', style: TextStyle(fontSize: 13)),
                  SizedBox(height: 4),
                  Text('• Ordered by Dr. Elizabeth Adeyemi on 03/09/2026', style: TextStyle(fontSize: 11, color: AuraColors.slateTextSecondary)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 4. MESSAGES SCREEN
// ---------------------------------------------------------------------------
class PatientMessagesScreen extends StatelessWidget {
  const PatientMessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Encrypted Clinical Messaging', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AuraColors.tealLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              'End-to-end encrypted messaging with your designated clinical team under UK GDPR & NDPA 2023 regulations.',
              style: TextStyle(fontSize: 12, color: AuraColors.tealPrimary),
            ),
          ),
          const SizedBox(height: 16),
          ListTile(
            leading: const CircleAvatar(
              backgroundColor: AuraColors.tealLight,
              child: Text('EA', style: TextStyle(fontWeight: FontWeight.bold, color: AuraColors.tealPrimary)),
            ),
            title: const Text('Dr. Elizabeth Adeyemi', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Your lab results have been reviewed. Looking forward to our call.', maxLines: 1),
            trailing: const Text('10:45 AM', style: TextStyle(fontSize: 11, color: AuraColors.slateTextSecondary)),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 5. PROFILE & KYC SCREEN
// ---------------------------------------------------------------------------
class PatientProfileScreen extends StatelessWidget {
  const PatientProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile & Biometric KYC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: AuraColors.tealLight,
                  child: Text('OB', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AuraColors.tealPrimary)),
                ),
                SizedBox(height: 10),
                Text('Olumide Babalola', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text('MRN: CVH-2026-0001 • Lagos, Nigeria', style: TextStyle(fontSize: 12, color: AuraColors.slateTextSecondary)),
              ],
            ),
          ),
          SizedBox(height: 24),
          ListTile(
            leading: Icon(Icons.verified_user, color: AuraColors.emeraldVerified),
            title: Text('National Identity (NIN/BVN)'),
            subtitle: Text('Verified via NIMC & Smile ID (Phase 2 KYC)'),
            trailing: Icon(Icons.check_circle, color: AuraColors.emeraldVerified, size: 20),
          ),
          Divider(),
          ListTile(
            leading: Icon(Icons.security, color: AuraColors.tealPrimary),
            title: Text('Dual-Jurisdiction Data Consent'),
            subtitle: Text('Nigeria NDPA 2023 & UK GDPR Cross-Border Active'),
            trailing: Icon(Icons.chevron_right),
          ),
          Divider(),
          ListTile(
            leading: Icon(Icons.emergency, color: AuraColors.roseCritical),
            title: Text('Emergency Dispatch Contacts'),
            subtitle: Text('Dial 112 (Nigeria) / 999 (United Kingdom)'),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// 6. REALTIME WAITING ROOM BOTTOM SHEET (ADR-009)
// ---------------------------------------------------------------------------
class WaitingRoomBottomSheet extends StatefulWidget {
  const WaitingRoomBottomSheet({super.key});

  @override
  State<WaitingRoomBottomSheet> createState() => _WaitingRoomBottomSheetState();
}

class _WaitingRoomBottomSheetState extends State<WaitingRoomBottomSheet> {
  final int _secondsWaiting = 14;
  final bool _clinicianReady = true;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
          ),
          const SizedBox(height: 20),
          const Text('Virtual Waiting Room', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Consultation with Dr. Elizabeth Adeyemi', style: TextStyle(color: AuraColors.slateTextSecondary, fontSize: 13)),
          const SizedBox(height: 24),

          // Pulsing Queue Status
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: AuraColors.tealLight,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.wifi, color: AuraColors.tealPrimary, size: 20),
                const SizedBox(width: 8),
                Text('Heartbeat Active • Connection: Excellent (${_secondsWaiting}s)', style: const TextStyle(fontWeight: FontWeight.w600, color: AuraColors.tealPrimary, fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(height: 24),

          if (_clinicianReady) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AuraColors.emeraldBackground,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AuraColors.emeraldVerified.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: AuraColors.emeraldVerified, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Clinician is Ready!', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AuraColors.emeraldVerified)),
                        Text('Dr. Adeyemi has opened the WebRTC encrypted room.', style: TextStyle(fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AuraColors.emeraldVerified,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.videocam),
                label: const Text('Join Live Video Consultation Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                onPressed: () {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Connected to LiveKit SFU Room: cvh-room-001')),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }
}
