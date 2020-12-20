import React, { ReactNode, useMemo } from "react"
import uniqueId from "lodash/uniqueId"

import mathjs from '../utils/mathjs'
import { ValidUnitFieldValue, UnitFieldValue } from "../interfaces"
import { Grid } from './Grid'
import { FieldHelpText } from './FieldHelpText'

export const CalculatorResultField: React.FunctionComponent<{
    label: ReactNode,
    desc?: ReactNode,
    equation: string,
    scope: { [name: string]: UnitFieldValue },
    equations?: { [name: string]: string },
}> = ({ label, equation, scope, equations, desc }) => {

    const fullScope = { ...scope, ...(equations || {}) }

    function flattenFullScopeValue(value: UnitFieldValue | string) {
        if (typeof value === 'string') {
            return value;
        }

        if (!value.isError()) {
            return (value as ValidUnitFieldValue).value
        }

        return undefined
    }

    // map each field in the state to a simple number (or undefined)
    // this is so that we can use it to evaluate the field value
    const valueScope: { [name: string]: mathjs.Unit } =
        Object.keys(fullScope).reduce((p, c) => ({
            ...p,
            [c]: flattenFullScopeValue(fullScope[c])
        }), {})

    let fieldValue = "undef"
    let isError = true
    try {
        fieldValue = mathjs.evaluate(equation, valueScope)
        fieldValue = fieldValue.toString()
        // parse and format again. There's some kind of flag in the unit object
        // that prevents the prefix from being re-interpreted otherwise
        fieldValue = mathjs.unit(fieldValue).format({ precision: 3 })
        isError = false
    } catch (err) {
        fieldValue = `Undefined: ${err.message}`
    }

    const fieldId = useMemo(() => uniqueId('tfot'), [])

    return (<form className="form-horizontal">
        <div className={"form-group " + (isError ? "has-error" : "")}>
            <Grid col={4} sm={12}>
                <label className="form-label" htmlFor={fieldId}>{label}</label>
            </Grid>
            <Grid col={8} sm={12} className="text-right">
                <span id={fieldId}>{fieldValue}</span>
            </Grid>
            <FieldHelpText text={desc} />
        </div>
    </form>)
}