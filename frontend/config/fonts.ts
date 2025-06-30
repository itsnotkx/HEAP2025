import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Schibsted_Grotesk } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  weight: ["400", "700"],
});
