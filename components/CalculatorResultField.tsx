import React, { ReactNode, useMemo } from "react";
import uniqueId from "lodash/uniqueId";

import mathjs from "../utils/mathjs";
import { UnitFieldValue, GenericScope } from "../interfaces";
import Grid from "./Grid";
import FieldHelpText from "./FieldHelpText";
import { presentUnit } from "../utils/mathjsTools";

export interface ValueScope {
  [name: string]: number | mathjs.Unit | number[] | mathjs.Unit[];
}

const CalculatorResultField: React.FunctionComponent<{
  label: ReactNode;
  desc?: ReactNode;
  equation:
    | string
    | ((
        param: ValueScope
      ) => string | number | mathjs.MathArray | mathjs.Matrix);
  scope: GenericScope;
  equations?: { [name: string]: string };
}> = ({ label, equation, scope, equations, desc }) => {
  const fullScope = { ...scope, ...(equations || {}) };

  function flattenFullScopeValue(value: UnitFieldValue | string) {
    if (typeof value === "string") {
      return value;
    }

    if (!value.isError) {
      return value.value;
    }

    return undefined;
  }

  // map each field in the state to a simple number (or undefined)
  // this is so that we can use it to evaluate the field value
  const valueScope: ValueScope = Object.keys(fullScope).reduce(
    (p, c) => ({
      ...p,
      [c]: flattenFullScopeValue(fullScope[c]),
    }),
    {}
  );

  let fieldValue = "undef";
  let isError = true;
  try {
    if (typeof equation === "function") {
      fieldValue = equation(valueScope).toString();
    } else {
      fieldValue = mathjs.evaluate(equation, valueScope).toString();
    }
    // parse and format again. There's some kind of flag in the unit object
    // that prevents the prefix from being re-interpreted otherwise
    fieldValue = presentUnit(fieldValue);
    isError = false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err, { equation, fieldValue });
    fieldValue = `Undefined: ${err.message}`;
  }

  const fieldId = useMemo(() => uniqueId("tfot"), []);

  return (
    <form className="form-horizontal">
      <div className={`form-group ${isError ? "has-error" : ""}`}>
        <Grid col={4} sm={12}>
          <label className="form-label" htmlFor={fieldId}>
            {label}
          </label>
        </Grid>
        <Grid col={8} sm={12} className="text-right">
          <span id={fieldId}>{fieldValue}</span>
        </Grid>
        <FieldHelpText text={desc} />
      </div>
    </form>
  );
};

export default CalculatorResultField;
