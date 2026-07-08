"use client";

import { useCallback, useEffect, useState } from "react";
import { getReports, type ReportFilters } from "@/lib/api-client";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { DamageReport } from "@radar/shared";

// Fetches reports once, then subscribes to Supabase Realtime on
// damage_reports (when configured - see getSupabaseBrowserClient) and
// refetches on any insert/update/delete so open dashboards/maps update
// without a manual reload. In demo mode there's no real table to watch, so
// `live` just stays false and this behaves like a one-shot fetch.
export function useLiveReports(filters: ReportFilters = {}) {
  const [reports, setReports] = useState<DamageReport[] | null>(null);
  const [live, setLive] = useState(false);
  const filtersKey = JSON.stringify(filters);

  const refetch = useCallback(() => {
    getReports(filters).then(setReports).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    let cancelled = false;
    getReports(filters).then((data) => {
      if (!cancelled) setReports(data);
    });

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return () => {
        cancelled = true;
      };
    }

    const channel = supabase
      .channel(`damage_reports_changes_${filtersKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "damage_reports" }, () => {
        if (!cancelled) refetch();
      })
      .subscribe((status) => {
        if (!cancelled) setLive(status === "SUBSCRIBED");
      });

    return () => {
      cancelled = true;
      setLive(false);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return { reports, live, refetch };
}
