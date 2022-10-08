import "@fontsource/inter-tight";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/700.css";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig ={
    initialColorMode: 'dark',
    useSystemColorMode: false
}
 const theme = extendTheme({
    ...config,
  fonts: {
    heading: `'Inter Tight', sans-serif`,
    body: `'Inter Tight', sans-serif`,
  },
  textStyles:{
    h1: {
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-2%', 
    },
    links:{
      fontWeight: '500',
      lineHeight: '110%', 
      cursor:'pointer'
    }
  }
})


export default theme