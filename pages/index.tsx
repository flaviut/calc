import Link from "next/link";
import Layout from "../components/Layout";

const CalculatorIndex: React.FunctionComponent = () => (
  <Layout title="Calculator Index">
    <ul>
      <li>DC/DC Converters</li>
      <ul>
        <li>
          <Link href="/electronics/dc-dc/boost">
            Boost Converters
          </Link>
        </li>
        <li>
          <Link href="/electronics/dc-dc/buck">
            Buck Converters
          </Link>
        </li>
      </ul>
      <li>
        <Link href="/electronics/voltage-divider">
          Voltage Divider
        </Link>
      </li>
    </ul>
  </Layout>
);

export default CalculatorIndex;
