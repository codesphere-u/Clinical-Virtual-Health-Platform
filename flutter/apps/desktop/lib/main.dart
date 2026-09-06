import 'package:flutter/material.dart';
import 'package:docaas_design_system/docaas_design_system.dart';

void main() {
  runApp(const ClinicianWorkstationDesktopApp());
}

class ClinicianWorkstationDesktopApp extends StatelessWidget {
  const ClinicianWorkstationDesktopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DOCAAS Clinical Workstation',
      debugShowCheckedModeBanner: false,
      theme: DocaasTheme.lightTheme,
      home: const WorkstationShell(),
    );
  }
}

class WorkstationShell extends StatelessWidget {
  const WorkstationShell({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 56,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: DocaasColors.tealPrimary,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'DOCAAS WORKSTATION',
                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
              ),
            ),
            const SizedBox(width: 16),
            const Text('Dr. Elizabeth Adeyemi', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(width: 8),
            const Text('• GMC: 7654321', style: TextStyle(fontSize: 12, color: DocaasColors.slateTextSecondary)),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Global Patient Search (Ctrl+K)',
            icon: const Icon(Icons.search, size: 20),
            onPressed: () {},
          ),
          IconButton(
            tooltip: 'Shortcuts Reference',
            icon: const Icon(Icons.keyboard_outlined, size: 20),
            onPressed: () {},
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Row(
        children: const [
          // Left Panel: Patient Snapshot & Medical History (Width: 320)
          SizedBox(
            width: 320,
            child: PatientSnapshotPanel(),
          ),
          VerticalDivider(width: 1, color: DocaasColors.slateBorder),

          // Center Panel: Active Video & Consultation Timer (Expanded)
          Expanded(
            flex: 4,
            child: VideoConsultationViewport(),
          ),
          VerticalDivider(width: 1, color: DocaasColors.slateBorder),

          // Right Panel: Tabbed Documentation Workspace (Width: 460)
          SizedBox(
            width: 460,
            child: DocumentationWorkspacePanel(),
          ),
        ],
      ),
    );
  }
}

class PatientSnapshotPanel extends StatelessWidget {
  const PatientSnapshotPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('PATIENT SNAPSHOT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DocaasColors.slateTextSecondary, letterSpacing: 0.8)),
          const SizedBox(height: 12),
          const Text('Olumide Babalola', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: DocaasColors.slateTextPrimary)),
          const Text('MRN: CVH-2026-0001 • 44y (1982-04-12)', style: TextStyle(fontSize: 12, color: DocaasColors.slateTextSecondary)),
          const SizedBox(height: 16),

          // Allergies Warning
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: DocaasColors.roseBackground,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: DocaasColors.roseCritical.withAlpha(77)),
            ),
            child: Row(
              children: const [
                Icon(Icons.warning_amber_rounded, color: DocaasColors.roseCritical, size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text('Allergy: Penicillin (Life-threatening)', style: TextStyle(color: DocaasColors.roseCritical, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Vitals Box
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: DocaasColors.slateBackground,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: DocaasColors.slateBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Baseline Vitals', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 8),
                Text('BP: 142/90 mmHg • HR: 76 bpm', style: TextStyle(fontSize: 12)),
                Text('SpO2: 98% • Genotype: AA', style: TextStyle(fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class VideoConsultationViewport extends StatelessWidget {
  const VideoConsultationViewport({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A), // Dark medical cinema viewport
      child: Stack(
        children: [
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.videocam, size: 64, color: Colors.white24),
                SizedBox(height: 12),
                Text('Encrypted Telemedicine Session Active', style: TextStyle(color: Colors.white70, fontSize: 14)),
                SizedBox(height: 4),
                Text('LiveKit WebRTC SFU • 1080p • 0% Packet Loss', style: TextStyle(color: DocaasColors.emeraldVerified, fontSize: 11)),
              ],
            ),
          ),

          // Top Overlay: Duration & Encryption Status
          Positioned(
            top: 16,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: const [
                  Icon(Icons.lock, color: DocaasColors.emeraldVerified, size: 14),
                  SizedBox(width: 6),
                  Text('End-to-End Encrypted • 14:28', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),

          // Bottom Controls Bar
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton.filled(
                  style: IconButton.styleFrom(backgroundColor: Colors.white12),
                  icon: const Icon(Icons.mic, color: Colors.white),
                  onPressed: () {},
                ),
                const SizedBox(width: 12),
                IconButton.filled(
                  style: IconButton.styleFrom(backgroundColor: Colors.white12),
                  icon: const Icon(Icons.videocam, color: Colors.white),
                  onPressed: () {},
                ),
                const SizedBox(width: 12),
                IconButton.filled(
                  style: IconButton.styleFrom(backgroundColor: DocaasColors.roseCritical),
                  icon: const Icon(Icons.call_end, color: Colors.white),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class DocumentationWorkspacePanel extends StatelessWidget {
  const DocumentationWorkspacePanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('CLINICAL ENCOUNTER (SOAP)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: DocaasColors.slateTextSecondary, letterSpacing: 0.8)),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: DocaasColors.tealPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
                icon: const Icon(Icons.check, size: 14),
                label: const Text('Sign Note (Alt+S)', style: TextStyle(fontSize: 11)),
                onPressed: () {},
              ),
            ],
          ),
          const SizedBox(height: 12),

          Expanded(
            child: ListView(
              children: const [
                Text('History & Presenting Complaint', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 4),
                TextField(
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Presenting complaint, duration, progression...',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(10),
                  ),
                ),
                SizedBox(height: 12),

                Text('Assessment & Primary Diagnosis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 4),
                TextField(
                  decoration: InputDecoration(
                    hintText: 'e.g. Essential Hypertension (I10)',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(10),
                  ),
                ),
                SizedBox(height: 12),

                Text('Intervention & Treatment Plan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 4),
                TextField(
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Medications, dosage adjustments, lifestyle...',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(10),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
