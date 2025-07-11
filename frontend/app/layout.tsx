import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import NavigationBar from "@/components/navbar";
import { Providers } from "../app/providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ThemeProvider } from "@mui/material/styles";


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
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >

        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NavigationBar />
          <main className="flex justify-center px-6">
            <div className="w-full md:max-w-6xl h-[calc(100vh-120px)] overflow-auto">
              {children}
            </div>
          </main>
        </Providers>

      </body>
    </html>
  );
}