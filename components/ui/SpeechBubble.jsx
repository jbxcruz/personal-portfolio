import styles from "./SpeechBubble.module.scss";

export default function SpeechBubble({ children }) {
  return <div className={styles.bubble}>{children}</div>;
}  