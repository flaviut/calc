import * as mathjs from 'mathjs'
import React from "react"
import { Grid } from "@material-ui/core"

import { ValidUnitFieldValue, UnitFieldValue } from "../interfaces"

export const CalculatorResultField: React.FunctionComponent<{
    label: string,
    equation: string,
    scope: { [name: string]: UnitFieldValue },
    equations?: { [name: string]: string },
}> = ({ label, equation, scope, equations }) => {

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
    try {
        fieldValue = mathjs.evaluate(equation, valueScope)
        fieldValue = fieldValue.toString()
        // parse and format again. There's some kind of flag in the unit object
        // that prevents the prefix from being re-interpreted otherwise
        fieldValue = mathjs.unit(fieldValue).format({ precision: 3 })
    } catch (err) {
        fieldValue = `Undefined: ${err.message}`
    }

    return (<React.Fragment>
        <Grid item xs={8}>{label}</Grid>
        <Grid item xs={4}>{fieldValue}</Grid>
    </React.Fragment>)
}