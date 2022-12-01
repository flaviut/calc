import * as React from "react";

type OneToAuto = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "auto";
interface GridProps {
  children?: React.ReactNode;
  container?: boolean;
  item?: boolean;
  col?: OneToAuto;
  xs?: OneToAuto;
  sm?: OneToAuto;
  md?: OneToAuto;
  lg?: OneToAuto;
  xl?: OneToAuto;
  className?: string;
}

function addSizeClass(
  props: GridProps,
  name: keyof GridProps,
  classes: string
) {
  if (props[name]) {
    return `${classes}col-${name}-${props[name]} `;
  }
  return classes;
}

const Grid: React.FunctionComponent<GridProps> = ({
  className = "",
  container,
  item,
  col,
  children,
  ...otherProps
}) => {
  let classes = `${className || ""} `;
  if (container) {
    classes += "columns ";
  }
  if (item) {
    classes += "column ";
  }
  if (col) {
    classes += `col-${col} `;
  }
  classes = (["xs", "sm", "md", "lg", "xl"] as Array<keyof GridProps>).reduce(
    (prevClasses, currentSize) =>
      addSizeClass(otherProps, currentSize, prevClasses),
    classes
  );

  return <div className={classes.trim()}>{children}</div>;
};

export default Grid;
