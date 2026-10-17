import type { Metadata } from "next";
import "./yakashin.css";

export const metadata: Metadata = {
  title: "YAKASHIN — Road to the World Cup",
  description: "Um sonho. Uma bola. O mundo inteiro. Uma light novel de futebol para ler, ouvir e sentir.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
