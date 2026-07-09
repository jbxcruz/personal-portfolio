"use client";

import styles from "./Projects.module.scss";
import ProjectsMascot from "./ProjectsMascot";

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <span className={styles.placeholder}>Projects</span>
      <ProjectsMascot />
    </section>
  );
}