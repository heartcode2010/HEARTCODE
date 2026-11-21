# Protected scanner surface

This list is the initial scanner protection boundary for TECHNOVA OS work. Changes to these paths require explicit owner approval in a separate scanner-specific task. New workspace and Verse work must be additive and must not change these files.

- frontend/src/pages/Dashboard.tsx
- frontend/src/index.css
- frontend/src/components/Scanner/
- frontend/src/components/SourcePanel/
- frontend/src/components/VulnerabilityPanel/
- frontend/src/components/AIDetectionPanel/
- frontend/src/components/TechStackPanel/
- frontend/src/components/OperationModes/
- frontend/src/components/MissionControl/
- frontend/src/components/ScanLayers/
- frontend/src/components/WebsiteDNAPanel/
- frontend/src/components/InfrastructurePanel/
- frontend/src/components/NetworkConsole/
- frontend/src/components/MemoryInspector/
- frontend/src/components/EndpointPanel/
- frontend/src/components/SecretLeakPanel/
- frontend/src/components/BehavioralPanel/
- frontend/src/components/AIForensicsPanel/
- frontend/src/components/ThreatRadar/
- frontend/src/components/ReputationPanel/
- frontend/src/components/ForensicsTimeline/
- frontend/src/components/DOMSurveillance/
- frontend/src/components/ObfuscationPanel/
- frontend/src/components/ShadowAssetPanel/
- frontend/src/components/SecurityIntelPanel/
- frontend/src/components/ExecutionTrace/
- frontend/src/components/BlackboxMode/
- frontend/src/components/XRayOverlay/
- frontend/src/components/ReportExport/
- frontend/src/components/AIAssistant/
- frontend/src/store/scanStore.ts
- frontend/src/store/intelligenceStore.ts
- frontend/src/hooks/useScan.ts
- frontend/src/services/api.ts
- backend/src/routes/scan.routes.ts
- backend/src/routes/vulnerability.routes.ts
- backend/src/services/ScanService.ts
- backend/src/services/scanner/
- backend/src/middleware/crawlerProtection.middleware.ts

The existing global stylesheet is protected because it controls scanner appearance. Do not add TECHNOVA OS styles or variables to it. Keep all new OS styling local to the new workspace page stylesheet.
