import React, { ReactNode } from 'react'
import {Flex,Box} from '@chakra-ui/react'
import Header from '../Header/Header'
import { useRouter } from 'next/router'


interface LayoutProps{
    children: ReactNode
}
export default function Layout({children}:LayoutProps){

    const router = useRouter()
    console.log(router.pathname)

    return(
        <Flex w='100%' h='100%' direction='column'>
            <Header/>
            {children}
        </Flex>
    )
}

