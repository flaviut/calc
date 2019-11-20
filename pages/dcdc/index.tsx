import * as React from 'react'
import { useState, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Layout from '../../components/Layout'
import { parseInput, CalculatorInputField } from '../../components/CalculatorInputField'
import { CalculatorResultField } from '../../components/CalculatorResultField'
import { CalculatorHelpBase } from '../../components/CalculatorHelpBase'



const DcDcCalculatorPage: React.FunctionComponent = () => {
    const [scope, setScope] = useState({
        freq: parseInput("100 kHz", "Hz"),
        eff: parseInput("0.8", ""),
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

    return <Layout title="Boost Converter Calculator">
        <Grid container item sm={6} xs={12}>
            <Grid item xs={12}>
                <img src={require("./boost.svg")}
                    alt="Circuit diagram of a boost converter" />
            </Grid>
            <Grid item xs={12}>
                <p> This calculator provides assistance when designing a boost
                    regulator. The equations here are derived from&nbsp;
                    <a href="https://www.ti.com/lit/an/slva372c/slva372c.pdf">
                        TI's "Basic Calculation of a Boost Converter's Power
                        Stage", SLVA372C</a>.
                </p>
                <CalculatorHelpBase />
            </Grid>
        </Grid>
        <Grid container item sm={6} xs={12}>
            <Grid item xs={12}><h2>Inputs</h2></Grid>
            <CalculatorInputField
                label="Frequency (f)"
                name="freq"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label="Efficiency (η)"
                desc="Estimated efficiency of the converter"
                name="eff"
                scope={scope} setScope={setScope} />

            <Grid item xs={12}><h3>Input Parameters</h3></Grid>
            <CalculatorInputField
                label={<Fragment>Max V<sub>in</sub></Fragment>}
                name="max_v_in"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Min V<sub>in</sub></Fragment>}
                name="min_v_in"
                scope={scope} setScope={setScope} />

            <Grid item xs={12}><h3>Output Parameters</h3></Grid>
            <CalculatorInputField
                label={<Fragment>Max V<sub>out</sub></Fragment>}
                name="max_v_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Min V<sub>out</sub></Fragment>}
                name="min_v_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Min I<sub>out</sub></Fragment>}
                name="min_i_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Max V<sub>pk-pk</sub></Fragment>}
                name="max_v_pkpk"
                scope={scope} setScope={setScope} />


            <Grid item xs={12}>
                <h2>Results</h2>
            </Grid>
            <CalculatorResultField
                label="Max Duty Cycle (PWM)"
                equation={max_duty_eq}
                scope={scope} />
            <CalculatorResultField
                label="Min Duty Cycle (PWM)"
                equation={min_duty_eq}
                scope={scope} />
            <CalculatorResultField
                label="Min Inductor (L) Size"
                equation={min_inductor_size}
                scope={scope} />
            <CalculatorResultField
                label="Peak Inductor (L) Current"
                equation={`(max_v_in * (${max_duty_eq})) / (freq * (${min_inductor_size}))`}
                scope={scope} />
            <CalculatorResultField
                label={<Fragment>Minimum C<sub>out</sub></Fragment>}
                equation="min_i_out / (max_v_pkpk * freq)"
                scope={scope} />
        </Grid>
    </Layout>
}

export default DcDcCalculatorPage
