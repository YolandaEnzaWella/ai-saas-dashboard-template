import type { Metadata } from "next";
import { NotificationSettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Notification preferences" };

export default function NotificationSettingsPage() {
  return <NotificationSettingsView />;
}
