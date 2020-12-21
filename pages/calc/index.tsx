import Link from "next/link";
import Layout from "../../components/Layout";

const CalculatorIndex: React.FunctionComponent = () => (
  <Layout title="Calculator Index">
    <ul>
      <li>DC/DC Converters</li>
      <ul>
        <li>
          <Link href="/calc/electronics/dc-dc/boost">
            <a>Boost Converters</a>
          </Link>
        </li>
        <li>
          <Link href="/calc/electronics/dc-dc/buck">
            <a>Buck Converters</a>
          </Link>
        </li>
      </ul>
      <li>
        <Link href="/calc/electronics/voltage-divider">
          <a>Voltage Divider</a>
        </Link>
      </li>
    </ul>
  </Layout>
);

export default CalculatorIndex;
