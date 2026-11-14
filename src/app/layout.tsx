import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { AppFooter } from "@/components/marketing";
export const metadata: Metadata = {
  title: "PachaPDF — Tus PDF, tus imágenes, tu privacidad",
  description:
    "Extrae imágenes y convierte páginas PDF a PNG o JPG en tu navegador. Procesamiento local, sin subir tus documentos.",
  icons: {
    icon: [16, 32, 48, 192, 512].map((size) => ({
      url: `/brand/favicon-transparent-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
    apple: "/brand/favicon-transparent-180.png",
  },
  openGraph: {
    title: "PachaPDF",
    description: "Tus PDF, tus imágenes, tu privacidad.",
    type: "website",
    locale: "es_PE",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        <Header />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
