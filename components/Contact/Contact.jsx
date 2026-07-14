"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Contact.module.scss";

// 1. Sign up at formspree.io with johnbertcruz2020@gmail.com
// 2. Create a form, paste its endpoint here.
const FORM_ENDPOINT = "https://formspree.io/f/xzdnzbje";

const LINES = {
  idle: ["Say hi!", "I read everything.", "Don't be shy."],
  sending: ["Sending...", "Off it goes!", "Zooming to Jebby HQ."],
  sent: ["Got it! I'll reply soon.", "Message received!", "Thanks for reaching out!"],
  error: ["Hmm, that didn't send.", "Something broke. Try again?"],
};

function MailJebby({ status }) {
  const color =
    status === "sent"
      ? "#4ade80"
      : status === "error"
      ? "#e14b4a"
      : "#3BB8E5";

  return (
    <svg
      viewBox="0 0 170 120"
      shapeRendering="crispEdges"
      className={styles.jebbySvg}
      aria-hidden="true"
    >
      <g transform="translate(0,30)">
        <path
          d="M25 0 L145 0 L145 15 L170 15 L170 45 L145 45 L145 90 L130 90 L130 75 L40 75 L40 90 L25 90 L25 45 L0 45 L0 15 L25 15 Z"
          fill={color}
        />
        <rect x="40" y="15" width="15" height="15" fill="black" />
        <rect x="115" y="15" width="15" height="15" fill="black" />
      </g>

      <motion.g
        animate={
          status === "sending"
            ? { y: [-4, -26, -4], opacity: [1, 1, 1] }
            : status === "sent"
            ? { y: -40, opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        transition={{
          duration: status === "sending" ? 0.9 : 0.4,
          repeat: status === "sending" ? Infinity : 0,
        }}
      >
        <rect
          x="58"
          y="6"
          width="54"
          height="34"
          fill="#f7f2e9"
          stroke="#111"
          strokeWidth="3"
        />
        <path
          d="M58 6 L85 26 L112 6"
          fill="none"
          stroke="#111"
          strokeWidth="3"
        />
      </motion.g>
    </svg>
  );
}

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const change = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus("sending");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("send failed");

      setStatus("sent");
      setForm({
        name: "",
        email: "",
        message: "",
      });

      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const line = LINES[status][0];
  const busy = status === "sending";

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.grid}>
        <div className={styles.left}>
          <h2 className={styles.heading}>Let&rsquo;s talk.</h2>

          <p className={styles.lead}>
            Got a project, a question, or just want to say hi? Send it over and
            I&rsquo;ll get back to you.
          </p>

          <span className={styles.direct}>
            <span className={styles.dot} />
            johnbertcruz2020@gmail.com
          </span>

          <div className={styles.mascotZone}>
            <MailJebby status={status} />

            <AnimatePresence mode="wait">
              <motion.span
                key={line}
                className={styles.bubble}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {line}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>

              <input
                className={styles.input}
                type="text"
                value={form.name}
                onChange={change("name")}
                placeholder="Who's writing?"
                disabled={busy}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>

              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={change("email")}
                placeholder="you@example.com"
                disabled={busy}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Message</span>

            <textarea
              className={styles.textarea}
              value={form.message}
              onChange={change("message")}
              placeholder="Say what you need to say."
              maxLength={1000}
              disabled={busy}
            />
          </label>

          <span className={styles.counter}>
            {form.message.length} / 1000
          </span>

          <button
            className={`${styles.send} ${styles[status]}`}
            onClick={submit}
            disabled={busy || status === "sent"}
          >
            {status === "idle" && "Send message →"}

            {status === "sending" && (
              <>
                <span className={styles.spinner} />
                {" "}Sending...
              </>
            )}

            {status === "sent" && "✓ Sent!"}

            {status === "error" && "✕ Failed, retry"}
          </button>

          <AnimatePresence>
            {status === "sent" && (
              <motion.span
                className={styles.note}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                Thanks! Your message is on its way to my inbox.
              </motion.span>
            )}

            {status === "error" && (
              <motion.span
                className={`${styles.note} ${styles.noteBad}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                Something went wrong. You can email me directly at
                {" "}johnbertcruz2020@gmail.com
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}