import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quan Travel — Қытайға саяхат",
  description:
    "Quan Travel — Қазақстаннан Қытайдың кез келген қаласына жеке гид-аудармашымен сенімді саяхат. Чжанцзяцзе, Шанхай, Гонконг, Гуанчжоу, Чунцин, Сиань, Чэнду.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="kk" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
