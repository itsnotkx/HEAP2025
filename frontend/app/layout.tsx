import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import NavigationBar from "@/components/navbar";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(
        "min-h-screen text-foreground bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NavigationBar />
          <main className="flex justify-center px-6">
            <div className="w-full md:max-w-6xl min-h-screen overflow-y-auto">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
