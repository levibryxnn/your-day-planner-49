<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to Lovable. Avoid rewriting published git history
> (force push, rebase/amend/squash of commits already pushed). Commits on the
> connected branch sync back to Lovable, so keep pushed branches buildable.
<!-- LOVABLE:END -->

# Rota agent rules

Before editing, read:

- `README.md`
- `docs/PRODUCT_RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/API_INTEGRATION.md`

Rules:

1. Preserve mobile-first UX and explicit user priorities.
2. Keep business rules in engines, not components.
3. Providers must implement the contracts in `src/lib/providers/contracts.ts`.
4. Never expose private API keys in client code or `VITE_*`.
5. Never present mock/estimated data as confirmed.
6. Prefer the smallest safe change; do not redesign unrelated screens.
7. Do not add a UI framework or large dependency without a concrete need.
8. Run typecheck, lint and build before merging.
