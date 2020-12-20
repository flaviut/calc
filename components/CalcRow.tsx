import Grid from "./Grid";

const CalcRow: React.FunctionComponent = ({ children }) => (
  <Grid item md={12} col={6}>
    {children}
  </Grid>
);

export default CalcRow;
