import React from 'react'
import {Flex,HStack,Box, Button} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'

export default function Header(){

    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    return(
        <Flex gridColumnStart={1} gridColumnEnd={9}  boxShadow='0px 2px 3px 0px rgba(0,0,0,0.15)' alignItems='center' justifyContent='space-between' p='2em' w='100%' h='55px'>
            <Box>
                <Link href='/'><a>Flexable</a></Link>
            </Box>
            <Flex as='nav'>
                {
                    isAuthenticated?
                     <Link href='/bookings'>
                        <a>My Bookings</a>
                    </Link>: <Button onClick={()=>setIsAuthenticated(!isAuthenticated)}>Login</Button>
                }
                
            </Flex>
        </Flex>
    )
}