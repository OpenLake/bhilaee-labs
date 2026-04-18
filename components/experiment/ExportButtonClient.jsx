"use client";

import { useLabReportExport } from "@/lib/useLabReportExport";
import { ExportPDFWidget } from "@/components/experiment/ExportPDFButton";

export default function ExportButtonClient({ experiment }) {
  const exportProps = useLabReportExport(experiment);
  return (
    <ExportPDFWidget {...exportProps} experimentTitle={experiment.title} />
  );
}