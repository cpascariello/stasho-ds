import type { Metadata } from "next";
import { SidebarShell } from "@preview/components/sidebar";
import { ThemeSwitcher } from "@preview/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "stasho Design System",
  description: "Token preview for @stasho/ds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,400;75..125,700;75..125,900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen flex-col">
          <header className="flex shrink-0 items-center justify-between
                             bg-background/80 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4
                             border-b border-edge">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold italic">
              stasho DS
            </h1>
            <ThemeSwitcher />
          </header>
          <SidebarShell>
            {children}
          </SidebarShell>
        </div>
      </body>
    </html>
  );
}
