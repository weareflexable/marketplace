
import "@fontsource/lato";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "@fontsource/merriweather/700.css";
import "@fontsource/merriweather/900.css";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig ={
    initialColorMode: 'dark',
    useSystemColorMode: false
}
 const theme = extendTheme({
    ...config,
  styles:{
    global:(props: Record<string, any>)=>({
      'html, body': {
        color: 'gray.600',
        lineHeight: 'tall',
        height:'100vh'
      },
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', 'gray.800')(props),
        lineHeight: 'base',
      },
      '*::placeholder': {
        color: mode('gray.400', 'whiteAlpha.400')(props),
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word',
      },
  })
  },
  fonts: {
    heading: `'Merriweather', serif`,
    body: `'Lato', sans-serif`,
  },
  textStyles:{
    h1: {
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-2%', 
    },
    h4:{
      fontFamily:'heading',
      lineHeight:1,
      fontSize:'1em',
      fontWeight: '900'
    },
    links:{
      fontWeight: '500',
      lineHeight: '110%', 
      cursor:'pointer'
    },
    caption:{
      fontWeight: 900,
      lineHeight: 1,
      textTransform:'uppercase',
      letterSpacing: .5,
      fontSize: '13px'
    },
    ticketPrice:{
      fontFamily:'heading',
      fontWeight: 700,
      fontSize: '2.5em',
      margin: 0,
      lineHeight: 1
    },
    currency:{
      fontFamily: 'heading',
      fontSize: '2em'
    },
    secondary:{
      fontFamily: 'body',
      lineHeight: 1.3,
      fontWeight: 400,
      letterSpacing: '-.2px'
    }
    
  }
})


export default theme