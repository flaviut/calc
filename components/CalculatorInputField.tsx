import { useMemo, ReactNode } from "react"
import React from "react"

import mathjs from '../utils/mathjs'
import { UnitFieldValue, InvalidUnitFieldValue, ValidUnitFieldValue, GenericScope } from "../interfaces"
import { TextField } from "./TextField";

function validateValue(input: any, acceptedUnit: string) {
    if (acceptedUnit !== "") {
        return new InvalidUnitFieldValue(input, acceptedUnit,
            `Got unit-less value when '${acceptedUnit}' was expected`)
    }
}

export function parseInput(input: string, acceptedUnit: string): UnitFieldValue {
    try {
        const parsedUnit = mathjs.evaluate(input)
        if (parsedUnit == null) {
            return new InvalidUnitFieldValue(input, acceptedUnit, "Missing value")
        }

        if (mathjs.typeOf(parsedUnit) === "number") {
            const err = validateValue(input, acceptedUnit)
            if (err) { return err }

            return new ValidUnitFieldValue(input, acceptedUnit, parsedUnit)
        } else if (mathjs.typeOf(parsedUnit) === "Unit") {
            return new ValidUnitFieldValue(input, acceptedUnit, parsedUnit.to(acceptedUnit))
        } else if (mathjs.typeOf(parsedUnit) === "Matrix" && acceptedUnit.endsWith("[]")) {
            return new ValidUnitFieldValue(
                input, acceptedUnit, parsedUnit
                    .map((el: any) => el.to(acceptedUnit.substr(0, acceptedUnit.length - 2))))
        } else {
            return new InvalidUnitFieldValue(input, acceptedUnit,
                `Unrecognized value of kind ${mathjs.typeOf(parsedUnit)} entered into field`)
        }

    } catch (error) {
        return new InvalidUnitFieldValue(input, acceptedUnit, error.message)
    }
}

const defaultEmptyFun = () => {}

export const CalculatorInputField: React.FunctionComponent<{
    label: ReactNode,
    desc?: ReactNode,
    name: string,
    scope: GenericScope,
    setScope: React.Dispatch<React.SetStateAction<any>>
    rows?: number, // makes it into a textarea with the given number of rows
    onChange?: (newScope: GenericScope, oldScope: GenericScope, fieldName: string) => void
}> = ({ label, name, desc, scope, setScope, rows = null, onChange = defaultEmptyFun }) => {
    const fieldValue = scope[name]

    const onChangeHandler: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useMemo(() => (event) => {
        const newScope = {
            ...scope,
            [name]: parseInput(event.target.value, scope[name].acceptedUnit)
        }
        const oldScope = scope
        setScope(newScope)
        onChange(newScope, oldScope, name)
    }, [setScope, scope])

    const error = fieldValue.isError ?
        fieldValue.error :
        false

    return (<TextField
        error={error}
        label={label}
        helperText={desc}
        value={fieldValue.textValue}
        onChange={onChangeHandler}
        rows={rows} />)
}
