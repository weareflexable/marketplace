// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'> 
        <Head>
        <script
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAxBDdnJsmCX-zQa-cO9iy-v5pn53vXEFA&libraries=places&callback=initMap"
        ></script>
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}