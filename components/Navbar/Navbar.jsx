"use client";

import { motion } from "framer-motion";
import styles from "./Navbar.module.scss";
import { useNav } from "@/components/SectionNav/SectionNav";

const navVariants = {
  hidden: { y: -100, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20} },
};

export default function Navbar() {
  const nav = useNav();
  const shown = nav ? nav.index > 0 : false; // hidden on Intro, shown afterwards

  return (
    <motion.nav
      className={styles.nav}
      variants={navVariants}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
    >
      <div className={styles.inner}>
        <span className={styles.logo}>JEBBY</span>
        <div className={styles.links}>
          <span>About</span>
          <span>Projects</span>
          <span>Contact</span>
        </div>
      </div>
    </motion.nav>
  );
}