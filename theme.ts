import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
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
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
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