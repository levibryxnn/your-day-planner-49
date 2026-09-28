# Security Policy

## Secrets

Never commit API keys, tokens, credentials or private user data.

External-provider secrets must stay server-side. Do not expose them through `VITE_*` variables or React components.

## Reporting

Until a dedicated security channel exists, do not open public issues containing secrets or personal data. Revoke any accidentally exposed credential before further debugging.

## Dependencies

Keep dependencies intentionally small. New packages should solve a concrete problem and pass CI before merge.
