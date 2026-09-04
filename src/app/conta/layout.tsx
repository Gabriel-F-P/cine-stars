import Link from "next/link";
import { redirect } from "next/navigation";
import { Store, History, LogOut, Receipt, Ticket } from "lucide-react";
import { auth, signOut } from "@/auth";

const NAV = [
  { href: "/conta", label: "Loja", icon: Store },
  { href: "/conta/resgates", label: "Meus resgates", icon: Ticket },
  { href: "/conta/pontos", label: "Meus pontos", icon: History },
  { href: "/conta/nota-fiscal", label: "Nota fiscal", icon: Receipt },
];

export default async function ContaLayout({
  children,
}: LayoutProps<"/conta">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/entrar?callbackUrl=/conta");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl tracking-wide">
            Cine<span className="text-gold">Stars</span>
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-300 transition hover:border-crimson/50 hover:text-crimson-soft"
            >
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:flex-row">
        <nav className="flex shrink-0 gap-2 overflow-x-auto sm:w-56 sm:flex-col sm:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white/5 hover:text-gold"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
