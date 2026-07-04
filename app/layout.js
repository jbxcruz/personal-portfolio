import "./globals.scss";
import { display, body, geist } from "@/lib/fonts";

export const metadata = {
  title: "JEBBY",
  description:
    "Portfolio of Jebby, front-end developer, AI trainer, and writer based in Butuan City.",
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}