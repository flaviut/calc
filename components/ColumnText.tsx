import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export const ColumnText: React.FC<Props> = ({ children }) => (
  <div className="two-col-body">{children}</div>
);
export const ColumnSection: React.FC<Props> = ({ children }) => (
  <section style={{ breakInside: "avoid" }}>{children}</section>
);
