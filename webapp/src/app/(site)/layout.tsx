import { PT_Serif, Golos_Text } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-context";
import "./site.css";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className={`${ptSerif.variable} ${golosText.variable} bg-paper text-ink antialiased`}>
        {children}
      </div>
    </I18nProvider>
  );
}
