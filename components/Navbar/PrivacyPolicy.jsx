"use client";

import { motion } from "framer-motion";
import styles from "./PrivacyPolicy.module.scss";

export default function PrivacyPolicy({ onClose }) {
  return (
    <motion.div
      className={styles.backdrop}
      data-nav-lock
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className={styles.sheet}
        initial={{ y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className={styles.bar}>
          <span className={styles.barTitle}>jebby.exe — Privacy Policy</span>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.body} data-scroll>
          <h2 className={styles.title}>Privacy Policy</h2>
          <span className={styles.updated}>Last updated: July 14, 2026</span>

          <h3 className={styles.h3}>Introduction</h3>
          <p className={styles.p}>
            Thanks for visiting my portfolio. Your privacy matters to me. This policy explains what
            information may be collected through this website and how it is used.
          </p>

          <h3 className={styles.h3}>Information I Collect</h3>
          <p className={styles.p}>When you submit the contact form, I may collect:</p>
          <ul className={styles.ul}>
            <li>Your name</li>
            <li>Your email address</li>
            <li>The message you choose to send</li>
          </ul>
          <p className={styles.p}>I only collect information you voluntarily provide.</p>

          <h3 className={styles.h3}>How Your Information Is Used</h3>
          <p className={styles.p}>What you submit is used only to:</p>
          <ul className={styles.ul}>
            <li>Respond to your inquiries</li>
            <li>Discuss potential collaborations or opportunities</li>
            <li>Communicate with you about your message</li>
          </ul>
          <p className={styles.p}>
            Your information is never sold, rented, or shared with third parties for marketing purposes.
          </p>

          <h3 className={styles.h3}>Contact Form</h3>
          <p className={styles.p}>
            This website uses Formspree to securely process contact form submissions. When you send a
            message, your information is transmitted through Formspree and forwarded to my inbox so I can
            reply.
          </p>

          <h3 className={styles.h3}>Data Retention</h3>
          <p className={styles.p}>
            I keep contact form submissions only for as long as needed to respond to your inquiry or
            continue our conversation.
          </p>

          <h3 className={styles.h3}>Third-Party Links</h3>
          <p className={styles.p}>
            This website may link to third-party sites such as GitHub or LinkedIn. Those sites have their
            own privacy policies, and I am not responsible for their content or practices.
          </p>

          <h3 className={styles.h3}>Changes to This Policy</h3>
          <p className={styles.p}>
            This policy may be updated from time to time. Any changes will be posted here with a new
            revision date.
          </p>

          <h3 className={styles.h3}>Contact</h3>
          <p className={styles.p}>
            Questions about this policy or how your information is handled? Reach me through the contact
            form on this website.
          </p>

          <button className={styles.gotIt} onClick={onClose}>Got it</button>
        </div>
      </motion.div>
    </motion.div>
  );
}