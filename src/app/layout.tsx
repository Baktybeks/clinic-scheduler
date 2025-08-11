import { Metadata } from "next";
import { Providers } from "@/shared/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Calendar",
  description: "Календарь записи к специалистам",
  viewport: "width=device-width, initial-scale=1",
  keywords: "медицинский календарь, запись к врачу, стоматология",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
