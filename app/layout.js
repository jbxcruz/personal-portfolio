import "./globals.scss";
import { display, body, geist } from "@/lib/fonts";

export const metadata = {
  title: "JEBBY",
  description:
    "Portfolio of Jebby, front-end developer, AI trainer, and writer based in Butuan City.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}