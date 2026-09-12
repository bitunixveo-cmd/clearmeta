import {
  CTA,
  Features,
  Hero,
  HowItWorks,
  Pricing,
  SeoResources,
  SupportedTools,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SupportedTools />
      <Features />
      <HowItWorks />
      <SeoResources />
      <Pricing />
      <CTA />
    </>
  );
}
