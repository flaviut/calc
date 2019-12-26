import * as React from 'react'
import Link from 'next/link'
import Head from 'next/head'

import '../public/static/all.scss'
import { Grid } from './Grid'

const NavBar: React.FunctionComponent = () => (
  <header className="navbar" style={{
  }}>
    <section className="navbar-section">
      <Link href="/"><a className="btn btn-link">flaviutamas.com</a></Link>{" "}
    </section>
    <section className="navbar-section">
      <Link href="/calc"><a className="btn btn-link">calc</a></Link>{" "}
    </section>
  </header>)

const Footer: React.FunctionComponent = () => (
  <footer>
    © 2019 Flaviu Tamas,{" "}
    <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a> or{" "}
    <a href="http://www.apache.org/licenses/LICENSE-2.0" rel="license">Apache 2.0</a>
  </footer>)

type Props = {
  title?: string
}

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


      <main className="columns container grid-lg center">
        <Grid item col={12}><NavBar /></Grid>
        <Grid item col={12}><h1>{title}</h1></Grid>
        {children}
      </main>

      <Footer />
    </React.Fragment>
  )

export default Layout
