import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import NavigationBar from "@/components/navbar";

import { Providers } from "../app/providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >



        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
        <NavigationBar/>
          <div className="flex px-6">
            <div className="w-full overflow-x-auto">
              <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
                <div className="w-full flex justify-center mx-auto   overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                  <div className="w-full md:max-w-6xl">{children}</div>
                </div>
              </div>
            </div>

          </div>
        </Providers>


      </body>
    </html>
  );
}
