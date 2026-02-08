import { type ReactNode } from "react";
import "../styles/page.css";

export default function Page({ children }: { children: ReactNode }) {
  return <div className="page">{children}</div>;
}
