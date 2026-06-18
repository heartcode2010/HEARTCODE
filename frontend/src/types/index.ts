// ── Risk & Severity ──
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface RiskBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

// ── Vulnerability Scanner ──
export interface VulnerabilityFinding {
  _id?: string;
  idString?: string;
  category?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  confidence?: 'Certain' | 'Firm' | 'Tentative';
  name: string;
  description?: string;
  technicalExplanation?: string;
  businessImpact?: string;
  remediation?: string;
  evidence: string;

  // Legacy/Original fields compatibility
  risk?: RiskLevel;
  desc?: string;
  rec?: string;
}

// ── AI Generation Detector ──
export interface AIDetectionSignal {
  fired: boolean;
  weight: number;
  icon: string;
  label: string;
  detail: string;
}

export interface AIDetectionResult {
  score: number;
  signals: AIDetectionSignal[];
  tools: string[];
}

// ── Tech Stack Detector ──
export interface TechStackFinding {
  cat: string;
  name: string;
  icon: string;
  evidence: string;
}

// ── Scan Data ──
export interface ScanStats {
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
}

export interface Scan {
  id: string;
  url: string;
  htmlSource: string;
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
  timestamp?: string;
  userId?: string;
}

export interface ScanHistoryEntry {
  url: string;
  time: number;
  size: string;
  lines: string;
}

// ── Export ──
export type ExportFormat = 'html' | 'md' | 'json' | 'csv';

// ── UI State ──
export type PreviewState = 'closed' | 'open' | 'minimized' | 'maximized';
export type ViewMode = 'raw' | 'highlighted' | 'stripped';
export type StatusState = 'idle' | 'working' | 'ok' | 'fail';

// ── Auth ──
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

// ── API Responses ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ── Export Menu ──
export interface ExportFormatOption {
  fmt: ExportFormat;
  icon: string;
  label: string;
  sub: string;
}

// Aliases for compilation safety
export interface AIAnalysisResult {
  score: number;
  signals: AIDetectionSignal[];
  tools: string[];
}

export interface UserSettings {
  defaultView: 'raw' | 'highlighted' | 'stripped';
  enableAutoScan: boolean;
  theme: 'cyberpunk' | 'dark';
}

// ══════════════════════════════════════════════════════════════════════════════
// ── INTELLIGENCE OS TYPES ──
// ══════════════════════════════════════════════════════════════════════════════

// ── Operation Modes ──
export type OperationMode = 'recon' | 'stealth' | 'ai-forensics' | 'threat-hunt' | 'deep-trace' | 'blackbox';
export type ScanLayer = 'surface' | 'deep-recon' | 'behavioral' | 'ai-forensics' | 'threat-hunt' | 'privacy-audit' | 'architecture';
export type ScanPhase = 'idle' | 'surface' | 'deep' | 'behavioral' | 'forensics' | 'threat' | 'privacy' | 'architecture' | 'complete';

// ── Infrastructure Intelligence ──
export interface InfrastructureNode {
  id: string;
  type: 'target' | 'frontend' | 'hosting' | 'cdn' | 'analytics' | 'auth' | 'payment' | 'cloud' | 'email' | 'dns' | 'backend' | 'api' | 'database';
  name: string;
  provider: string;
  icon: string;
  confidence: number;
}

export interface InfrastructureEdge {
  from: string;
  to: string;
  label: string;
  type: 'uses' | 'hosts' | 'serves' | 'authenticates' | 'tracks' | 'processes';
}

export interface InfrastructureMap {
  nodes: InfrastructureNode[];
  edges: InfrastructureEdge[];
  hostingProvider: string;
  cdnProvider: string;
  dnsProvider: string;
  cloudServices: string[];
}

// ── Website DNA ──
export interface WebsiteDNAProfile {
  architectureSignature: string;
  developmentStyle: string;
  sophisticationScore: number;
  estimatedTeamSize: string;
  aiContributionLevel: number;
  frameworkArchitecture: string;
  deploymentPattern: string;
  componentStructure: string;
  codeOrganization: string;
  designSystemUsage: string;
  buildToolchain: string;
  indicators: DNAIndicator[];
}

export interface DNAIndicator {
  category: string;
  label: string;
  value: string | number;
  confidence: number;
  icon: string;
}

// ── Network Interception ──
export interface NetworkRequest {
  id: string;
  type: 'fetch' | 'xhr' | 'websocket' | 'script' | 'stylesheet' | 'image' | 'redirect';
  method: string;
  url: string;
  status: number;
  timestamp: number;
  size?: string;
  duration?: number;
  initiator?: string;
  headers?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  isThirdParty: boolean;
  category: string;
}

// ── Memory Inspector ──
export interface CookieEntry {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  expires?: string;
  riskLevel: 'safe' | 'warning' | 'danger';
}

export interface MemorySnapshot {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  cookies: CookieEntry[];
  cachedAuthData: string[];
  runtimeVariables: string[];
}

// ── API Endpoint Discovery ──
export interface DiscoveredEndpoint {
  id: string;
  url: string;
  type: 'REST' | 'GraphQL' | 'WebSocket' | 'Firebase' | 'Supabase' | 'AJAX';
  method: string;
  source: string;
  confidence: number;
  authenticated: boolean;
}

// ── Secret & Token Leak Detection ──
export interface SecretFinding {
  id: string;
  type: string;
  pattern: string;
  maskedValue: string;
  rawValue?: string;
  severity: 'Critical' | 'High' | 'Medium';
  location: string;
  lineNumber?: number;
  description: string;
  remediation: string;
}

// ── Behavioral Analysis ──
export interface BehavioralProfile {
  privacyRiskScore: number;
  trackingIntensity: number;
  behavioralRiskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  trackers: string[];
  fingerprinters: string[];
  hiddenRedirects: string[];
  backgroundRequests: string[];
  suspiciousBehaviors: SuspiciousBehavior[];
}

export interface TrackerInfo {
  name: string;
  type: string;
  category: string;
  severity: string;
  evidence: string;
}

export interface SuspiciousBehavior {
  type: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  evidence: string;
}

// ── AI Forensics ──
export interface AIForensicsResult {
  aiConfidenceScore: number;
  probableAISource: string[];
  aiRegions: AICodeRegion[];
  humanVsAiRatio: number;
  gptPatterns: number;
  copilotPatterns: number;
  claudePatterns: number;
  genericAIPatterns: number;
  analysis: AIForensicsAnalysis[];
}

export interface AICodeRegion {
  startLine: number;
  endLine: number;
  confidence: number;
  source: string;
  reason: string;
}

export interface AIForensicsAnalysis {
  category: string;
  label: string;
  detail: string;
  score: number;
  icon: string;
}

// ── Human vs AI Classification ──
export interface CodeClassification {
  startLine: number;
  endLine: number;
  type: 'sensitive' | 'ai-generated' | 'human-written';
  description: string;
}

// ── DOM Surveillance ──
export interface DOMSurveillanceResult {
  hiddenElementsCount: number;
  hiddenElements: string[];
  injectedIframes: string[];
  shadowDomCount: number;
  runtimeInjections: string[];
}

export interface DOMFinding {
  type: string;
  selector: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  evidence: string;
}

// ── JS Obfuscation ──
export interface ObfuscationResult {
  obfuscationLevel: number;
  obfuscatedScripts: string[];
  evalUsageCount: number;
  antiDebuggingDetected: boolean;
}

export interface ObfuscationTechnique {
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  evidence: string;
  count: number;
}

// ── Shadow Assets ──
export interface ShadowAsset {
  id: string;
  type: 'source-map' | 'backup' | 'hidden-js' | 'hidden-route' | 'exposed-bundle' | 'forgotten-asset';
  url: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  evidence: string;
}

// ── SSL/TLS & Security Intelligence ──
export interface SecurityIntelResult {
  tlsVersion: string;
  securityHeaders: {
    csp: boolean;
    hsts: boolean;
    xframe: boolean;
    xcontent: boolean;
  };
  owaspMapping: string[];
}

export interface SecurityHeader {
  name: string;
  present: boolean;
  value?: string;
  recommendation: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
}

export interface CookieSecurityResult {
  totalCookies: number;
  secureCookies: number;
  httpOnlyCookies: number;
  sameSiteCookies: number;
  trackingCookies: number;
}

export interface OWASPMapping {
  category: string;
  code: string;
  finding: string;
  severity: string;
}

// ── JS Execution Trace ──
export interface ExecutionTraceResult {
  entryPoint: string;
  traceSteps: Array<{
    trigger: string;
    handler: string;
    target: string;
    durationMs: number;
  }>;
}

export interface TracedFunction {
  name: string;
  type: 'declaration' | 'expression' | 'arrow' | 'async' | 'generator';
  line: number;
  calls: string[];
  isAsync: boolean;
}

export interface AsyncChain {
  start: string;
  steps: string[];
  type: 'promise' | 'async-await' | 'callback';
}

export interface EventListenerInfo {
  event: string;
  target: string;
  handler: string;
  line: number;
}

// ── Forensics Timeline ──
export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: 'page-load' | 'analytics-init' | 'websocket-open' | 'api-request' | 'tracker-injection' | 'dom-mutation' | 'script-load' | 'redirect' | 'auth-event' | 'storage-write';
  label: string;
  detail: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  icon: string;
}

// ── Reputation Scores ──
export interface ReputationScores {
  security: number;
  privacy: number;
  exposure: number;
  trust: number;
  aiAuthenticity: number;
  overall: number;
  grades: Record<string, string>;
}

// ── Threat Radar ──
export interface ThreatRadarData {
  attackSurface: number;
  aiUsage: number;
  privacyExposure: number;
  trackingIntensity: number;
  obfuscationLevel: number;
  infrastructureComplexity: number;
  overallThreat: number;
}

// ── Design System Detection ──
export interface DesignSystemResult {
  designSystems: string[];
  uiLibraries: string[];
  componentArchitecture: string;
  typographySystem: TypographyInfo;
  animationFrameworks: string[];
  colorPalette: string[];
  layoutSystem: string;
}

export interface TypographyInfo {
  primaryFont: string;
  secondaryFont: string;
  fontSources: string[];
  customFonts: string[];
}

// ── Intelligence Report ──
export type IntelligenceReportType = 'full' | 'architecture' | 'ai-forensics' | 'threat' | 'infrastructure' | 'privacy';

export interface IntelligenceReport {
  type: IntelligenceReportType;
  generatedAt: string;
  targetUrl: string;
  sections: ReportSection[];
  scores: ReputationScores;
  summary: string;
}

export interface ReportSection {
  title: string;
  content: string;
  findings: number;
  severity: string;
}

// ── Mission Control ──
export interface MissionTelemetry {
  activeScans: number;
  completedScans: number;
  totalFindings: number;
  criticalFindings: number;
  scanProgress: number;
  currentPhase: ScanPhase;
  uptime: number;
  modulesLoaded: number;
}

// ════════════════════════════════════════════════════════════════════════════════
// CYBER ACADEMY — Type Definitions
// ════════════════════════════════════════════════════════════════════════════════

// ── Academy Section Navigation ──
export type AcademySection =
  | 'landing' | 'training' | 'tutor' | 'phishing-lab' | 'labs'
  | 'challenges' | 'certifications' | 'org-dashboard' | 'threat-hub'
  | 'scam-detector' | 'career-hub' | 'knowledge' | 'sme-toolkit'
  | 'incident-response' | 'safety-scorecard' | 'curriculum'
  | 'campaign-builder' | 'threat-feed';

// ── Learning Paths ──
export type TrainingTrack = 'individuals' | 'businesses' | 'schools';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  track: TrainingTrack;
  icon: string;
  duration: string;        // e.g. "15 min"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: LearningTopic[];
  completed: boolean;
  progress: number;        // 0-100
}

export interface LearningTopic {
  id: string;
  title: string;
  content: string;         // markdown-formatted content
  keyPoints: string[];
  examples: string[];
  quiz?: QuizQuestion[];
  completed: boolean;
}

export interface LearningProgress {
  userId?: string;
  modulesCompleted: number;
  totalModules: number;
  quizzesPassed: number;
  totalQuizzes: number;
  badgesEarned: string[];
  certificatesEarned: string[];
  streakDays: number;
  totalXP: number;
  level: number;
  lastActivity: string;
}

// ── AI Tutor ──
export type TutorMode = 'beginner' | 'intermediate' | 'advanced';

export interface TutorMessage {
  id: string;
  role: 'user' | 'tutor';
  content: string;
  timestamp: string;
  mode: TutorMode;
  category?: string;
}

export interface TutorConversation {
  messages: TutorMessage[];
  mode: TutorMode;
  sessionId: string;
}

// ── Phishing Lab ──
export type PhishingSampleType = 'email' | 'sms' | 'whatsapp' | 'login-page' | 'social-media';

export interface PhishingSample {
  id: string;
  type: PhishingSampleType;
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
  sender?: string;
  content: string;
  isPhishing: boolean;
  redFlags: RedFlag[];
  explanation: string;
}

export interface RedFlag {
  text: string;
  indicator: string;
  location: string;
}

export interface PhishingLabState {
  currentSample: PhishingSample | null;
  answeredCorrectly: number;
  answeredIncorrectly: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  score: number;
}

// ── Quizzes & Challenges ──
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface CyberQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  timeLimit?: number;       // seconds
  passingScore: number;     // percentage
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  passed: boolean;
  completedAt: string;
  xpEarned: number;
}

// ── Badges & Achievements ──
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: string;
  earned: boolean;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  progress: number;
  target: number;
}

// ── Certificates ──
export interface CertificateData {
  id: string;
  title: string;
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  skills: string[];
  verificationUrl?: string;
}

// ── Scam Detection ──
export type ScamInputType = 'email' | 'sms' | 'whatsapp' | 'social-media' | 'website' | 'job-offer';
export type ScamCategory =
  | 'phishing' | 'investment' | 'romance' | 'impersonation'
  | 'crypto' | 'fake-job' | 'fake-giveaway' | 'advance-fee'
  | 'identity-theft' | 'bec' | 'safe';

export interface ScamAnalysis {
  inputType: ScamInputType;
  inputContent: string;
  confidenceScore: number;     // 0-100
  isLikelyScam: boolean;
  scamCategory: ScamCategory;
  redFlags: ScamRedFlag[];
  safetyRecommendations: string[];
  explanation: string;
  analyzedAt: string;
}

export interface ScamRedFlag {
  indicator: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
}

// ── Fraud Knowledge Base ──
export interface FraudPattern {
  id: string;
  category: string;
  title: string;
  description: string;
  warningSignsArr: string[];
  preventionTips: string[];
  realWorldExamples: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// ── Safety Scorecard ──
export interface SafetyCategory {
  name: string;
  score: number;
  maxScore: number;
  recommendations: string[];
}

export interface SafetyScorecard {
  overallScore: number;
  categories: SafetyCategory[];
  assessedAt: string;
  improvementPlan: string[];
}

// ── Organization Dashboard ──
export interface OrgMember {
  name: string;
  role: string;
  modulesCompleted: number;
  quizAverage: number;
  lastActive: string;
}

export interface OrgTrainingDashboard {
  orgName: string;
  totalMembers: number;
  trainingCompletion: number;
  averageAwarenessScore: number;
  quizPerformance: number;
  weakAreas: string[];
  recommendations: string[];
  members: OrgMember[];
}

// ── Incident Response ──
export type IncidentType =
  | 'hacked-email' | 'compromised-social' | 'phishing-victim'
  | 'lost-device' | 'exposed-password' | 'suspicious-login';

export interface IncidentStep {
  stepNumber: number;
  title: string;
  description: string;
  priority: 'immediate' | 'short-term' | 'long-term';
  completed: boolean;
}

export interface IncidentScenario {
  type: IncidentType;
  title: string;
  description: string;
  immediateActions: IncidentStep[];
  recoverySteps: IncidentStep[];
  preventionTips: string[];
}

// ── Career Pathways ──
export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: CareerSkill[];
  certifications: string[];
  projectSuggestions: string[];
  averageSalary?: string;
}

export interface CareerSkill {
  name: string;
  level: 'foundational' | 'intermediate' | 'advanced' | 'expert';
  resources: string[];
}

// ── Curriculum Generator ──
export type SchoolLevel = 'primary' | 'secondary' | 'university';

export interface CurriculumInput {
  ageGroup: string;
  schoolLevel: SchoolLevel;
  topic: string;
  duration: string;
}

export interface CurriculumPlan {
  title: string;
  schoolLevel: SchoolLevel;
  ageGroup: string;
  duration: string;
  objectives: string[];
  lessonPlans: LessonPlan[];
  assessmentGuide: string[];
}

export interface LessonPlan {
  lessonNumber: number;
  title: string;
  duration: string;
  objectives: string[];
  activities: string[];
  materials: string[];
  assessment: string;
}

// ── Campaign Builder ──
export type CampaignOutputType = 'poster' | 'flyer' | 'social-media' | 'presentation' | 'handout' | 'brochure';

export interface CampaignContent {
  topic: string;
  outputType: CampaignOutputType;
  title: string;
  headline: string;
  bodyContent: string;
  callToAction: string;
  keyMessages: string[];
  generatedAt: string;
}

// ── Threat Feed ──
export interface ThreatFeedItem {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  indicators: string[];
  publishedAt: string;
  source: string;
}

// ── SME Toolkit ──
export interface SecurityChecklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  guidance: string;
}
