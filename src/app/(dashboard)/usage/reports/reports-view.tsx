"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { usageReports } from "@/data/usage";
import { formatDate, formatNumber } from "@/lib/utils";

/** Usage report export queue (FR-USG-05). */
export function ReportsView() {
  const { toast } = useToast();
  const [reports, setReports] = React.useState(usageReports);
  const [open, setOpen] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "Custom usage report",
    dimension: "agent",
    format: "CSV",
    from: "2026-08-01",
    to: "2026-08-31",
  });

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setOpen(false);
      setReports((current) => [
        {
          id: `rpt_${Date.now()}`,
          name: form.name,
          period: `${formatDate(form.from)} – ${formatDate(form.to)}`,
          rows: 1240,
          size: "96 KB",
          generatedAt: new Date().toISOString(),
          format: form.format,
        },
        ...current,
      ]);
      toast({ title: "Report generated", description: `${form.name} is ready to download.`, tone: "success" });
    }, 900);
  };

  return (
    <>
      <PageHeader
        title="Usage reports"
        description="Generate and download usage exports for finance or internal reporting."
        breadcrumbs={[{ label: "Usage", href: "/usage" }, { label: "Reports" }]}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            New report
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Generated reports</CardTitle>
            <CardDescription>Exports stay available for 90 days.</CardDescription>
          </div>
          <Badge tone="outline">{reports.length} reports</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No reports yet"
              description="Generate your first usage export to share numbers with finance."
              className="m-5"
              action={<Button onClick={() => setOpen(true)}>New report</Button>}
            />
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Report</TH>
                    <TH>Period</TH>
                    <TH className="text-right">Rows</TH>
                    <TH>Size</TH>
                    <TH>Generated</TH>
                    <TH className="text-right">Download</TH>
                  </TR>
                </THead>
                <TBody>
                  {reports.map((report) => (
                    <TR key={report.id}>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                            {report.format === "PDF" ? (
                              <FileText className="h-4 w-4" aria-hidden />
                            ) : (
                              <FileSpreadsheet className="h-4 w-4" aria-hidden />
                            )}
                          </span>
                          <span>
                            <span className="block text-sm font-medium">{report.name}</span>
                            <span className="block text-xs text-muted-foreground">{report.format}</span>
                          </span>
                        </span>
                      </TD>
                      <TD className="text-sm text-muted-foreground">{report.period}</TD>
                      <TD className="text-right text-sm">{formatNumber(report.rows)}</TD>
                      <TD className="text-sm text-muted-foreground">{report.size}</TD>
                      <TD className="text-sm text-muted-foreground">{formatDate(report.generatedAt)}</TD>
                      <TD className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({ title: "Download started", description: `${report.name} (${report.format})`, tone: "info" })
                          }
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden />
                          Download
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Generate a usage report"
        description="Pick a period and grouping. Large exports are emailed when ready."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={generate} disabled={generating}>
              {generating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {generating ? "Generating…" : "Generate report"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Report name" htmlFor="report-name">
            <Input
              id="report-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="From" htmlFor="report-from">
              <Input
                id="report-from"
                type="date"
                value={form.from}
                onChange={(event) => setForm((current) => ({ ...current, from: event.target.value }))}
              />
            </Field>
            <Field label="To" htmlFor="report-to">
              <Input
                id="report-to"
                type="date"
                value={form.to}
                onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Group by" htmlFor="report-dimension">
              <Select
                id="report-dimension"
                value={form.dimension}
                onChange={(event) => setForm((current) => ({ ...current, dimension: event.target.value }))}
              >
                <option value="agent">Agent</option>
                <option value="model">Model</option>
                <option value="member">Team member</option>
                <option value="day">Day</option>
              </Select>
            </Field>
            <Field label="Format" htmlFor="report-format">
              <Select
                id="report-format"
                value={form.format}
                onChange={(event) => setForm((current) => ({ ...current, format: event.target.value }))}
              >
                <option value="CSV">CSV</option>
                <option value="PDF">PDF</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>
    </>
  );
}
