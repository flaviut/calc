import React, { useMemo, ReactNode } from "react"
import uniqueId from "lodash/uniqueId"
import { Grid } from "./Grid"
import { FieldHelpText } from "./FieldHelpText"

interface TextFieldProps {
    error?: boolean | ReactNode
    label: ReactNode
    helperText?: ReactNode
    value: string
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    rows: number | null
}
export const TextField: React.FunctionComponent<TextFieldProps> = (props) => {

    const fieldId = useMemo(() => uniqueId('tfin'), [])
    const elError = props.error ?
        typeof props.error !== 'boolean' ?
          <Grid sm={12} col={8} className="col-ml-auto"><span className="form-input-hint">Error: {props.error}</span></Grid> :
            null :
        null

    return (
      <form className="form-horizontal">
        <div className={`form-group ${  props.error ? "has-error" : ""}`}>
          <Grid col={4} sm={12}>
            <label className="form-label" htmlFor={fieldId}>{props.label}</label>
          </Grid>
          <Grid col={8} sm={12}>
            {props.rows != null ? (
              <textarea
                id={fieldId}
                value={props.value}
                className="form-input"
                onChange={props.onChange}
                rows={props.rows}
              />
                  ) : (
                    <input
                      id={fieldId}
                      value={props.value}
                      className="form-input"
                      onChange={props.onChange}
                    />
                  )}
          </Grid>
          {elError}
          <FieldHelpText text={props.helperText} />
        </div>
      </form>
)
}