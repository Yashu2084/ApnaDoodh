import React from "react";
import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutMission from "@/components/about/AboutMission";
import AboutVision from "@/components/about/AboutVision";
import AboutWhy from "@/components/about/AboutWhy";
import AboutImpact from "@/components/about/AboutImpact";
import AboutTeam from "@/components/about/AboutTeam";
import AboutFarmerSpotlight from "@/components/about/AboutFarmerSpotlight";
import AboutValues from "@/components/about/AboutValues";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | ApnaDoodh",
  description: "Learn about ApnaDoodh's story, mission, and direct-trade platform connecting verified local dairy farmers directly with Indian families.",
};

export default function AboutPage() {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Global Fine Noise Texture Overlay */}
      <div className="absolute inset-0 z-40 opacity-[0.015] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* 1. Hero Banner */}
      <AboutHero />

      {/* 2. Timeline Story */}
      <AboutStory />

      {/* 3. Our Mission */}
      <AboutMission />

      {/* 4. Vision Statement */}
      <AboutVision />

      {/* 5. Why ApnaDoodh Exists */}
      <AboutWhy />

      {/* 6. Impact Counters */}
      <AboutImpact />

      {/* 7. Farmer Spotlight */}
      <AboutFarmerSpotlight />

      {/* 8. Core Values Grid */}
      <AboutValues />

      {/* 9. Meet Our Team */}
      <AboutTeam />

      {/* 10. Call-To-Action Join Our Mission */}
      <AboutCTA />
    </div>
  );
}
