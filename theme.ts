
import "@fontsource/lato";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "@fontsource/merriweather/400.css";
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
  layerStyles:{
    base: {
      bg: 'gray.900',
      // borderColor: 'gray.500',
    },
    secondLayer: {
      bg: 'blackAlpha.800',
      border: '1px solid',
      borderColor: 'blackAlpha.500',
    },
    thirdLayer:{
      bg: 'blackAlpha.500',
      
    },
    selected: {
      bg: 'teal.500',
      color: 'teal.700',
      borderColor: 'orange.500',
    },
    },
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
      fontWeight: '900',
      lineHeight: '110%',
      letterSpacing: '-0.5px', 
    },

    h2:{
      fontWeight: '700',
      fontFamily: 'body',
      fontSize: '1em',
      letterSpacing: '-0.1px'
    },

    h4:{
      color: 'gray.200' ,
      fontFamily:'body',
      lineHeight:1,
      fontSize:'1.2em',
      fontWeight: '900'
    },
    links:{
      fontWeight: '500',
      lineHeight: '110%', 
      cursor:'pointer'
    },
    caption:{
      color: 'gray.200' ,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: 0,
      fontSize: ['12px','12px','13px']
    },
    ticketPrice:{
      fontFamily:'body',
      fontWeight: 700, 
      fontSize: ['1.5em','1.6em','2.2em'],
      letterSpacing: '-0.8px',
      fontVariantNumeric:'oldstyle-nums',
      margin: 0,
      lineHeight: 1
    },
    currency:{
      fontFamily: 'heading',
      fontSize: '2em'
    },
    body:{
      color: 'gray.900' ,
      fontFamily: 'body',
      lineHeight: 1.3,
      fontWeight: 400,
      letterSpacing: '-.2px'
    },
    secondary:{
      color: 'gray.100' ,
      fontFamily: 'body',
      lineHeight: 1.3,
      fontWeight: 400,
      letterSpacing: '-.2px'
    }
    
  }
})


export default theme