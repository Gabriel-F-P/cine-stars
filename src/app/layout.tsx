import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineStars — Clube de Fidelidade do Cinema",
  description:
    "Acumule pontos a cada ida ao cinema, troque por colecionáveis exclusivos dos lançamentos do ano e concorra a sorteios mensais de ingressos. Planos a partir de R$10/mês — você está no 1º lote e não pode perder.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-gold selection:text-neutral-950">
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
