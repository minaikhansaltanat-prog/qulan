import type { Metadata } from "next";
import { PT_Serif, Golos_Text } from "next/font/google";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
});

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quan Travel — Әкімшілік панель",
  description: "Quan Travel сайтының контентін басқару панелі",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${ptSerif.variable} ${golosText.variable} font-body min-h-screen bg-paper text-ink`}>
      {children}
    </div>
  );
}
