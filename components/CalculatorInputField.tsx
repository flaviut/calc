import { ReactElement, useMemo } from "react"
import * as mathjs from 'mathjs'
import React from "react"
import { UnitFieldValue, InvalidUnitFieldValue, ValidUnitFieldValue } from "../interfaces"
import { useRandomSlug } from "../utils";

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
    desc?: ReactElement | string | Array<ReactElement | string>,
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

    const inputId = useRandomSlug()

    const helpText = isError ?
        (fieldValue as InvalidUnitFieldValue).error :
        desc

    return (
        <div className={`form-group
                         my-1
                         ${isError ? "has-error" : ""}`}>
            <label className="form-label" htmlFor={inputId}>{label}</label>
            <input className="form-input" type="text"
                id={inputId}
                value={fieldValue.textValue}
                onChange={onChangeHandler}></input>
            <p className="form-input-hint">{helpText}</p>
        </div>)
}
