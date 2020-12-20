import { ReactNode } from "react";
import Grid from "./Grid";

const FieldHelpText: React.FunctionComponent<{
  text?: ReactNode;
}> = ({ text }) =>
  text ? (
    <Grid sm={12} col={8} className="col-ml-auto">
      <small className="label my-1">{text}</small>
    </Grid>
  ) : null;

export default FieldHelpText;
