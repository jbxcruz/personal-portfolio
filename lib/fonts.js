import localFont from "next/font/local";
import { Inter, Geist } from "next/font/google";

export const display = localFont({
  src: "./ClimateCrisis1990-Regular.woff2",
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});