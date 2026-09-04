library aura_clinical;

/// Severity levels for clinical allergy classification
enum ClinicalAllergySeverity {
  mild,
  moderate,
  severe,
  lifeThreatening,
}

/// Structured SOAP Clinical Note model
class SoapClinicalNote {
  final String id;
  final String appointmentId;
  final String presentingComplaint;
  final String historyOfPresentingComplaint;
  final String treatmentPlan;
  final String safetyNettingAdvice;
  final String primaryDiagnosisCode;
  final String primaryDiagnosisName;
  final bool isLocked;
  final String? signatureHash;
  final DateTime updatedAt;

  const SoapClinicalNote({
    required this.id,
    required this.appointmentId,
    required this.presentingComplaint,
    required this.historyOfPresentingComplaint,
    required this.treatmentPlan,
    required this.safetyNettingAdvice,
    required this.primaryDiagnosisCode,
    required this.primaryDiagnosisName,
    required this.isLocked,
    this.signatureHash,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'appointmentId': appointmentId,
        'presentingComplaint': presentingComplaint,
        'historyOfPresentingComplaint': historyOfPresentingComplaint,
        'treatmentPlan': treatmentPlan,
        'safetyNettingAdvice': safetyNettingAdvice,
        'primaryDiagnosisCode': primaryDiagnosisCode,
        'primaryDiagnosisName': primaryDiagnosisName,
        'isLocked': isLocked,
        'signatureHash': signatureHash,
        'updatedAt': updatedAt.toIso8601String(),
      };
}

/// Clinical Vitals measurement model with validation
class PatientVitals {
  final int systolicBp;
  final int diastolicBp;
  final int heartRateBpm;
  final int spo2Percentage;
  final double temperatureCelsius;
  final DateTime recordedAt;

  const PatientVitals({
    required this.systolicBp,
    required this.diastolicBp,
    required this.heartRateBpm,
    required this.spo2Percentage,
    required this.temperatureCelsius,
    required this.recordedAt,
  });

  bool get isHypertensiveEmergency => systolicBp >= 180 || diastolicBp >= 120;
  bool get isHypoxic => spo2Percentage < 92;

  String formatBp() => '$systolicBp/$diastolicBp mmHg';
  String formatHr() => '$heartRateBpm bpm';
  String formatSpo2() => '$spo2Percentage%';
}

/// Electronic Prescription Item model
class PrescriptionItem {
  final String medicationName;
  final String strength;
  final String dosage;
  final String frequency;
  final String duration;
  final String? specialInstructions;

  const PrescriptionItem({
    required this.medicationName,
    required this.strength,
    required this.dosage,
    required this.frequency,
    required this.duration,
    this.specialInstructions,
  });
}

/// Full Authorized E-Prescription Model
class ElectronicPrescription {
  final String prescriptionCode;
  final String patientId;
  final String clinicianName;
  final String clinicianLicense;
  final List<PrescriptionItem> items;
  final String status;
  final String digitalSignatureHash;
  final DateTime issuedAt;
  final DateTime expiresAt;

  const ElectronicPrescription({
    required this.prescriptionCode,
    required this.patientId,
    required this.clinicianName,
    required this.clinicianLicense,
    required this.items,
    required this.status,
    required this.digitalSignatureHash,
    required this.issuedAt,
    required this.expiresAt,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);
}
