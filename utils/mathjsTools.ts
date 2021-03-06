/* eslint-disable import/prefer-default-export */
import mathjs from "./mathjs";

export function presentUnit(
  value: string | number | mathjs.MathArray | mathjs.Matrix,
  unit?: string
): string {
  // parse and format again. There's some kind of flag in the unit object
  // that prevents the prefix from being re-interpreted otherwise
  const unitValue =
    unit == null
      ? mathjs.unit(value as string)
      : mathjs.unit(value as number, unit as string);
  return unitValue.format({ precision: 3 });
}
