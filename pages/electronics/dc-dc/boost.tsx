import * as React from "react";
import { useState } from "react";
import Image from "next/image";

import Layout from "../../../components/Layout";
import CalculatorInputField, {
  parseInput,
} from "../../../components/CalculatorInputField";
import CalculatorResultField from "../../../components/CalculatorResultField";
import CalculatorHelpBase from "../../../components/CalculatorHelpBase";
import Grid from "../../../components/Grid";
import { ColumnSection, ColumnText } from "../../../components/ColumnText";

import boostSchematic from "./boost.svg";

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
  });

  const dutyEq = "1 - (min_v_in * eff / v_out)";
  const inductorRippleCurrent = `(min_v_in * (${dutyEq})) / (freq * l_value)`;

  const maxSwitchingCurrent = `((${inductorRippleCurrent})/2) + (max_i_out/(1-(${dutyEq})))`;

  const estInductorRippleCurrent =
    "est_l_ripple_factor * max_i_out * (v_out / typ_v_in)";

  return (
    <Layout title="Boost Converter Power Stage Calculator">
      <Grid item col={12}>
        <ColumnText>
          <ColumnSection>
            <Image
              src={boostSchematic}
              alt="Circuit diagram of a boost converter"
              width={boostSchematic.width}
              height={boostSchematic.height}
              unoptimized
              priority
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto"
              }} />
            <p>
              {" "}
              This calculator provides assistance when designing a boost
              regulator. The equations here are derived from&nbsp;
              <a href="https://www.ti.com/lit/an/slva372c/slva372c.pdf">
                TI's "Basic Calculation of a Boost Converter's Power Stage",
                SLVA372C
              </a>
              . You'll want to be following along in that document as you fill
              this worksheet out.
            </p>
            <CalculatorHelpBase />
          </ColumnSection>

          <ColumnSection>
            <h2>Duty Cycle</h2>
            <p>
              The duty cycle of the buck converter is the proportion of the time
              that the switch spends closed, in other words, the fraction of the
              time that current is flowing through <i>Q</i>.
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>Min V<sub>in</sub></>}
              name="min_v_in"
              desc="Minimum input voltage"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorInputField
              // prettier-ignore
              label={<>V<sub>out</sub></>}
              name="v_out"
              desc="Desired output voltage"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorInputField
              label="Efficiency (η)"
              desc="Estimated efficiency of the converter"
              name="eff"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorResultField
              label="Duty Cycle (D)"
              equation={dutyEq}
              scope={scope}
            />
          </ColumnSection>

          <ColumnSection>
            <h2>Inductor Ripple Current</h2>
            <p>
              The inductor ripple current is the difference between the maximum
              and the minimum current flowing through the output inductor{" "}
              <i>L</i>. This value is used later on to calculate the peak
              current flowing through <i>Q</i>.
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>Switching Frequency (f<sub>s</sub>)</>}
              name="freq"
              desc="Minimum switching frequency"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorInputField
              label="Inductor Value"
              name="l_value"
              desc="Value of the inductor. Typical inductor values are sometimes found in the datasheet, otherwise use the calculator below."
              scope={scope}
              setScope={setScope}
            />
            <CalculatorResultField
              label="Inductor Ripple Current"
              equation={inductorRippleCurrent}
              scope={scope}
            />
          </ColumnSection>

          <ColumnSection>
            <h2>Maximum Switch Current</h2>
            <p>
              This is the peak current that the inductor <i>L</i>, the switch{" "}
              <i>Q</i>, and the diode <i>D</i> must be designed to survive.
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>Max I<sub>out</sub></>}
              name="max_i_out"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorResultField
              label="Maximum Switching Current"
              equation={maxSwitchingCurrent}
              scope={scope}
            />
          </ColumnSection>

          <ColumnSection>
            <h2>Inductor Selection</h2>
            <p>
              You should fill out this area of the worksheet if your datasheet
              doesn't provide you with suggested inductor values.
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>Typ V<sub>in</sub></>}
              name="typ_v_in"
              desc="Typical input voltage"
              scope={scope}
              setScope={setScope}
            />
            <CalculatorInputField
              label="Ripple Current Factor"
              name="est_l_ripple_factor"
              desc="An estimated factor for the ripple current. A reasonable guess is between 0.2 and 0.4."
              scope={scope}
              setScope={setScope}
            />
            <CalculatorResultField
              label="Suggested Inductor Value"
              equation={`(typ_v_in * (v_out - typ_v_in)) / ((${estInductorRippleCurrent}) * freq * v_out)`}
              scope={scope}
            />
            <CalculatorResultField
              label="Estimated Inductor Ripple Current"
              equation={estInductorRippleCurrent}
              desc="This is the estimated ripple current if the above inductor is used."
              scope={scope}
            />
          </ColumnSection>

          <ColumnSection>
            <h2>Rectifier Diode Selection</h2>
            <p>
              Schottky doides are recommended in order to reduce losses. The
              forward current rating should be the same as the expected output
              current. Peak current ratings for Schottky diodes is usually much
              higher than the average rating, so there is no need to worry about
              the peak current calculated above.
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>Diode V<sub>f</sub></>}
              name="diode_vf"
              desc="The forward voltage for your diode. This is usually between 150mV and 450mV."
              scope={scope}
              setScope={setScope}
            />
            <CalculatorResultField
              label="Diode Forward Current"
              equation={`max_i_out * (1 - (${dutyEq}))`}
              scope={scope}
            />
            <CalculatorResultField
              label="Diode Power Dissipation"
              equation="max_i_out * diode_vf"
              scope={scope}
            />
          </ColumnSection>
        </ColumnText>
      </Grid>
    </Layout>
  );
};

export default DcDcCalculatorPage;
