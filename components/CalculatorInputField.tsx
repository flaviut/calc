import { useMemo, ReactNode } from "react"
import * as mathjs from 'mathjs'
import React from "react"
import { UnitFieldValue, InvalidUnitFieldValue, ValidUnitFieldValue } from "../interfaces"
import { TextField } from "./TextField";

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
    label: ReactNode,
    desc?: ReactNode,
    name: string,
    scope: { [name: string]: UnitFieldValue },
    setScope: React.Dispatch<React.SetStateAction<any>>
}> = ({ label, name, desc, scope, setScope }) => {
    const fieldValue = scope[name]
    const isError = fieldValue.isError()

    const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useMemo(() => (event) => {
        setScope({
            ...scope,
            [name]: parseInput(event.target.value, scope[name].acceptedUnit)
        })
    }, [setScope, scope])

    const error = isError ?
        (fieldValue as InvalidUnitFieldValue).error :
        false

    return (<TextField
        error={error}
        label={label}
        helperText={desc}
        value={fieldValue.textValue}
        onChange={onChangeHandler} />)
}
