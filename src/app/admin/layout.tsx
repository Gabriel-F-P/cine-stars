import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Clapperboard,
  Gift,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Ticket,
  Users,
  UsersRound,
} from "lucide-react";
import { auth, signOut } from "@/auth";

const NAV = [
  { href: "/admin", label: "Métricas", icon: LayoutDashboard },
  { href: "/admin/interessados", label: "Interessados", icon: Users },
  { href: "/admin/loja", label: "Itens da loja", icon: Gift },
  { href: "/admin/lancamentos", label: "Lançamentos", icon: Clapperboard },
  { href: "/admin/premios", label: "Prêmios de estreia", icon: Ticket },
  { href: "/admin/notas", label: "Notas fiscais", icon: Receipt },
  { href: "/admin/resgates", label: "Resgates", icon: Ticket },
  { href: "/admin/equipe", label: "Equipe", icon: UsersRound },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/entrar?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/conta");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl tracking-wide">
            Cine<span className="text-gold">Stars</span>{" "}
            <span className="text-sm font-sans text-neutral-500">admin</span>
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
