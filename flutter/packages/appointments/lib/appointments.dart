library aura_appointments;

import 'package:flutter/material.dart';
import 'package:aura_design_system/aura_design_system.dart';

enum FlutterAppointmentStatus {
  booked,
  confirmed,
  patientWaiting,
  consultationStarted,
  consultationCompleted,
  cancelled,
}

class ClinicalAppointment {
  final String id;
  final String clinicianId;
  final String clinicianName;
  final String clinicianSpecialty;
  final String clinicianLicense;
  final DateTime scheduledStart;
  final DateTime scheduledEnd;
  final FlutterAppointmentStatus status;
  final String roomSid;
  final String presentingReason;

  const ClinicalAppointment({
    required this.id,
    required this.clinicianId,
    required this.clinicianName,
    required this.clinicianSpecialty,
    required this.clinicianLicense,
    required this.scheduledStart,
    required this.scheduledEnd,
    required this.status,
    required this.roomSid,
    required this.presentingReason,
  });
}

/// Reusable Appointment Summary Card widget
class AppointmentCardWidget extends StatelessWidget {
  final ClinicalAppointment appointment;
  final VoidCallback onActionPressed;
  final String actionLabel;

  const AppointmentCardWidget({
    super.key,
    required this.appointment,
    required this.onActionPressed,
    this.actionLabel = 'Enter Waiting Room',
  });

  Color _getStatusColor() {
    switch (appointment.status) {
      case FlutterAppointmentStatus.booked:
        return AuraColors.tealPrimary;
      case FlutterAppointmentStatus.patientWaiting:
        return Colors.amber.shade700;
      case FlutterAppointmentStatus.consultationStarted:
        return AuraColors.emeraldVerified;
      case FlutterAppointmentStatus.consultationCompleted:
        return AuraColors.slateTextSecondary;
      case FlutterAppointmentStatus.cancelled:
        return AuraColors.roseCritical;
      default:
        return AuraColors.tealPrimary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AuraColors.slateBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: AuraColors.tealLight,
                    child: const Icon(Icons.videocam, color: AuraColors.tealPrimary),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appointment.clinicianName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: AuraColors.slateTextPrimary,
                        ),
                      ),
                      Text(
                        '${appointment.clinicianSpecialty} • ${appointment.clinicianLicense}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AuraColors.slateTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor().withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  appointment.status.name.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: _getStatusColor(),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            appointment.presentingReason,
            style: const TextStyle(fontSize: 13, color: AuraColors.slateTextPrimary),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.access_time, size: 14, color: AuraColors.slateTextSecondary),
                  const SizedBox(width: 4),
                  Text(
                    '${appointment.scheduledStart.hour}:${appointment.scheduledStart.minute.toString().padLeft(2, '0')}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AuraColors.slateTextSecondary,
                    ),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: onActionPressed,
                icon: const Icon(Icons.meeting_room, size: 16),
                label: Text(actionLabel),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AuraColors.tealPrimary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
