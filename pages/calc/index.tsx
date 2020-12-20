import Link from "next/link";
import Layout from "../../components/Layout";

const CalculatorIndex: React.FunctionComponent = () => (
  <Layout title="Calculator Index">
    <ul>
      <li>DC/DC Converters</li>
      <ul>
        <li><Link href="/calc/dc-dc/boost"><a>Boost Converters</a></Link></li>
        <li><Link href="/calc/dc-dc/buck"><a>Buck Converters</a></Link></li>
      </ul>
      <li><Link href="/calc/voltage-divider"><a>Voltage Divider</a></Link></li>
    </ul>
  </Layout>
)

export default CalculatorIndex