import styles from "./ArrowButton.module.scss";

export default function ArrowButton({ children, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </button>
  );
}