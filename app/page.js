"use client";

import SectionNav from "@/components/SectionNav/SectionNav";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";
import Experience from "@/components/Experience/Experience";
import Education from "@/components/Education/Education";
import Certifications from "@/components/Certifications/Certifications";
import Playground from "@/components/Playground/Playground";
import Contact from "@/components/Contact/Contact";



export default function Home() {
  return (
    <SectionNav
      chrome={<Navbar />}
        sections={[
        <Hero key="intro" />,
        <About key="about" />,
        <Projects key="projects" />,
        <Skills key="skills" />,
        <Experience key="experience" />,
        <Education key="education" />,
        <Certifications key="certs" />,
        <Playground key="playground" />,
        <Contact key="contact" />,
      ]}
    />
  );
}