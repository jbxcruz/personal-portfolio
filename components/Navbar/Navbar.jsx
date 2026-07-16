"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.scss";
import { useNav } from "@/components/SectionNav/SectionNav";
import PrivacyPolicy from "./PrivacyPolicy";
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certs", label: "Certifications" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/jebbylat.143",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jebby_cruz/",
    Icon: FaInstagram,
  },
  {
    label: "GitHub",
    href: "https://github.com/jbxcruz",
    Icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/johnbertcruz2005/",
    Icon: FaLinkedinIn,
  },
];

const STEP_MS = 440;

export default function Navbar() {
  const nav = useNav();

  const [open, setOpen] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const walkingRef = useRef(false);

  const travelTo = useCallback(
    (id) => {
      if (!nav || walkingRef.current) return;

      const target = nav.cells.findIndex((c) => c.id === id);
      if (target < 0) return;

      setOpen(false);

      const from = nav.index;
      if (target === from) return;

      walkingRef.current = true;
      const dir = target > from ? 1 : -1;
      let cur = from;

      const step = () => {
        cur += dir;
        nav.goTo(cur);

        if (cur === target) {
          walkingRef.current = false;
          return;
        }

        setTimeout(step, STEP_MS);
      };

      setTimeout(step, 260);
    },
    [nav]
  );

  return (
    <>
      <nav className={styles.bar}>
        <div className={styles.inner}>
          <span className={styles.logo}>JEBBY</span>

          <button
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            <span className={styles.line} />
            <span className={styles.line} />
            <span className={styles.line} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            data-scroll
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>

            <motion.div
              className={styles.menuGrid}
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
            >
              {LINKS.map((l) => (
                <motion.button
                  key={l.id}
                  className={`${styles.menuItem} ${
                    nav?.activeId === l.id ? styles.menuItemOn : ""
                  }`}
                  onClick={() => travelTo(l.id)}
                  variants={{
                    hidden: { opacity: 0, y: 16, scale: 0.94 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 24,
                  }}
                >
                  {l.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              className={styles.socials}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                  aria-label={label}
                >
                  <Icon size={22} />
                </a>
              ))}
            </motion.div>

            <motion.div
              className={styles.legal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
            >
              <button
                className={styles.legalLink}
                onClick={() => setPrivacy(true)}
              >
                Privacy Policy
              </button>

              <span className={styles.sep} />

              <span>© {new Date().getFullYear()} John Bert Cruz</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {privacy && (
          <PrivacyPolicy onClose={() => setPrivacy(false)} />
        )}
      </AnimatePresence>
    </>
  );
}