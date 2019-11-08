import * as React from 'react'
import RouterLink from 'next/link'
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

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

        {children}
        
        <footer>
          <hr />
          <span>I'm here to stay (Footer)</span>
        </footer>
      </Container>
    </React.Fragment>
  )

export default Layout
