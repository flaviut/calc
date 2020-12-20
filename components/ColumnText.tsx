export const ColumnText: React.FunctionComponent = ({ children }) => (
  <div className="two-col-body">{children}</div>
);
export const ColumnSection: React.FunctionComponent = ({ children }) => (
  <section style={{ breakInside: "avoid" }}>{children}</section>
);
