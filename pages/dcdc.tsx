import * as React from 'react'
import Layout from '../components/Layout'
import { useState, useMemo, ReactElement } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import { unit } from 'mathjs'

type UnitFieldValue = InvalidUnitFieldValue | ValidUnitFieldValue

function parseInput(input: string, acceptedUnit: string): UnitFieldValue {
  try {
    const parsedUnit = unit(input).toNumber(acceptedUnit)
    return new ValidUnitFieldValue(input, parsedUnit)
  } catch (error) {
    return new InvalidUnitFieldValue(input, error.message)
  }
}

class InvalidUnitFieldValue {
  constructor(public readonly textValue: string, public readonly error: string) { }
}

class ValidUnitFieldValue {
  constructor(public readonly textValue: string, public readonly value: number) { }
}

const CalculatorField: React.FunctionComponent<{
  math: ReactElement,
  defaultValue: string,
  acceptedUnit: string,
}> = ({ math, defaultValue, acceptedUnit }) => {
  const [fieldValue, setFieldValue] = useState<UnitFieldValue>(
    parseInput(defaultValue, acceptedUnit))

  const isError = fieldValue instanceof InvalidUnitFieldValue

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useMemo(() => (event) => {
    setFieldValue(parseInput(event.target.value, acceptedUnit))
  }, [setFieldValue, acceptedUnit])

  return (
    <React.Fragment>
      <Grid item xs={12} sm={4}>{math}</Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          error={isError}
          helperText={isError ? (fieldValue as InvalidUnitFieldValue).error : ""}
          value={fieldValue.textValue}
          onChange={onChangeHandler} />
      </Grid>
    </React.Fragment>)
}

const DcDcCalculatorPage: React.FunctionComponent = () => {

  return <Layout title="DC-DC Converter Calculator">
    <h1>DC-DC Converter Calculator</h1>
    <p>This is the DcDcCalculator page</p>

    <h2>Inputs</h2>
    <Grid container>
      <CalculatorField
        math={<span>Max V<sub>in</sub></span>}
        defaultValue="5 V" acceptedUnit='V' />
      <CalculatorField
        math={<span>Min V<sub>in</sub></span>}
        defaultValue="12 V" acceptedUnit='V' />
      <CalculatorField
        math={<span>Max V<sub>out</sub></span>}
        defaultValue="12 V" acceptedUnit='V' />
      <CalculatorField
        math={<span>Min V<sub>out</sub></span>}
        defaultValue="12 V" acceptedUnit='V' />
      <CalculatorField
        math={<span>Min I<sub>out</sub></span>}
        defaultValue="12 A" acceptedUnit='A' />
      <CalculatorField
        math={<span>Max V<sub>pk-pk</sub></span>}
        defaultValue="12 V" acceptedUnit='V' />
    </Grid>
    <h2>Results</h2>
  </Layout>
}

export default DcDcCalculatorPage
