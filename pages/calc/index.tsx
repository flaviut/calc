import Layout from "../../components/Layout";
import Link from "next/link";

const CalculatorIndex: React.FunctionComponent = () => (
    <Layout title="Calculator Index">
        <ul>
            <li>DC/DC Converters</li>
            <ul>
                <li><Link href="/calc/dcdc/boost"><a className="btn btn-link">Boost Converters</a></Link></li>
            </ul>
        </ul>
    </Layout>
)

export default CalculatorIndex