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
        <SimpleGrid bg='gray.900' columns={8} spacing={3} w='100%' h='100%'>
            <Header/>
            <Box as='main' gridColumnStart={1} gridColumnEnd={9}>
                {children}
            </Box>
        </SimpleGrid>
    )
}

