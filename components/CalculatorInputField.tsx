import { ReactElement, useMemo } from "react"
import * as mathjs from 'mathjs'
import React from "react"
import { Grid, TextField, makeStyles, Theme, createStyles } from "@material-ui/core"
import { UnitFieldValue, InvalidUnitFieldValue, ValidUnitFieldValue } from "../interfaces"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }),
);

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

    const classes = useStyles();

    const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useMemo(() => (event) => {
        setScope({
            ...scope,
            [name]: parseInput(event.target.value, scope[name].acceptedUnit)
        })
    }, [setScope, scope])

    const helpText = isError ?
        (fieldValue as InvalidUnitFieldValue).error :
        desc

    return (
        <Grid item xs={12}>
            <TextField
                className={classes.textField}
                fullWidth
                error={isError}
                label={label}
                helperText={helpText}
                value={fieldValue.textValue}
                onChange={onChangeHandler} />
        </Grid>)
}
