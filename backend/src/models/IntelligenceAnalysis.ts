import { Schema, model, Document, Types } from 'mongoose';

export interface IIntelligenceAnalysis extends Document {
  scanId: Types.ObjectId;
  infrastructureMap: any;
  dnaProfile: any;
  networkLog: any[];
  memorySnapshot: any;
  endpoints: any[];
  secretFindings: any[];
  behavioralProfile: any;
  aiForensics: any;
  codeClassifications: any[];
  domSurveillance: any;
  obfuscation: any;
  shadowAssets: any[];
  securityIntel: any;
  executionTrace: any;
  timelineEvents: any[];
  reputationScores: any;
  threatRadar: any;
  designSystem: any;
  createdAt: Date;
}

const IntelligenceAnalysisSchema = new Schema<IIntelligenceAnalysis>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: 'Scan',
      required: true,
      index: true,
    },
    infrastructureMap: { type: Schema.Types.Mixed, default: null },
    dnaProfile: { type: Schema.Types.Mixed, default: null },
    networkLog: { type: [Schema.Types.Mixed] as any, default: [] },
    memorySnapshot: { type: Schema.Types.Mixed, default: null },
    endpoints: { type: [Schema.Types.Mixed] as any, default: [] },
    secretFindings: { type: [Schema.Types.Mixed] as any, default: [] },
    behavioralProfile: { type: Schema.Types.Mixed, default: null },
    aiForensics: { type: Schema.Types.Mixed, default: null },
    codeClassifications: { type: [Schema.Types.Mixed] as any, default: [] },
    domSurveillance: { type: Schema.Types.Mixed, default: null },
    obfuscation: { type: Schema.Types.Mixed, default: null },
    shadowAssets: { type: [Schema.Types.Mixed] as any, default: [] },
    securityIntel: { type: Schema.Types.Mixed, default: null },
    executionTrace: { type: Schema.Types.Mixed, default: null },
    timelineEvents: { type: [Schema.Types.Mixed] as any, default: [] },
    reputationScores: { type: Schema.Types.Mixed, default: null },
    threatRadar: { type: Schema.Types.Mixed, default: null },
    designSystem: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const IntelligenceAnalysis = model<IIntelligenceAnalysis>('IntelligenceAnalysis', IntelligenceAnalysisSchema);
export default IntelligenceAnalysis;
