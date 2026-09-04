import 'dart:math';

/// Resilient API Response wrapper
class ApiResponse<T> {
  final int statusCode;
  final T? data;
  final String? error;
  final String? correlationId;
  final bool isIdempotentHit;

  const ApiResponse({
    required this.statusCode,
    this.data,
    this.error,
    this.correlationId,
    this.isIdempotentHit = false,
  });

  bool get isSuccess => statusCode >= 200 && statusCode < 300;
}

/// Clinical HTTP Interceptor & Header Generator (ADR-013)
class ClinicalNetworkClient {
  final String baseUrl;
  String? _authToken;

  ClinicalNetworkClient({
    this.baseUrl = 'http://localhost:4000',
  });

  void setAuthToken(String token) {
    _authToken = token;
  }

  /// Generates RFC-compliant UUIDv4 for correlation tracking
  static String generateUuidV4() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122
    final hex = bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}';
  }

  Map<String, String> buildHeaders({String? idempotencyKey}) {
    final headers = <String, String>{
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-correlation-id': generateUuidV4(),
    };

    if (idempotencyKey != null) {
      headers['x-idempotency-key'] = idempotencyKey;
    }

    if (_authToken != null) {
      headers['authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }
}
