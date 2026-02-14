import { type ReactNode } from "react";

export default function PageWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--bg)]">
      <main className="flex-1 px-4 py-6 pt-20 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  );
}

// import { type ReactNode } from "react";

// export default function PageWrapper({ children }: { children: ReactNode }) {
//   return (
//     <main style={styles.wrapper}>
//       {children}
//     </main>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   wrapper: {
//     paddingTop: "72px", // 👈 height of Navbar
//     minHeight: "100vh",
//     background: "var(--bg)",
//   },
// };
