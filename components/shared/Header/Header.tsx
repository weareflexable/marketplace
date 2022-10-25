import React from 'react'
import {Flex,HStack,Box, Button,Text} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'

export default function Header(){

    const {isAuthenticated,setIsAuthenticated,logout} = useAuthContext()
    return(
        <Flex bg='gray.800' gridColumnStart={1} gridColumnEnd={9}  boxShadow='0px 2px 3px 0px rgba(0,0,0,0.15)' alignItems='center' justifyContent='space-between' p='2em' w='100%' h='55px'>
            <Link href='/'>
               <a> <Image src='/logoSmall.png' width={'200px'} height={'15px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    isAuthenticated?
                    <HStack spacing={2}>
                     <Link href='/bookings'>
                        <a><Text fontWeight='medium'>My Bookings</Text></a>
                    </Link>
                    <Button onClick={logout}>Logout</Button>
                    </HStack>
                    : <Button onClick={()=>setIsAuthenticated(!isAuthenticated)}>Login</Button>
                }
                
            </Flex>
        </Flex>
    )
}