"use client";

import styles from "./Projects.module.scss";
import ProjectsMascot from "./ProjectsMascot";
import ProjectFolders from "./ProjectFolders";

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <ProjectFolders />
      <ProjectsMascot />
    </section>
  );
}