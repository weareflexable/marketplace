import React from 'react'
import {Flex,HStack,Box, Button,Text,Image} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../utils/localStorage'

export default function Header(){

    const {isAuthenticated,setIsAuthenticated,logout} = useAuthContext()
    const {push, asPath, basePath} = useRouter()

    const login =()=>{
        const currentPath = `${asPath}${basePath}`
        setStorage('lastVisitedPage',currentPath)
        location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
        // location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
    }

    return(
        <Flex bg='gray.800' w='100%'  boxShadow='0px 2px 3px 0px rgba(0,0,0,0.15)' alignItems='center' justifyContent='space-between' p='2em' h='55px'>
            <Link href='/'>
               <a> <Image src='/logo.svg' w={['150px','100px']} height={'70px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    isAuthenticated?
                    <HStack spacing={3}>
                     <Link href='/bookings'>
                        <a><Text fontWeight='medium'>My Purchases</Text></a>
                    </Link>
                    <Button variant='link' onClick={logout}>Logout</Button>
                    </HStack>
                    : <Button colorScheme={'cyan'} onClick={login}>Login</Button>
                }
                
            </Flex>
        </Flex>
    )
}