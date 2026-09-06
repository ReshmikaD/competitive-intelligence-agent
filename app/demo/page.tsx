import { redirect } from "next/navigation";

// Kept for backward-compatible links — the sample report is now delivered
// as an actual PDF that opens directly in a new tab, so this just forwards
// there instead of rendering a separate HTML experience.
export default function DemoPage() {
  redirect("/api/sample-report-pdf");
}
