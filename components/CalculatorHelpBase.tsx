import React from "react";

const CalculatorHelpBase: React.FC = () => (
  <>
    <p>
      This calculator accepts arbitrary units and expressions. For example,{" "}
      <code>5e10 / (1 hour)</code> will be interpreted as "27.77 MHz".
    </p>
  </>
);
export default CalculatorHelpBase;
