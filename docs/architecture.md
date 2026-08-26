# Capacity Service Architecture

The service separates transport, domain policy, and persistence. Express supplies request correlation and structured error serialization. The domain service owns capacity scope validation, role gates, idempotency, and state transitions. The store writes a complete replacement document to a temporary file before atomic rename, so a valid commit cannot expose a partially written JSON document.

| State | Required role | Next state |
| --- | --- | --- |
| submitted | capacity_assessment_analyst | capacity_assessed |
| capacity_assessed | capacity_availability_verifier | availability_verified |
| availability_verified | capacity_reservation_validator | reservation_validated |
| reservation_validated | capacity_authority | capacity_authorized |
| capacity_authorized | capacity_registrar | capacity_released |

The service never mutates a review before scope, actor, request identifier, and current state checks pass.
