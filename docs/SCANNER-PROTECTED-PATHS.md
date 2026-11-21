# Scanner protected paths

The vulnerability scanner is a flagship TECHNOVA/CyberVerse product and must remain unchanged during unified-platform work.

The following files and directories are protected from changes in this workstream:
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/index.css`
- `frontend/src/services/api.ts`
- `frontend/src/store/scanStore.ts`
- `backend/src/routes/scan.routes.ts`
- `backend/src/controllers/scan.controller.ts`
- `backend/src/controllers/vulnerability.controller.ts`
- `backend/src/routes/vulnerability.routes.ts`
- `backend/src/controllers/report.controller.ts`
- `backend/src/routes/report.routes.ts`
- `backend/src/models/Scan.ts`
- `backend/src/models/Vulnerability.ts`
- `backend/src/services/ScanService.ts`
- `backend/src/services/scanner/**`

Changes to scanner functionality, scan logic, scanner UI, scanner colours or scanner API contracts require a separate explicit approval. Additive TECHNOVA routes and pages must be kept separate from these paths.

The `scanner-protection` GitHub Actions workflow checks changed paths on pushes and pull requests.
