import type { AnalyticsSummary, AuditEntry, ReportImageInput } from "@/lib/demo-data";
import { fallbackPrediction } from "@/lib/ai-fallback";
import { predictSeverity } from "@/lib/ai-service";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { DamageReport, ReportStatus, Severity } from "@radar/shared";

type ReportRow = {
  id: string;
  local_id: string | null;
  reporter_name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  severity_final: Severity | null;
  status: ReportStatus;
  sync_status: DamageReport["syncStatus"];
  confidence: number;
  validation_note: string | null;
  validated_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  ai_severity: Severity | null;
  ai_confidence: number | null;
  ai_probabilities: Record<Severity, number> | null;
  ai_model_version: string | null;
  ai_inference_ms: number | null;
  image_id: string | null;
  image_storage_path: string | null;
  image_content_type: string | null;
};

function mapRow(row: ReportRow): DamageReport {
  return {
    id: row.id,
    localId: row.local_id ?? row.id,
    local_id: row.local_id ?? undefined,
    reporterName: row.reporter_name,
    address: row.address,
    description: row.description,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    severity: row.severity,
    severityFinal: row.severity_final ?? undefined,
    status: row.status,
    syncStatus: row.sync_status,
    confidence: Number(row.confidence ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    validationNote: row.validation_note ?? undefined,
    validatedAt: row.validated_at ?? undefined,
    rejectedAt: row.rejected_at ?? undefined,
    aiPrediction: row.ai_severity
      ? {
          severity: row.ai_severity,
          confidence: Number(row.ai_confidence ?? 0),
          probabilities: row.ai_probabilities ?? ({} as Record<Severity, number>),
          modelVersion: row.ai_model_version ?? "unknown",
          inferenceMs: Number(row.ai_inference_ms ?? 0)
        }
      : undefined,
    image: row.image_id
      ? {
          id: row.image_id,
          reportId: row.id,
          // TODO: once real file uploads are wired to Supabase Storage, resolve
          // this storage_path to a public/signed URL instead of passing it through.
          url: row.image_storage_path ?? "",
          contentType: row.image_content_type ?? "application/octet-stream"
        }
      : undefined
  };
}

export async function filterReports(
  severity?: Severity,
  minConfidence?: number,
  q?: string,
  status?: ReportStatus,
  limit = 250
) {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("damage_reports_view")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (severity) query = query.eq("severity", severity);
  if (status) query = query.eq("status", status);
  if (minConfidence) query = query.gte("confidence", minConfidence);
  if (q) {
    const escaped = q.replace(/[%,]/g, "");
    query = query.or(`address.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as ReportRow[]).map(mapRow);
}

export async function getReportById(id: string) {
  const supabase = getSupabaseServerClient();

  const { data: byLocalId, error: localIdError } = await supabase
    .from("damage_reports_view")
    .select("*")
    .eq("local_id", id)
    .maybeSingle();
  if (localIdError) throw localIdError;
  if (byLocalId) return mapRow(byLocalId as ReportRow);

  const { data: byId, error: idError } = await supabase
    .from("damage_reports_view")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (idError) {
    // Non-UUID id and no local_id match: treat as not found rather than a 500.
    if (idError.code === "22P02") return null;
    throw idError;
  }
  return byId ? mapRow(byId as ReportRow) : null;
}

export async function createReport(payload: Record<string, unknown>, image?: ReportImageInput) {
  const supabase = getSupabaseServerClient();
  const localId = String(payload.localId ?? payload.local_id ?? `local-${Date.now()}`);
  const aiPrediction =
    (image && (await predictSeverity(image.buffer, image.contentType))) ?? fallbackPrediction({ ...payload, localId });

  const { data: rpcData, error: rpcError } = await supabase.rpc("create_damage_report", {
    p_local_id: localId,
    p_reporter_name: String(payload.reporterName ?? "Warga"),
    p_address: String(payload.address ?? "Tidak diketahui"),
    p_description: String(payload.description ?? ""),
    p_latitude: Number(payload.latitude ?? -6.816),
    p_longitude: Number(payload.longitude ?? 107.079),
    p_severity: aiPrediction.severity,
    p_status: "ai_completed" satisfies ReportStatus,
    p_confidence: aiPrediction.confidence
  });
  if (rpcError) throw rpcError;

  const row = (rpcData as ReportRow[])[0];

  const { error: aiError } = await supabase.from("ai_predictions").insert({
    report_id: row.id,
    severity: aiPrediction.severity,
    confidence: aiPrediction.confidence,
    probabilities: aiPrediction.probabilities,
    model_version: aiPrediction.modelVersion,
    inference_ms: aiPrediction.inferenceMs
  });
  if (aiError) throw aiError;

  if (image) {
    const bucket = process.env.STORAGE_BUCKET_REPORTS || "report-images";
    const extension = image.contentType.split("/")[1] ?? "jpg";
    const storagePath = `${row.id}/${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, image.buffer, { contentType: image.contentType, upsert: true });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    const { error: imageError } = await supabase.from("report_images").insert({
      report_id: row.id,
      storage_path: publicUrl.publicUrl,
      content_type: image.contentType
    });
    if (imageError) throw imageError;
  } else if (typeof payload.imagePreview === "string" && payload.imagePreview) {
    const { error: imageError } = await supabase.from("report_images").insert({
      report_id: row.id,
      storage_path: payload.imagePreview,
      content_type: String(payload.imageContentType ?? "application/octet-stream")
    });
    if (imageError) throw imageError;
  }

  const full = await getReportById(row.id);
  return full!;
}

export async function validateReport(
  id: string,
  action: "confirm_ai" | "override" | "reject",
  note?: string,
  severityFinal?: Severity
) {
  const supabase = getSupabaseServerClient();
  const current = await getReportById(id);
  if (!current) return null;

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { validation_note: note ?? null, updated_at: now };
  let reviewAction: "confirm_ai" | "override_severity" | "reject_report";

  if (action === "reject") {
    updates.status = "rejected";
    updates.rejected_at = now;
    reviewAction = "reject_report";
  } else {
    const finalSeverity = action === "override" && severityFinal ? severityFinal : current.aiPrediction?.severity ?? current.severity;
    updates.status = "validated";
    updates.validated_at = now;
    updates.severity_final = finalSeverity;
    updates.severity = finalSeverity;
    reviewAction = action === "override" ? "override_severity" : "confirm_ai";
  }

  const { error: updateError } = await supabase.from("damage_reports").update(updates).eq("id", current.id);
  if (updateError) throw updateError;

  const { error: reviewError } = await supabase.from("validation_reviews").insert({
    report_id: current.id,
    action: reviewAction,
    previous_severity: current.severity,
    new_severity: (updates.severity as Severity | undefined) ?? null,
    note: note ?? null
  });
  if (reviewError) throw reviewError;

  return getReportById(current.id);
}

type SummaryRow = {
  total: number;
  destroyed: number;
  major_damage: number;
  minor_damage: number;
  no_damage: number;
  unknown_count: number;
  avg_confidence: number;
  pending_validation: number;
  validated: number;
  rejected: number;
  escalated: number;
  offline_synced: number;
};

export async function fullSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("report_summary").single();
  if (error) throw error;
  const row = data as SummaryRow;
  return {
    total: Number(row.total),
    destroyed: Number(row.destroyed),
    majorDamage: Number(row.major_damage),
    minorDamage: Number(row.minor_damage),
    noDamage: Number(row.no_damage),
    unknown: Number(row.unknown_count),
    avgConfidence: Number(Number(row.avg_confidence).toFixed(4)),
    pendingValidation: Number(row.pending_validation),
    validated: Number(row.validated),
    rejected: Number(row.rejected),
    escalated: Number(row.escalated),
    offlineSynced: Number(row.offline_synced)
  };
}

// Audit log is a UI/demo affordance derived from event timestamps rather
// than a persisted table; the Supabase-backed path returns an empty log
// until a real audit trail (backed by validation_reviews) is wired up.
export async function generateAuditLog(): Promise<AuditEntry[]> {
  return [];
}
