import React, { ReactNode } from 'react'
import {Flex,Box,SimpleGrid} from '@chakra-ui/react'
import Header from '../Header/Header'
import { useRouter } from 'next/router'


interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}:LayoutProps){

    const router = useRouter()
    console.log(router.pathname)

    return(
        <Flex bg='gray.900' direction='column'  w='100vw' minH='100vh' h='100%'>
            <Header/>
            <Box as='main' h='100%' minH='100vh' w='100vw'>
                {children}
            </Box>
        </Flex>
    )
}

