library aura_design_system;

import 'package:flutter/material.dart';

/// Aura Clinical Color Palette for Flutter
class AuraColors {
  // Primary Clinical Anchor
  static const Color tealPrimary = Color(0xFF0D746F);
  static const Color tealDark = Color(0xFF0A5F5B);
  static const Color tealLight = Color(0xFFE6F4F2);

  // Soothing Neutrals
  static const Color slateBackground = Color(0xFFF8FAFC);
  static const Color slateCard = Colors.white;
  static const Color slateBorder = Color(0xFFE2E8F0);
  static const Color slateTextPrimary = Color(0xFF0F172A);
  static const Color slateTextSecondary = Color(0xFF64748B);

  // Status and Clinical Alerts
  static const Color emeraldVerified = Color(0xFF059669);
  static const Color emeraldBackground = Color(0xFFECFDF5);

  static const Color amberWarning = Color(0xFFD97706);
  static const Color amberBackground = Color(0xFFFFFBEB);

  static const Color roseCritical = Color(0xFFE11D48);
  static const Color roseBackground = Color(0xFFFFF1F2);

  static const Color skyInfo = Color(0xFF0284C7);
  static const Color skyBackground = Color(0xFFF0F9FF);
}

/// Clinical App Theme Data
class AuraTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AuraColors.slateBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AuraColors.tealPrimary,
        primary: AuraColors.tealPrimary,
        surface: AuraColors.slateCard,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: AuraColors.slateTextPrimary,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardTheme(
        color: AuraColors.slateCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: AuraColors.slateBorder),
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
