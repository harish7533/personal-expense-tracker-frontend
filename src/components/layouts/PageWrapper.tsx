import { type ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={styles.container}>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100dvh",
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "5rem",
    paddingBottom: "6rem",
  },
};
