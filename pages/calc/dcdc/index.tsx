import * as React from 'react'
import { useState, Fragment } from 'react'
import Post from '../../../components/Post'
import { parseInput, CalculatorInputField } from '../../../components/CalculatorInputField'
import { CalculatorResultField } from '../../../components/CalculatorResultField'
import { CalculatorHelpBase } from '../../../components/CalculatorHelpBase'

const DcDcCalculatorPage: React.FunctionComponent = () => {
    const [scope, setScope] = useState({
        freq: parseInput("100 kHz", "Hz"),
        eff: parseInput("0.8", ""),
        max_v_in: parseInput("12 V", "V"),
        min_v_in: parseInput("5 V", "V"),
        typ_v_in: parseInput("8.4 V", "V"),
        v_out: parseInput("24 V", "V"),
        min_i_out: parseInput("1 A", "A"),
        max_v_pkpk: parseInput("0.05 V", "V"),
        max_i_out: parseInput("2 A", "A"),
        est_l_ripple_factor: parseInput("0.3", ""),
        l_value: parseInput("33 uH", "H"),
    })

    const duty_eq = "1 - (min_v_in * eff / v_out)"
    const inductor_ripple_current = `(min_v_in * (${duty_eq})) / (freq * l_value)`
    const est_inductor_ripple_current = "est_l_ripple_factor * max_i_out * (v_out / typ_v_in)"


    const min_inductor_size = `(${duty_eq}) * min_v_in * (1 - (${duty_eq})) / (freq * 2 * min_i_out)`

    return <Post title="Boost Converter Calculator">
        <div className="column col-6 col-sm-12"><div className="columns">
            <div className="column col-12">
                <img src={require("./boost.svg")}
                    alt="Circuit diagram of a boost converter" />
            </div>
            <div className="column col-12">
                <p> This calculator provides assistance when designing a boost
                regulator. The equations here are derived from&nbsp;
                    <a href="https://www.ti.com/lit/an/slva372c/slva372c.pdf">
                        TI's "Basic Calculation of a Boost Converter's Power
                        Stage", SLVA372C</a>.
                </p>
                <CalculatorHelpBase />
            </div>
        </div></div>
        <div className="column col-6 col-sm-12">
            <h2>Maximum Switch Current</h2>
            <CalculatorInputField
                label="Efficiency (η)"
                desc="Estimated efficiency of the converter"
                name="eff"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Min V<sub>in</sub></Fragment>}
                name="min_v_in"
                desc="Minimum input voltage"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>V<sub>out</sub></Fragment>}
                name="v_out"
                desc="Desired output voltage"
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Duty Cycle (D)"
                equation={duty_eq}
                scope={scope} />

            <CalculatorInputField
                label="Frequency (f)"
                name="freq"
                desc="Minimum switching frequency"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label="Inductor Value"
                name="l_value"
                desc="Minimum switching frequency"
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Inductor Ripple Current"
                equation={inductor_ripple_current}
                scope={scope} />

            <h2>Inductor Selection</h2>
            <CalculatorInputField
                label={<Fragment>Typ V<sub>in</sub></Fragment>}
                name="typ_v_in"
                desc="Typical input voltage"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label="Ripple Current Factor"
                name="est_l_ripple_factor"
                desc="An estimated factor for the ripple current. A reasonable guess is between 0.2 and 0.4."
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Max I<sub>out</sub></Fragment>}
                name="max_i_out"
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Estimated Inductor Ripple Current"
                equation={est_inductor_ripple_current}
                scope={scope} />

            <CalculatorResultField
                label="Suggested Inductor Value"
                equation={`(typ_v_in * (v_out - typ_v_in)) / ((${est_inductor_ripple_current}) * freq * v_out)`}
                scope={scope} />


            <h3>Input Parameters</h3>

            <h3>Output Parameters</h3>

            <CalculatorInputField
                label={<Fragment>Max V<sub>in</sub></Fragment>}
                name="max_v_in"
                scope={scope} setScope={setScope} />

            <CalculatorInputField
                label={<Fragment>Min I<sub>out</sub></Fragment>}
                name="min_i_out"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label={<Fragment>Max V<sub>pk-pk</sub></Fragment>}
                name="max_v_pkpk"
                scope={scope} setScope={setScope} />


            <h2>Results</h2>
            <CalculatorResultField
                label="Min Inductor (L) Size"
                equation={min_inductor_size}
                scope={scope} />
            <CalculatorResultField
                label="Peak Inductor (L) Current"
                equation={`(max_v_in * (${duty_eq})) / (freq * (${min_inductor_size}))`}
                scope={scope} />
            <CalculatorResultField
                label={<Fragment>Minimum C<sub>out</sub></Fragment>}
                equation="min_i_out / (max_v_pkpk * freq)"
                scope={scope} />
        </div>
    </Post>
}

export default DcDcCalculatorPage
