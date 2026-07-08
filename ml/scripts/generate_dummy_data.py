from __future__ import annotations

import argparse
import csv
import json
import math
import random
import struct
import zlib
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import NAMESPACE_DNS, uuid5


PROJECT_ROOT = Path(__file__).resolve().parents[2]
WEB_DATA_DIR = PROJECT_ROOT / "apps" / "web" / "src" / "data"
SEED_DIR = PROJECT_ROOT / "database" / "seed"
RAW_ROOT = PROJECT_ROOT / "ml" / "data" / "raw"
PROCESSED_ROOT = PROJECT_ROOT / "ml" / "data" / "processed"
REPORTS_ROOT = PROJECT_ROOT / "ml" / "reports"

CLASSES = ["no_damage", "minor_damage", "major_damage", "destroyed"]
STATUSES = ["submitted", "ai_pending", "ai_completed", "validated", "rejected", "escalated"]
SYNC_STATUSES = ["online", "offline_queued", "synced", "failed"]
DISTRICTS = [
    ("Cugenang", -6.816, 107.079),
    ("Pacet", -6.742, 107.048),
    ("Warungkondang", -6.858, 107.121),
    ("Cianjur Kota", -6.822, 107.139),
    ("Cipanas", -6.714, 107.045),
    ("Gekbrong", -6.876, 107.040),
    ("Sukaluyu", -6.785, 107.175),
    ("Karangtengah", -6.824, 107.168),
]


def stable_uuid(value: str) -> str:
    return str(uuid5(NAMESPACE_DNS, f"radar-demo-{value}"))


def sql_literal(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def report_row(index: int, rng: random.Random) -> dict[str, object]:
    district, base_lat, base_lng = DISTRICTS[index % len(DISTRICTS)]
    severity = CLASSES[index % len(CLASSES)]
    status = STATUSES[(index * 7) % len(STATUSES)]
    sync_status = SYNC_STATUSES[(index * 5) % len(SYNC_STATUSES)]
    lat = base_lat + rng.uniform(-0.035, 0.035)
    lng = base_lng + rng.uniform(-0.035, 0.035)
    confidence_base = {
        "no_damage": 0.72,
        "minor_damage": 0.76,
        "major_damage": 0.82,
        "destroyed": 0.88,
    }[severity]
    confidence = min(0.99, round(confidence_base + rng.random() * 0.11, 2))
    created = datetime(2026, 7, 7, 1, 0, tzinfo=timezone.utc) + timedelta(minutes=index)
    return {
        "id": stable_uuid(f"report-{index:05d}"),
        "localId": f"local-cianjur-{index:05d}",
        "reporterName": f"Warga Demo {index:05d}",
        "address": f"RT {index % 12 + 1:02d}/RW {index % 8 + 1:02d}, {district}, Cianjur",
        "description": f"Laporan dummy {index:05d}: kondisi bangunan terklasifikasi {severity.replace('_', ' ')} untuk uji beban RADAR.",
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "severity": severity,
        "status": status,
        "syncStatus": sync_status,
        "confidence": confidence,
        "createdAt": iso(created),
        "updatedAt": iso(created + timedelta(minutes=2)),
    }


def generate_reports(count: int) -> list[dict[str, object]]:
    rng = random.Random(20260707)
    return [report_row(index + 1, rng) for index in range(count)]


def write_web_json(reports: list[dict[str, object]]) -> None:
    WEB_DATA_DIR.mkdir(parents=True, exist_ok=True)
    target = WEB_DATA_DIR / "demo-reports.generated.json"
    target.write_text(json.dumps(reports, separators=(",", ":")), encoding="utf-8")


def probabilities(severity: str, confidence: float) -> dict[str, float]:
    rest = round((1 - confidence) / 3, 4)
    values = {cls: rest for cls in CLASSES}
    values[severity] = confidence
    return values


def write_sql_seed(reports: list[dict[str, object]]) -> None:
    SEED_DIR.mkdir(parents=True, exist_ok=True)
    event_id = stable_uuid("event-cianjur-demo")
    citizen_id = stable_uuid("profile-citizen")
    operator_id = stable_uuid("profile-operator")
    admin_id = stable_uuid("profile-admin")
    lines = [
        "-- Deterministic RADAR dummy dataset: 10,000 damage reports plus AI predictions.",
        "-- Safe to rerun because UUIDs and local_id values are stable.",
        "INSERT INTO profiles(id, email, full_name, role, organization, phone) VALUES",
        f"('{citizen_id}','citizen@radar.demo','Demo Citizen','citizen','RADAR Demo','080000000001'),",
        f"('{operator_id}','operator@radar.demo','Demo Operator','operator','RADAR Command','080000000002'),",
        f"('{admin_id}','admin@radar.demo','Demo Admin','admin','RADAR Command','080000000003')",
        "ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;",
        "",
        "INSERT INTO disaster_events(id, name, disaster_type, description, status, center, radius_km, started_at, created_by) VALUES",
        f"('{event_id}','Gempa Cianjur Demo Response','earthquake','Synthetic 10k-row seed for load testing and demo mode','active',ST_SetSRID(ST_MakePoint(107.079,-6.816),4326)::geography,45,'2026-07-07T01:00:00Z','{admin_id}')",
        "ON CONFLICT (id) DO NOTHING;",
        "",
        "INSERT INTO damage_reports(id, local_id, event_id, reporter_id, reporter_name, address, description, location, severity, status, sync_status, confidence, created_at, updated_at) VALUES",
    ]

    report_values: list[str] = []
    image_values: list[str] = []
    prediction_values: list[str] = []
    review_values: list[str] = []
    for row in reports:
        report_values.append(
            "("
            + ",".join(
                [
                    sql_literal(str(row["id"])),
                    sql_literal(str(row["localId"])),
                    sql_literal(event_id),
                    sql_literal(citizen_id),
                    sql_literal(str(row["reporterName"])),
                    sql_literal(str(row["address"])),
                    sql_literal(str(row["description"])),
                    f"ST_SetSRID(ST_MakePoint({row['longitude']},{row['latitude']}),4326)::geography",
                    sql_literal(str(row["severity"])),
                    sql_literal(str(row["status"])),
                    sql_literal(str(row["syncStatus"])),
                    str(row["confidence"]),
                    sql_literal(str(row["createdAt"])),
                    sql_literal(str(row["updatedAt"])),
                ]
            )
            + ")"
        )
        image_values.append(
            f"('{stable_uuid('image-' + str(row['localId']))}','{row['id']}','demo/{row['severity']}/{row['localId']}.png','image/png','{row['createdAt']}')"
        )
        probs = json.dumps(probabilities(str(row["severity"]), float(row["confidence"])), separators=(",", ":")).replace("'", "''")
        prediction_values.append(
            f"('{stable_uuid('prediction-' + str(row['localId']))}','{row['id']}','{row['severity']}',{row['confidence']},'{probs}'::jsonb,'synthetic-demo-v1',{24 + int(str(row['localId'])[-2:]) % 23},'{row['updatedAt']}')"
        )
        if str(row["status"]) in {"validated", "rejected", "escalated"}:
            review_values.append(
                f"('{stable_uuid('review-' + str(row['localId']))}','{row['id']}','{operator_id}','confirm_ai','{row['severity']}','{row['severity']}','Synthetic operator review for demo load test','{row['updatedAt']}')"
            )

    lines.append(",\n".join(report_values) + "\nON CONFLICT (local_id) DO NOTHING;")
    lines.append("\nINSERT INTO report_images(id, report_id, storage_path, content_type, created_at) VALUES")
    lines.append(",\n".join(image_values) + "\nON CONFLICT (id) DO NOTHING;")
    lines.append("\nINSERT INTO ai_predictions(id, report_id, severity, confidence, probabilities, model_version, inference_ms, created_at) VALUES")
    lines.append(",\n".join(prediction_values) + "\nON CONFLICT (id) DO NOTHING;")
    if review_values:
        lines.append("\nINSERT INTO validation_reviews(id, report_id, reviewer_id, action, previous_severity, new_severity, note, created_at) VALUES")
        lines.append(",\n".join(review_values) + "\nON CONFLICT (id) DO NOTHING;")

    (SEED_DIR / "0002_dummy_10000_reports.sql").write_text("\n".join(lines) + "\n", encoding="utf-8")


def png_bytes(width: int, height: int, class_index: int, sample_index: int) -> bytes:
    rows = []
    for y in range(height):
        row = bytearray([0])
        for x in range(width):
            wave = int((math.sin((x + sample_index) / 7) + 1) * 32)
            crack = 245 if (x + y + sample_index) % (9 + class_index * 3) == 0 else 0
            if class_index == 0:
                rgb = (40 + wave, 150 + (y % 45), 130 + (x % 30))
            elif class_index == 1:
                rgb = (210 + (x % 35), 185 + wave, 70 + (y % 45))
            elif class_index == 2:
                rgb = (230 + wave // 2, 110 + (x % 50), 35 + crack // 8)
            else:
                rgb = (150 + wave, 36 + crack // 4, 32 + (y % 45))
            row.extend(bytes(min(255, channel) for channel in rgb))
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def clear_generated_images(root: Path) -> None:
    root.mkdir(parents=True, exist_ok=True)
    for file in root.rglob("synthetic_*.png"):
        file.unlink()


def write_synthetic_images(images_per_class: int) -> None:
    clear_generated_images(RAW_ROOT)
    clear_generated_images(PROCESSED_ROOT)
    manifest_path = PROJECT_ROOT / "ml" / "data" / "synthetic_manifest.csv"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["path", "class", "split", "source"])
        for class_index, cls in enumerate(CLASSES):
            for index in range(images_per_class):
                if index < int(images_per_class * 0.7):
                    split = "train"
                elif index < int(images_per_class * 0.85):
                    split = "val"
                else:
                    split = "test"
                name = f"synthetic_{cls}_{index:05d}.png"
                data = png_bytes(64, 64, class_index, index)
                raw_path = RAW_ROOT / cls / name
                processed_path = PROCESSED_ROOT / split / cls / name
                raw_path.parent.mkdir(parents=True, exist_ok=True)
                processed_path.parent.mkdir(parents=True, exist_ok=True)
                raw_path.write_bytes(data)
                processed_path.write_bytes(data)
                writer.writerow([str(processed_path.relative_to(PROJECT_ROOT)), cls, split, "synthetic"])


def write_report(count: int, images_per_class: int) -> None:
    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)
    total_images = images_per_class * len(CLASSES)
    text = [
        "# Dummy Data Generation Report",
        "",
        f"- Damage reports generated: `{count}`",
        f"- Synthetic ML images generated: `{total_images}`",
        f"- Images per class: `{images_per_class}`",
        "- Database seed: `database/seed/0002_dummy_10000_reports.sql`",
        "- Web data: `apps/web/src/data/demo-reports.generated.json`",
        "- ML manifest: `ml/data/synthetic_manifest.csv`",
    ]
    (REPORTS_ROOT / "dummy_data_report.md").write_text("\n".join(text) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate deterministic RADAR dummy data for DB, web, and ML.")
    parser.add_argument("--reports", type=int, default=10_000)
    parser.add_argument("--images-per-class", type=int, default=2_500)
    args = parser.parse_args()
    reports = generate_reports(args.reports)
    write_web_json(reports)
    write_sql_seed(reports)
    write_synthetic_images(args.images_per_class)
    write_report(args.reports, args.images_per_class)
    print(f"generated_reports={args.reports}")
    print(f"generated_synthetic_images={args.images_per_class * len(CLASSES)}")


if __name__ == "__main__":
    main()
