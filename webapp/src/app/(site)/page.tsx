import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { TourSearch } from "./components/tour-search";
import { ToursSection } from "./components/tours-section";
import { DestinationsSection } from "./components/destinations-section";
import { WhySection } from "./components/why-section";
import { StorySection } from "./components/story-section";
import { VideoFeatureSection } from "./components/video-feature-section";
import { AboutSection } from "./components/about-section";
import { ReviewsSection } from "./components/reviews-section";
import { GallerySection } from "./components/gallery-section";
import { FaqSection } from "./components/faq-section";
import { CtaSection } from "./components/cta-section";
import { Footer } from "./components/footer";
import { Fab } from "./components/fab";
import { VideoModalProvider } from "./components/video-modal-context";

export default function HomePage() {
  return (
    <VideoModalProvider>
      <Header />
      <main>
        <Hero />
        <TourSearch />
        <ToursSection />
        <DestinationsSection />
        <WhySection />
        <StorySection />
        <VideoFeatureSection />
        <AboutSection />
        <ReviewsSection />
        <GallerySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <Fab />
    </VideoModalProvider>
  );
}
