import * as React from 'react'
import Layout from '../components/Layout'
import { useState, useMemo, ReactElement } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import * as mathjs from 'mathjs'

type UnitFieldValue = InvalidUnitFieldValue | ValidUnitFieldValue

function parseInput(input: string, acceptedUnit: string): UnitFieldValue {
  try {
    const parsedUnit = mathjs.evaluate(input).to(acceptedUnit)
    return new ValidUnitFieldValue(input, parsedUnit)
  } catch (error) {
    return new InvalidUnitFieldValue(input, error.message)
  }
}

class InvalidUnitFieldValue {
  constructor(public readonly textValue: string, public readonly error: string) { }
  isError(): boolean { return true }
}

class ValidUnitFieldValue {
  constructor(public readonly textValue: string, public readonly value: mathjs.Unit) { }
  isError(): boolean { return false }
}

const CalculatorField: React.FunctionComponent<{
  label: ReactElement,
  name: string,
  acceptedUnit: string,

  scope: { [name: string]: UnitFieldValue },
  setScope: React.Dispatch<React.SetStateAction<any>>
}> = ({ label, name, acceptedUnit, scope, setScope }) => {
  const fieldValue = scope[name]
  const isError = fieldValue.isError()

  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useMemo(() => (event) => {
    setScope({
      ...scope,
      [name]: parseInput(event.target.value, acceptedUnit)
    })
  }, [setScope, scope, acceptedUnit])

  return (
    <React.Fragment>
      <Grid item xs={12} sm={4}>{label}</Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          error={isError}
          helperText={isError ? (fieldValue as InvalidUnitFieldValue).error : ""}
          value={fieldValue.textValue}
          onChange={onChangeHandler} />
      </Grid>
    </React.Fragment>)
}

const ResultField: React.FunctionComponent<{
  label: string,
  equation: string,
  scope: { [name: string]: UnitFieldValue },
}> = ({ label, equation, scope }) => {

  // map each field in the state to a simple number (or undefined)
  // this is so that we can use it to evaluate the field value
  const valueScope: { [name: string]: mathjs.Unit } =
    Object.keys(scope).reduce((p, c) => {
      const fieldValue = scope[c]
      return ({
        ...p,
        [c]: fieldValue.isError() ?
          undefined :
          (fieldValue as ValidUnitFieldValue).value
      })
    }, {})

  let fieldValue = "undef"
  try {
    fieldValue = mathjs.evaluate(equation, valueScope).toString()
    // parse and format again. There's some kind of flag in the unit object
    // that prevents the prefix from being re-interpreted otherwise
    fieldValue = mathjs.unit(fieldValue).format({ precision: 3 })
  } catch (err) {
    fieldValue = `Undefined: ${err.message}`
  }

  return (<React.Fragment>
    <Grid item xs={12} sm={4}>{label}</Grid>
    <Grid item xs={12} sm={8}>{fieldValue}</Grid>
  </React.Fragment>)
}

const DcDcCalculatorPage: React.FunctionComponent = () => {
  const [scope, setScope] = useState({
    freq: parseInput("100 kHz", "Hz"),
    max_v_in: parseInput("12 V", "V"),
    min_v_in: parseInput("5 V", "V"),
    max_v_out: parseInput("24 V", "V"),
    min_v_out: parseInput("20 V", "V"),
    min_i_out: parseInput("1 A", "A"),
    max_v_pkpk: parseInput("0.05 V", "V"),
  })

  const min_duty_eq = "1 - (min_v_in / max_v_out)"
  const max_duty_eq = "1 - (max_v_in / min_v_out)"
  const min_inductor_size = `(${max_duty_eq}) * min_v_in * (1 - (${max_duty_eq})) / (freq * 2 * min_i_out)`

  return <Layout title="DC-DC Converter Calculator">
    <h1>DC-DC Converter Calculator</h1>
    <p>This is the DcDcCalculator page</p>

    <h2>Inputs</h2>
    <Grid container>
      <CalculatorField
        label={<span>Frequency</span>}
        name="freq"
        acceptedUnit='Hz' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Max V<sub>in</sub></span>}
        name="max_v_in"
        acceptedUnit='V' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Min V<sub>in</sub></span>}
        name="min_v_in"
        acceptedUnit='V' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Max V<sub>out</sub></span>}
        name="max_v_out"
        acceptedUnit='V' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Min V<sub>out</sub></span>}
        name="min_v_out"
        acceptedUnit='V' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Min I<sub>out</sub></span>}
        name="min_i_out"
        acceptedUnit='A' scope={scope} setScope={setScope} />
      <CalculatorField
        label={<span>Max V<sub>pk-pk</sub></span>}
        name="max_v_pkpk"
        acceptedUnit='V' scope={scope} setScope={setScope} />
    </Grid>
    <h2>Results</h2>
    <Grid container>
      <ResultField
        label="Max Duty Cycle"
        equation={max_duty_eq}
        scope={scope} />
      <ResultField
        label="Min Duty Cycle"
        equation={min_duty_eq}
        scope={scope} />
      <ResultField
        label="Min Inductor Size"
        equation={min_inductor_size}
        scope={scope} />
      <ResultField
        label="Peak Inductor Current"
        equation={`(max_v_in * (${max_duty_eq})) / (freq * (${min_inductor_size}))`}
        scope={scope} />
    </Grid>
  </Layout>
}

export default DcDcCalculatorPage
