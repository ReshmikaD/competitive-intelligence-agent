import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AccountFeed from "@/components/account/AccountFeed";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth";
import { listReportHistory } from "@/lib/store";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/login");
  }

  const { email, firstName } = session;
  const history = await listReportHistory(email);

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-ink">
              Scout AI
            </span>
          </Link>
          <Link
            href="/create"
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            New Analysis
          </Link>
        </div>
      </header>

      <AccountFeed email={email} firstName={firstName} history={history} />
    </main>
  );
}
