import * as React from 'react'
import RouterLink from 'next/link'
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

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
      <CssBaseline />
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <RouterLink href="/"><Button color="inherit">Home</Button></RouterLink>
            <RouterLink href="/about"><Button color="inherit">About</Button></RouterLink>
            <RouterLink href="/dcdc"><Button color="inherit">DC-DC Converter Calculator</Button></RouterLink>
          </Toolbar>
        </AppBar>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h1>{title}</h1>
          </Grid>
          {children}
        </Grid>

        <footer>
          <div style={{ textAlign: "center" }}>---</div>
          <div style={{ textAlign: "center" }}>
            © 2019 Flaviu Tamas,{" "}
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">CC-4.0-BY</a> or{" "}
            <a href="http://www.apache.org/licenses/LICENSE-2.0" rel="license">Apache 2.0</a>
          </div>
        </footer>
      </Container>
    </React.Fragment>
  )

export default Layout
