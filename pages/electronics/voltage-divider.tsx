import React, { FunctionComponent, useCallback, useState } from "react";
import Image from "next/image";

import mathjs from "../../utils/mathjs";
import Layout from "../../components/Layout";
import CalculatorInputField, {
  parseInput,
} from "../../components/CalculatorInputField";
import CalculatorHelpBase from "../../components/CalculatorHelpBase";
import { GenericScope } from "../../interfaces";
import { presentUnit } from "../../utils/mathjsTools";
import { ColumnSection, ColumnText } from "../../components/ColumnText";
import Grid from "../../components/Grid";

// prettier-ignore
const eSeries = {
    12: [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
    24: [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1],
    48: [1.00, 1.05, 1.10, 1.15, 1.21, 1.27, 1.33, 1.40, 1.47, 1.54, 1.62, 1.69, 1.78, 1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01, 3.16, 3.32, 3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36, 5.62, 5.90, 6.19, 6.49, 6.81, 7.15, 7.50, 7.87, 8.25, 8.66, 9.09, 9.53],
    96: [1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76],
}

function eSeriesToValues(series: number[], min: number, max: number): number[] {
  const startLog = Math.floor(Math.log10(min));
  const endLog = Math.ceil(Math.log10(max));
  let result: number[] = [];
  for (let i = startLog; i < endLog; i++) {
    result = [...result, ...series.map((v) => v * 10 ** i)];
  }
  return result.filter((v) => v >= min && v <= max);
}

function eSeriesToText(
  series: keyof typeof eSeries,
  rMin: string | number | mathjs.Unit,
  rMax: string | number | mathjs.Unit
): string {
  return `[${eSeriesToValues(
    eSeries[series],
    // typing is not quite correct: mathjs.unit() will accept unit parameters
    mathjs.number(mathjs.unit(rMin as string), "ohm") as number,
    mathjs.number(mathjs.unit(rMax as string), "ohm") as number
  )
    .map((val) => presentUnit(val, "ohm"))
    .join(", ")}]`;
}

function evaluateVoltageDivider(r1: number, r2: number, vin: number) {
  return (vin * r2) / (r1 + r2);
}

function calculateBestResistors(
  resistors: mathjs.Matrix,
  vIn: mathjs.Unit,
  vOut: mathjs.Unit
) {
  let best = { v: Number.NEGATIVE_INFINITY, r1: -1, r2: -1 };

  const vInNum = mathjs.number(vIn, "V");
  const vOutNum = mathjs.number(vOut, "V");
  const resistorsNum = resistors
    .map((val) => mathjs.number(val, "ohm"))
    .toArray() as number[];

  for (let i1 = 0; i1 < resistorsNum.length; i1++) {
    const r1 = resistorsNum[i1];
    for (let i2 = 0; i2 < resistorsNum.length; i2++) {
      const r2 = resistorsNum[i2];

      const newVOut = evaluateVoltageDivider(r1, r2, vInNum);
      if (Math.abs(vOutNum - newVOut) < Math.abs(vOutNum - best.v)) {
        best = { v: newVOut, r1, r2 };
      }
    }
  }

  return {
    r1: parseInput(presentUnit(best.r1, "ohm"), "ohm"),
    r2: parseInput(presentUnit(best.r2, "ohm"), "ohm"),
  };
}

const VoltageDividerPage: FunctionComponent = () => {
  const [scope, setScope] = useState({
    v_in: parseInput("12 V", "V"),
    v_out: parseInput("3.3 V", "V"),
    r_min: parseInput("10 kohm", "ohm"),
    r_max: parseInput("1 Mohm", "ohm"),
    resistor_values: parseInput(
      eSeriesToText(24, "10 kohm", "1 Mohm"),
      "ohm[]"
    ),
    r1: parseInput("240 kohm", "ohm"),
    r2: parseInput("91 kohm", "ohm"),
  });

  const [selectedSeries, setSelectedSeries] = useState<
    keyof typeof eSeries | "custom"
  >(24);

  const updateResistors = useCallback(
    (newScope: GenericScope) => {
      if (
        newScope.resistor_values.isError ||
        newScope.v_in.isError ||
        newScope.v_out.isError
      ) {
        // don't update the result value, the error is indicated in those fields
        return;
      }

      const { r1, r2 } = calculateBestResistors(
        newScope.resistor_values.value as mathjs.Matrix,
        newScope.v_in.value as mathjs.Unit,
        newScope.v_out.value as mathjs.Unit
      );
      setScope({ ...newScope, r1, r2 } as typeof scope);
    },
    [setScope]
  );

  const updateSeries = useCallback(
    (series: keyof typeof eSeries, newScope: typeof scope) => {
      setSelectedSeries(series);
      if (newScope.r_min.isError || newScope.r_max.isError) {
        // silently exit, the error is being displayed to the user
        return;
      }
      const newNewScope = {
        ...newScope,
        resistor_values: parseInput(
          eSeriesToText(
            series,
            newScope.r_min.value as mathjs.Unit,
            newScope.r_max.value as mathjs.Unit
          ),
          newScope.resistor_values.acceptedUnit
        ),
      };
      setScope(newNewScope);
      updateResistors(newNewScope);
    },
    [setSelectedSeries, updateResistors]
  );

  const updateVout = useCallback(
    (newScope: GenericScope) => {
      if (newScope.v_in.isError || newScope.r1.isError || newScope.r2.isError) {
        // don't update the result value, the error is indicated in those fields
        return;
      }
      setScope({
        ...newScope,
        v_out: parseInput(
          presentUnit(
            evaluateVoltageDivider(
              mathjs.number(newScope.r1.value as mathjs.Unit, "ohm"),
              mathjs.number(newScope.r2.value as mathjs.Unit, "ohm"),
              mathjs.number(newScope.v_in.value as mathjs.Unit, "V")
            ),
            "V"
          ),
          "V"
        ),
      } as typeof scope);
    },
    [setScope]
  );

  const customEntryUpdated = useCallback(
    (newScope: GenericScope) => {
      updateResistors(newScope);
      setSelectedSeries("custom");
    },
    [updateResistors]
  );

  return (
    <Layout title="Voltage Divider Calculator">
      <Grid item col={12}>
        <ColumnText>
          <ColumnSection>
            <Image
              // eslint-disable-next-line global-require
              src={require("./voltage-divider.svg")}
              alt="Circuit diagram of a voltage divider converter, with R1 connected to Vin and R2 connected to ground"
              width={30}
              height={12.8}
              layout="responsive"
              unoptimized
              priority
            />
            <p className="mt-2">
              This calculator provides assistance for designing a voltage
              divider, either with a common{" "}
              <a href="">E-series of preferred numbers</a> or with the set of
              resistors you already have in your parts bin.
            </p>
            <CalculatorHelpBase />
          </ColumnSection>

          <ColumnSection>
            <h2>Allowed Resistors</h2>

            <h3>E-series</h3>

            <p>
              Select parameters for the resistors that the calculator will be
              allowed to use. Modifying values here will replace the contents of
              the custom resistor entry field below.
            </p>

            <CalculatorInputField
              // prettier-ignore
              label={<>R<sub>min</sub></>}
              name="r_min"
              desc="Maximum value of each resistor"
              scope={scope}
              setScope={setScope}
              onChange={useCallback(
                (newScope) =>
                  updateSeries(
                    selectedSeries as keyof typeof eSeries,
                    newScope
                  ),
                [updateSeries, selectedSeries]
              )}
            />
            <CalculatorInputField
              // prettier-ignore
              label={<>R<sub>max</sub></>}
              name="r_max"
              desc="Minimum value of each resistor"
              scope={scope}
              setScope={setScope}
              onChange={useCallback(
                (newScope) =>
                  updateSeries(
                    selectedSeries as keyof typeof eSeries,
                    newScope
                  ),
                [updateSeries, selectedSeries]
              )}
            />
            <div className="form-group">
              <div className="btn-group btn-group-block">
                {Object.keys(eSeries).map((key) => (
                  <button
                    type="button"
                    className={`btn ${
                      selectedSeries.toString() === key && "active"
                    }`}
                    key={key}
                    onClick={() =>
                      updateSeries(
                        Number.parseInt(key, 10) as keyof typeof eSeries,
                        scope
                      )
                    }
                  >
                    E{key}
                  </button>
                ))}
              </div>
            </div>

            <h3>Custom Entry</h3>

            <CalculatorInputField
              label={<>Resistor Values</>}
              name="resistor_values"
              scope={scope}
              setScope={setScope}
              onChange={customEntryUpdated}
              rows={12}
            />
          </ColumnSection>

          <ColumnSection>
            <h2>Divider Parameters</h2>
            <p>
              Select the parameters for your voltage divider. You may change any
              of the fields, and the rest of the fields will update with the
              correct values
            </p>
            <CalculatorInputField
              // prettier-ignore
              label={<>V<sub>in</sub></>}
              name="v_in"
              scope={scope}
              setScope={setScope}
              onChange={updateResistors}
            />
            <CalculatorInputField
              // prettier-ignore
              label={<>V<sub>out</sub></>}
              name="v_out"
              scope={scope}
              setScope={setScope}
              onChange={updateResistors}
            />
            <CalculatorInputField
              // prettier-ignore
              label={<>R<sub>1</sub></>}
              name="r1"
              scope={scope}
              setScope={setScope}
              onChange={updateVout}
            />
            <CalculatorInputField
              // prettier-ignore
              label={<>R<sub>2</sub></>}
              name="r2"
              scope={scope}
              setScope={setScope}
              onChange={updateVout}
            />
          </ColumnSection>
        </ColumnText>
      </Grid>
    </Layout>
  );
};

export default VoltageDividerPage;
