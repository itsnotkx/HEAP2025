"use client";
import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "@/app/providers";
import NavigationBar from "@/components/navbar";
import { fontSans } from "@/config/fonts";

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   icons: { icon: "/favicon.ico" },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <html className={"light"} lang="en" style={{ colorScheme: "light" }}>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
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
