import { SEVERITY_COLORS, SEVERITY_LABEL_ID, type Role, type Severity } from "@radar/shared";

export function severityColor(severity: Severity) {
  return SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.unknown;
}

export function severityLabel(severity: Severity) {
  return SEVERITY_LABEL_ID[severity] ?? SEVERITY_LABEL_ID.unknown;
}

export function requireRole(current: Role, allowed: Role[]) {
  return allowed.includes(current);
}
