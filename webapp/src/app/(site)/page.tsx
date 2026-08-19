import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { TourSearch } from "./components/tour-search";
import { ToursSection } from "./components/tours-section";
import { VideoModalProvider } from "./components/video-modal-context";

export default function HomePage() {
  return (
    <VideoModalProvider>
      <Header />
      <main>
        <Hero />
        <TourSearch />
        <ToursSection />
      </main>
    </VideoModalProvider>
  );
}
