"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, Check, Loader2, LogOut, Monitor, Save, Shield, Smartphone } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { currentUser } from "@/data/users";
import { formatDate, formatRelativeTime } from "@/lib/utils";

const sessions = [
  { id: "ses_1", device: "MacBook Pro · Chrome", location: "Jakarta, ID", ip: "103.28.14.7", at: "2026-08-31T09:12:00Z", current: true, icon: Monitor },
  { id: "ses_2", device: "iPhone 16 · Safari", location: "Jakarta, ID", ip: "103.28.14.9", at: "2026-08-30T21:40:00Z", current: false, icon: Smartphone },
  { id: "ses_3", device: "Windows · Edge", location: "Singapore, SG", ip: "165.21.44.2", at: "2026-08-27T11:05:00Z", current: false, icon: Monitor },
];

export function ProfileView() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("profile");
  const [saving, setSaving] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [profile, setProfile] = React.useState({
    name: currentUser.name,
    email: currentUser.email,
    title: "Founder & CEO",
    bio: "Building AI tooling for support teams. Previously infrastructure at a fintech.",
    language: "en",
  });
  const [passwords, setPasswords] = React.useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({ title: "Profile updated", description: "Your changes are visible to your team.", tone: "success" });
    }, 700);
  };

  const changePassword = () => {
    const nextErrors: Record<string, string> = {};
    if (passwords.current.length < 8) nextErrors.current = "Enter your current password.";
    if (passwords.next.length < 8) nextErrors.next = "Use at least 8 characters.";
    if (passwords.next !== passwords.confirm) nextErrors.confirm = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setPasswords({ current: "", next: "", confirm: "" });
    toast({ title: "Password changed", description: "Other sessions were signed out.", tone: "success" });
  };

  return (
    <>
      <PageHeader
        title="Your profile"
        description="Personal details, password and active sessions."
        actions={
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
            Save changes
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="text-center">
            <div className="relative mx-auto w-fit">
              <Avatar name={currentUser.name} size="lg" className="h-20 w-20 text-xl" />
              <button
                type="button"
                aria-label="Change avatar"
                onClick={() => toast({ title: "Upload an avatar", description: "Hook this up to your storage provider.", tone: "info" })}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
              >
                <Camera className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <p className="mt-4 text-base font-semibold">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.title}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="primary">{currentUser.role}</Badge>
              <Badge tone="success" dot>
                Active
              </Badge>
            </div>
            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-left text-sm">
              {[
                { label: "Email", value: profile.email },
                { label: "Workspace", value: currentUser.team },
                { label: "Member since", value: formatDate(currentUser.joinedAt) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="truncate text-xs font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/settings"
              className="mt-5 block text-xs font-medium text-primary hover:underline"
            >
              Workspace settings
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs
            className="px-3"
            value={tab}
            onChange={setTab}
            items={[
              { id: "profile", label: "Profile" },
              { id: "password", label: "Password" },
              { id: "sessions", label: "Sessions", count: sessions.length },
            ]}
          />
          <CardContent className="space-y-5">
            {tab === "profile" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="profile-name">
                    <Input
                      id="profile-name"
                      value={profile.name}
                      onChange={(event) => setProfile((c) => ({ ...c, name: event.target.value }))}
                    />
                  </Field>
                  <Field label="Job title" htmlFor="profile-title">
                    <Input
                      id="profile-title"
                      value={profile.title}
                      onChange={(event) => setProfile((c) => ({ ...c, title: event.target.value }))}
                    />
                  </Field>
                </div>
                <Field label="Email" htmlFor="profile-email" hint="Changing this requires re-verification.">
                  <Input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(event) => setProfile((c) => ({ ...c, email: event.target.value }))}
                  />
                </Field>
                <Field label="Bio" htmlFor="profile-bio">
                  <Textarea
                    id="profile-bio"
                    value={profile.bio}
                    onChange={(event) => setProfile((c) => ({ ...c, bio: event.target.value }))}
                    className="min-h-[88px]"
                  />
                </Field>
                <Field label="Interface language" htmlFor="profile-language">
                  <Select
                    id="profile-language"
                    value={profile.language}
                    onChange={(event) => setProfile((c) => ({ ...c, language: event.target.value }))}
                  >
                    <option value="en">English</option>
                  </Select>
                </Field>
              </>
            )}

            {tab === "password" && (
              <>
                <Field label="Current password" htmlFor="current-password" error={errors.current}>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.current}
                    onChange={(event) => setPasswords((c) => ({ ...c, current: event.target.value }))}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="New password" htmlFor="new-password" error={errors.next}>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.next}
                      onChange={(event) => setPasswords((c) => ({ ...c, next: event.target.value }))}
                    />
                  </Field>
                  <Field label="Confirm new password" htmlFor="confirm-password" error={errors.confirm}>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.confirm}
                      onChange={(event) => setPasswords((c) => ({ ...c, confirm: event.target.value }))}
                    />
                  </Field>
                </div>
                <Button onClick={changePassword}>Change password</Button>

                <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-3.5 w-3.5 text-success" aria-hidden />
                      Two-factor authentication
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Authenticator app configured on 14 Feb 2026.
                    </p>
                  </div>
                  <Switch checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" />
                </div>
              </>
            )}

            {tab === "sessions" && (
              <>
                <ul className="space-y-3">
                  {sessions.map((session) => (
                    <li
                      key={session.id}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <session.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          {session.device}
                          {session.current && (
                            <Badge tone="success" className="gap-1">
                              <Check className="h-3 w-3" aria-hidden />
                              This device
                            </Badge>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {session.location} · {session.ip} · {formatRelativeTime(session.at)}
                        </p>
                      </div>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast({ title: "Session revoked", description: `${session.device} was signed out.`, tone: "success" })}
                        >
                          Revoke
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="text-danger"
                  onClick={() => toast({ title: "All other sessions signed out", description: "Only this device stays signed in.", tone: "warning" })}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Sign out everywhere else
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>Leaving removes your access but keeps your work in the workspace.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="text-danger"
            onClick={() => toast({ title: "You are the owner", description: "Transfer ownership before leaving this workspace.", tone: "error" })}
          >
            Leave workspace
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
