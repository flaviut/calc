import React, { useMemo } from "react";
import uniqueId from "lodash/uniqueId";
import Grid from "./Grid";
import FieldHelpText from "./FieldHelpText";

interface TextFieldProps {
  error?: boolean | React.ReactNode;
  label: React.ReactNode;
  helperText?: React.ReactNode;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  rows: number | null;
}
const TextField: React.FC<TextFieldProps> = ({
  error,
  label,
  rows,
  value,
  onChange,
  helperText,
}) => {
  const fieldId = useMemo(() => uniqueId("tfin"), []);
  const elError =
    error && typeof error !== "boolean" ? (
      <Grid sm={12} col={8} className="col-ml-auto">
        <span className="form-input-hint">Error: {error}</span>
      </Grid>
    ) : null;

  return (
    <form className="form-horizontal">
      <div className={`form-group ${error ? "has-error" : ""}`}>
        <Grid col={4} sm={12}>
          <label className="form-label" htmlFor={fieldId}>
            {label}
          </label>
        </Grid>
        <Grid col={8} sm={12}>
          {rows != null ? (
            <textarea
              id={fieldId}
              value={value}
              className="form-input"
              onChange={onChange}
              rows={rows}
            />
          ) : (
            <input
              id={fieldId}
              value={value}
              className="form-input"
              onChange={onChange}
            />
          )}
        </Grid>
        {elError}
        <FieldHelpText text={helperText} />
      </div>
    </form>
  );
};

export default TextField;
