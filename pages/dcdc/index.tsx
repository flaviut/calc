import * as React from 'react'
import { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Layout from '../../components/Layout'
import { parseInput, CalculatorInputField } from '../../components/CalculatorInputField'
import { CalculatorResultField } from '../../components/CalculatorResultField'



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

    return <Layout title="Boost Converter Calculator">
        <Grid container item sm={6} xs={12}>
            <Grid item xs={12}>
                <img src={require("./boost.svg")} />
            </Grid>
            <Grid item xs={12}>
                <p>This calculator provides assistance when designing a boost regulator.</p>
                <p>Some reasonable defaults have been entered, but you should replace these values with your own design parameters.</p>
                <p>You may use expressions or alternative units. For example "2000 / (1 day)" will be interpreted to be about "23 mHz". </p>
            </Grid>
        </Grid>
        <Grid container item sm={6} xs={12}>
            <Grid item xs={12}>
                <h2>Inputs</h2>
            </Grid>
            <CalculatorInputField
                label="Frequency"
                name="freq"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Max V", <sub>in</sub>]}
                name="max_v_in"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Min V", <sub>in</sub>]}
                name="min_v_in"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Max V", <sub>out</sub>]}
                name="max_v_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Min V", <sub>out</sub>]}
                name="min_v_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Min I", <sub>out</sub>]}
                name="min_i_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={["Max V", <sub>pk-pk</sub>]}
                name="max_v_pkpk"
                scope={scope} setScope={setScope} />


            <Grid item xs={12}>
                <h2>Results</h2>
            </Grid>
            <CalculatorResultField
                label="Max Duty Cycle"
                equation={max_duty_eq}
                scope={scope} />
            <CalculatorResultField
                label="Min Duty Cycle"
                equation={min_duty_eq}
                scope={scope} />
            <CalculatorResultField
                label="Min Inductor Size"
                equation={min_inductor_size}
                scope={scope} />
            <CalculatorResultField
                label="Peak Inductor Current"
                equation={`(max_v_in * (${max_duty_eq})) / (freq * (${min_inductor_size}))`}
                scope={scope} />
            <CalculatorResultField
                label="Minimum Capacitor"
                equation="min_i_out / (max_v_pkpk * freq)"
                scope={scope} />
        </Grid>
    </Layout>
}

export default DcDcCalculatorPage
