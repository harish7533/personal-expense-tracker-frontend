import { type ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main style={styles.wrapper}>
      {children}
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    paddingTop: "72px", // 👈 height of Navbar
    minHeight: "100vh",
    background: "var(--bg)",
  },
};
