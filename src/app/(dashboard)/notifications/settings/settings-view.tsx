"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Mail, MonitorSmartphone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { notificationPreferences } from "@/data/notifications";

export function NotificationSettingsView() {
  const { toast } = useToast();
  const [prefs, setPrefs] = React.useState(notificationPreferences);
  const [digest, setDigest] = React.useState("weekly");
  const [quietHours, setQuietHours] = React.useState(true);
  const [realtime, setRealtime] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const toggle = (id: string, channel: "email" | "inApp") =>
    setPrefs((current) =>
      current.map((pref) => (pref.id === id ? { ...pref, [channel]: !pref[channel] } : pref)),
    );

  const grouped = ["Agent", "Billing", "Team", "System"].map((category) => ({
    category,
    items: prefs.filter((pref) => pref.category === category),
  }));

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({ title: "Preferences saved", description: "Your notification settings were updated.", tone: "success" });
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="Notification preferences"
        description="Choose what reaches your inbox and what stays in the app."
        breadcrumbs={[{ label: "Notifications", href: "/notifications" }, { label: "Preferences" }]}
        actions={
          <>
            <Link
              href="/notifications"
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Cancel
            </Link>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
              Save preferences
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Per-event delivery</CardTitle>
              <CardDescription>Email reaches you anywhere; in-app shows in the bell panel.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Event</TH>
                    <TH className="w-24 text-center">
                      <span className="flex flex-col items-center gap-1">
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        Email
                      </span>
                    </TH>
                    <TH className="w-24 text-center">
                      <span className="flex flex-col items-center gap-1">
                        <MonitorSmartphone className="h-3.5 w-3.5" aria-hidden />
                        In-app
                      </span>
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {grouped.map((group) => (
                    <React.Fragment key={group.category}>
                      <TR className="hover:bg-transparent">
                        <TD colSpan={3} className="bg-secondary/50 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {group.category}
                        </TD>
                      </TR>
                      {group.items.map((pref) => (
                        <TR key={pref.id}>
                          <TD>
                            <p className="text-sm font-medium">{pref.label}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{pref.description}</p>
                          </TD>
                          <TD className="text-center">
                            <span className="inline-flex justify-center">
                              <Switch
                                checked={pref.email}
                                onChange={() => toggle(pref.id, "email")}
                                size="sm"
                                label={`Email for ${pref.label}`}
                              />
                            </span>
                          </TD>
                          <TD className="text-center">
                            <span className="inline-flex justify-center">
                              <Switch
                                checked={pref.inApp}
                                onChange={() => toggle(pref.id, "inApp")}
                                size="sm"
                                label={`In-app for ${pref.label}`}
                              />
                            </span>
                          </TD>
                        </TR>
                      ))}
                    </React.Fragment>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Delivery options</CardTitle>
                <CardDescription>How and when we reach you.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">Email digest</span>
                <Select value={digest} onChange={(event) => setDigest(event.target.value)}>
                  <option value="off">Off — send every email immediately</option>
                  <option value="daily">Daily summary</option>
                  <option value="weekly">Weekly summary</option>
                </Select>
              </label>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Quiet hours</p>
                  <p className="text-xs text-muted-foreground">Hold email between 20:00 and 08:00.</p>
                </div>
                <Switch checked={quietHours} onChange={setQuietHours} label="Quiet hours" />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Real-time toasts</p>
                  <p className="text-xs text-muted-foreground">Pop an alert for critical events.</p>
                </div>
                <Switch checked={realtime} onChange={setRealtime} label="Real-time toasts" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 text-xs leading-relaxed text-muted-foreground">
              Security notifications — password changes, new sign-ins and API key creation — are
              always emailed and cannot be turned off.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
