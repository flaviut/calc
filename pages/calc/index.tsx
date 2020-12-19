import Layout from "../../components/Layout";
import Link from "next/link";

const CalculatorIndex: React.FunctionComponent = () => (
    <Layout title="Calculator Index">
        <ul>
            <li>DC/DC Converters</li>
            <ul>
                <li><Link href="/calc/dcdc/boost"><a>Boost Converters</a></Link></li>
                <li><Link href="/calc/dcdc/buck"><a>Buck Converters</a></Link></li>
            </ul>
        </ul>
    </Layout>
)

export default CalculatorIndex