"use client";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects/Projects";
import SectionNav from "@/components/SectionNav/SectionNav";

export default function Home() {
  return (
    <SectionNav
      chrome={<Navbar />}
      sections={[
        <Hero key="intro" />,
        <About key="about" />,
        <Projects key="projects" />,
      ]}
    />
  );
}