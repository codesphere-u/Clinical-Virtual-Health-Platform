import 'package:flutter/material.dart';
import 'package:aura_design_system/aura_design_system.dart';

void main() {
  runApp(const ClinicianApp());
}

class ClinicianApp extends StatelessWidget {
  const ClinicianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aura Clinician Mobile',
      debugShowCheckedModeBanner: false,
      theme: AuraTheme.lightTheme,
      home: const ClinicianRootNavigation(),
    );
  }
}

class ClinicianRootNavigation extends StatefulWidget {
  const ClinicianRootNavigation({super.key});

  @override
  State<ClinicianRootNavigation> createState() => _ClinicianRootNavigationState();
}

class _ClinicianRootNavigationState extends State<ClinicianRootNavigation> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          ClinicianTodayScreen(),
          PlaceholderScreen(title: 'Patient Directory & EMR'),
          PlaceholderScreen(title: 'Live Waiting Room'),
          PlaceholderScreen(title: 'Messages & Triage'),
          PlaceholderScreen(title: 'Compliance Passport & Profile'),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        indicatorColor: AuraColors.tealLight,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: AuraColors.tealPrimary),
            label: 'Today',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_alt_outlined),
            selectedIcon: Icon(Icons.people_alt, color: AuraColors.tealPrimary),
            label: 'Patients',
          ),
          NavigationDestination(
            icon: Icon(Icons.meeting_room_outlined),
            selectedIcon: Icon(Icons.meeting_room, color: AuraColors.tealPrimary),
            label: 'Waiting (1)',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble, color: AuraColors.tealPrimary),
            label: 'Messages',
          ),
          NavigationDestination(
            icon: Icon(Icons.verified_user_outlined),
            selectedIcon: Icon(Icons.verified_user, color: AuraColors.tealPrimary),
            label: 'Passport',
          ),
        ],
      ),
    );
  }
}

class ClinicianTodayScreen extends StatelessWidget {
  const ClinicianTodayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Dr. Elizabeth Adeyemi', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Cardiology • GMC-7654321', style: TextStyle(fontSize: 11, color: AuraColors.slateTextSecondary)),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AuraColors.emeraldBackground,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AuraColors.emeraldVerified),
            ),
            child: const Text('Passport Verified', style: TextStyle(fontSize: 10, color: AuraColors.emeraldVerified, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Waiting Patient Banner
          Card(
            color: AuraColors.amberBackground,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: AuraColors.amberWarning),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.person_pin_circle_outlined, color: AuraColors.amberWarning, size: 32),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('1 Patient in Waiting Room', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text('Olumide Babalola (MRN: CVH-2026-0001) • Waiting 4m', style: TextStyle(fontSize: 12, color: AuraColors.slateTextSecondary)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AuraColors.tealPrimary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {},
                    child: const Text('Start'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text(title, style: const TextStyle(color: AuraColors.slateTextSecondary))),
    );
  }
}
