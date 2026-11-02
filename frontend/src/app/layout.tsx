import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "task-app",
  description: "register your tasks!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={"h-full antialiased"}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/letieu/terminal.css@v0.0.4/index.css"
        />
        <link
          id="theme-switcher"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/letieu/terminal.css@v0.0.4/themes/rose-pine.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
