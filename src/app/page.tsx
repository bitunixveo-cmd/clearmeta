import {
  CTA,
  Features,
  Hero,
  HowItWorks,
  Pricing,
  SupportedTools,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SupportedTools />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </>
  );
}
