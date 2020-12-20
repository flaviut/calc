import * as React from 'react'
import { useState, Fragment } from 'react'
import Image from 'next/image'

import Layout from '../../../components/Layout'
import { parseInput, CalculatorInputField } from '../../../components/CalculatorInputField'
import { CalculatorResultField } from '../../../components/CalculatorResultField'
import { CalculatorHelpBase } from '../../../components/CalculatorHelpBase'
import { CalcRow } from '../../../components/CalcRow'

const DcDcCalculatorPage: React.FunctionComponent = () => {
    const [scope, setScope] = useState({
        min_v_in: parseInput("5 V", "V"),
        v_out: parseInput("12 V", "V"),
        eff: parseInput("0.8", ""),

        freq: parseInput("100 kHz", "Hz"),
        l_value: parseInput("33 uH", "H"),

        max_i_out: parseInput("2 A", "A"),

        diode_vf: parseInput("200 mV", "V"),

        max_v_in: parseInput("12 V", "V"),
        typ_v_in: parseInput("8.4 V", "V"),
        min_i_out: parseInput("1 A", "A"),
        max_v_pkpk: parseInput("0.05 V", "V"),
        est_l_ripple_factor: parseInput("0.3", ""),
    })

    const duty_eq = "1 - (min_v_in * eff / v_out)"
    const inductor_ripple_current = `(min_v_in * (${duty_eq})) / (freq * l_value)`

    const max_switching_current = `((${inductor_ripple_current})/2) + (max_i_out/(1-(${duty_eq})))`

    const est_inductor_ripple_current = "est_l_ripple_factor * max_i_out * (v_out / typ_v_in)"

    return <Layout title="Boost Converter Power Stage Calculator">
        <CalcRow>
            <Image src={require("./boost.svg")}
                alt="Circuit diagram of a boost converter"
                width={40} height={18.6} layout="responsive" priority />
            <p> This calculator provides assistance when designing a boost
            regulator. The equations here are derived from&nbsp;
                <a href="https://www.ti.com/lit/an/slva372c/slva372c.pdf">
                    TI's "Basic Calculation of a Boost Converter's Power
                    Stage", SLVA372C</a>. You'll want to be following along
                    in that document as you fill this worksheet out.
            </p>
            <CalculatorHelpBase />
        </CalcRow>
        <CalcRow>
            <h2>Duty Cycle</h2>
            <p>
                The duty cycle of the buck converter is the proportion of the
                time that the switch spends closed, in other words, the
                fraction of the time that current is flowing through <i>Q</i>.
            </p>
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
            <CalculatorInputField
                label="Efficiency (η)"
                desc="Estimated efficiency of the converter"
                name="eff"
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Duty Cycle (D)"
                equation={duty_eq}
                scope={scope} /></CalcRow>

        <CalcRow>
            <h2>Inductor Ripple Current</h2>
            <p>
                The inductor ripple current is the difference between the
                maximum and the minimum current flowing through the output
                inductor <i>L</i>. This value is used later on to calculate
                the peak current flowing through <i>Q</i>.
            </p>
            <CalculatorInputField
                label={<React.Fragment>Switching Frequency (f<sub>s</sub>)</React.Fragment>}
                name="freq"
                desc="Minimum switching frequency"
                scope={scope} setScope={setScope} />
            <CalculatorInputField
                label="Inductor Value"
                name="l_value"
                desc="Value of the inductor. Typical inductor values are sometimes found in the datasheet, otherwise use the calculator below."
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Inductor Ripple Current"
                equation={inductor_ripple_current}
                scope={scope} />
        </CalcRow>

        <CalcRow>
            <h2>Maximum Switch Current</h2>
            <p>
                This is the peak current that the inductor <i>L</i>,
            the switch <i>Q</i>, and the diode <i>D</i> must be
                                designed to survive.
            </p>
            <CalculatorInputField
                label={<Fragment>Max I<sub>out</sub></Fragment>}
                name="max_i_out"
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Maximum Switching Current"
                equation={max_switching_current}
                scope={scope} />
        </CalcRow>

        <CalcRow>
            <h2>Inductor Selection</h2>
            <p>
                You should fill out this area of the worksheet if your
                datasheet doesn't provide you with suggested inductor values.
            </p>
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
            <CalculatorResultField
                label="Suggested Inductor Value"
                equation={`(typ_v_in * (v_out - typ_v_in)) / ((${est_inductor_ripple_current}) * freq * v_out)`}
                scope={scope} />
            <CalculatorResultField
                label="Estimated Inductor Ripple Current"
                equation={est_inductor_ripple_current}
                desc="This is the estimated ripple current if the above inductor is used."
                scope={scope} />
        </CalcRow>

        <CalcRow>
            <h2>Rectifier Diode Selection</h2>
            <p>
                Schottky doides are recommended in order to reduce losses. The
                forward current rating should be the same as the expected
                output current. Peak current ratings for Schottky diodes
                is usually much higher than the average rating, so there is no
                need to worry about the peak current calculated above.
            </p>
            <CalculatorInputField
                label={<Fragment>Diode V<sub>f</sub></Fragment>}
                name="diode_vf"
                desc="The forward voltage for your diode. This is usually between 150mV and 450mV."
                scope={scope} setScope={setScope} />
            <CalculatorResultField
                label="Diode Forward Current"
                equation={`max_i_out * (1 - (${duty_eq}))`}
                scope={scope} />
            <CalculatorResultField
                label="Diode Power Dissipation"
                equation="max_i_out * diode_vf"
                scope={scope} />
        </CalcRow>
    </Layout >
}

export default DcDcCalculatorPage
