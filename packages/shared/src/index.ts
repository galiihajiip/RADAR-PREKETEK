export const SEVERITY = ["no_damage", "minor_damage", "major_damage", "destroyed", "unknown"] as const;
export type Severity = (typeof SEVERITY)[number];

export const SEVERITY_COLORS: Record<Severity, string> = {
  no_damage: "#2A9D8F",
  minor_damage: "#F4D35E",
  major_damage: "#F77F00",
  destroyed: "#D62828",
  unknown: "#64748B"
};

export const SEVERITY_LABEL_ID: Record<Severity, string> = {
  no_damage: "Tidak rusak",
  minor_damage: "Rusak ringan",
  major_damage: "Rusak berat",
  destroyed: "Hancur",
  unknown: "Belum pasti"
};

export const ROLES = ["citizen", "operator", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const REPORT_STATUS = [
  "draft",
  "queued",
  "submitted",
  "ai_pending",
  "ai_completed",
  "validated",
  "rejected",
  "escalated"
] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];

export const SYNC_STATUS = ["online", "offline_queued", "synced", "failed"] as const;
export type SyncStatus = (typeof SYNC_STATUS)[number];

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export interface ReportImage {
  id: string;
  reportId: string;
  url: string;
  width?: number;
  height?: number;
  contentType: string;
}

export interface AiPrediction {
  severity: Severity;
  confidence: number;
  probabilities: Record<Severity, number>;
  modelVersion: string;
  inferenceMs: number;
}

export interface DamageReport {
  id: string;
  localId: string;
  local_id?: string;
  reporterName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  severityFinal?: Severity;
  status: ReportStatus;
  syncStatus: SyncStatus;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  validationNote?: string;
  validatedAt?: string;
  rejectedAt?: string;
  aiPrediction?: AiPrediction;
  image?: ReportImage;
}

export const demoReports: DamageReport[] = [
  {
    id: "rpt-001",
    localId: "local-cianjur-001",
    reporterName: "Warga Cugenang",
    address: "Cugenang, Cianjur",
    description: "Dinding runtuh dan akses jalan sempit.",
    latitude: -6.816,
    longitude: 107.079,
    severity: "destroyed",
    status: "ai_completed",
    syncStatus: "synced",
    confidence: 0.93,
    createdAt: "2026-07-07T02:30:00.000Z",
    updatedAt: "2026-07-07T02:31:00.000Z"
  },
  {
    id: "rpt-002",
    localId: "local-cianjur-002",
    reporterName: "Relawan Pacet",
    address: "Pacet, Cianjur",
    description: "Retakan besar pada kolom depan.",
    latitude: -6.742,
    longitude: 107.048,
    severity: "major_damage",
    status: "validated",
    syncStatus: "synced",
    confidence: 0.88,
    createdAt: "2026-07-07T02:40:00.000Z",
    updatedAt: "2026-07-07T02:52:00.000Z"
  },
  {
    id: "rpt-003",
    localId: "local-cianjur-003",
    reporterName: "Warga Warungkondang",
    address: "Warungkondang, Cianjur",
    description: "Genteng lepas, struktur utama masih aman.",
    latitude: -6.858,
    longitude: 107.121,
    severity: "minor_damage",
    status: "ai_completed",
    syncStatus: "synced",
    confidence: 0.81,
    createdAt: "2026-07-07T03:00:00.000Z",
    updatedAt: "2026-07-07T03:01:00.000Z"
  }
];
