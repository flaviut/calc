import { ReactElement, useMemo } from "react"
import * as mathjs from 'mathjs'
import React from "react"
import { Grid, TextField } from "@material-ui/core"
import { UnitFieldValue, InvalidUnitFieldValue, ValidUnitFieldValue } from "../interfaces"


export function parseInput(input: string, acceptedUnit: string): UnitFieldValue {
    try {
        const parsedUnit = mathjs.evaluate(input)
        if (parsedUnit == null) {
            return new InvalidUnitFieldValue(input, acceptedUnit, "Missing value")
        }

        if (typeof parsedUnit === "number") {
            if (acceptedUnit !== "") {
                return new InvalidUnitFieldValue(input, acceptedUnit,
                    `Got unit-less value when '${acceptedUnit}' was expected`)
            }
            return new ValidUnitFieldValue(input, acceptedUnit, parsedUnit)
        }

        return new ValidUnitFieldValue(input, acceptedUnit, parsedUnit.to(acceptedUnit))
    } catch (error) {
        return new InvalidUnitFieldValue(input, acceptedUnit, error.message)
    }
}

export const CalculatorInputField: React.FunctionComponent<{
    label: ReactElement | string | Array<ReactElement | string>,
    name: string,
    scope: { [name: string]: UnitFieldValue },
    setScope: React.Dispatch<React.SetStateAction<any>>
}> = ({ label, name, scope, setScope }) => {
    const fieldValue = scope[name]
    const isError = fieldValue.isError()

    const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useMemo(() => (event) => {
        setScope({
            ...scope,
            [name]: parseInput(event.target.value, scope[name].acceptedUnit)
        })
    }, [setScope, scope])

    return (
        <React.Fragment>
            <Grid item xs={6} sm={4}>{label}</Grid>
            <Grid item xs={6} sm={8}>
                <TextField
                    error={isError}
                    helperText={isError ? (fieldValue as InvalidUnitFieldValue).error : ""}
                    value={fieldValue.textValue}
                    onChange={onChangeHandler} />
            </Grid>
        </React.Fragment>)
}
