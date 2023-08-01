import React, { ReactNode } from 'react'
import {Flex,Box,SimpleGrid} from '@chakra-ui/react'
import Header from '../Header/Header'
import { useRouter } from 'next/router'


interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}:LayoutProps){

    return(
        <Flex bg='#121212' direction='column' w='100%'>
            <Header/>
            <Box as='main' h='100%' minH='95vh' w='100%'>
                {children}
            </Box>
        </Flex>
    )
}

