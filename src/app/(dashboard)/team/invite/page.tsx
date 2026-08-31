import type { Metadata } from "next";
import { InviteView } from "./invite-view";

export const metadata: Metadata = { title: "Invite members" };

export default function InvitePage() {
  return <InviteView />;
}
