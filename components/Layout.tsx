import * as React from 'react'
import RouterLink from 'next/link'
import Head from 'next/head'

import 'spectre.css'

type Props = {
  title?: string
}

const NavBar: React.FunctionComponent<{}> = () => (
  <header className="navbar">
    <section className="navbar-section">
      <RouterLink href="/"><a className="navbar-brand mr-2">flaviutamas.com</a></RouterLink>
      <RouterLink href="/dcdc"><a className="btn btn-link">DC-DC Converter Calculator</a></RouterLink>
    </section>
  </header>)

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'This is the default title',
}) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <NavBar />

    <div className="container grid-lg">
      {children}
    </div>

    <footer>
      <div style={{ textAlign: "center" }}>---</div>
      <div style={{ textAlign: "center" }}>
        © 2019 Flaviu Tamas,{" "}
        <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a> or{" "}
        <a href="http://www.apache.org/licenses/LICENSE-2.0" rel="license">Apache 2.0</a>
      </div>
    </footer>
  </React.Fragment>
)

export default Layout
