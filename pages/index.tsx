import Link from "next/link";
import Layout from "../components/Layout";

const CalculatorIndex: React.FunctionComponent = () => (
  <Layout title="Calculator Index">
    <ul>
      <li>DC/DC Converters</li>
      <ul>
        <li>
          <Link href="/electronics/dc-dc/boost">
            <a>Boost Converters</a>
          </Link>
        </li>
        <li>
          <Link href="/electronics/dc-dc/buck">
            <a>Buck Converters</a>
          </Link>
        </li>
      </ul>
      <li>
        <Link href="/electronics/voltage-divider">
          <a>Voltage Divider</a>
        </Link>
      </li>
    </ul>
  </Layout>
);

export default CalculatorIndex;
