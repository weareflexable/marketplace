import React from 'react'
import {Flex,HStack,Box} from '@chakra-ui/react'
import Link from 'next/link'

export default function Header(){
    return(
        <Flex  boxShadow='0px 2px 3px 0px rgba(0,0,0,0.15)' alignItems='center' justifyContent='space-between' p='2em' w='100%' h='55px'>
            <Box>
                <Link href='/'><a>Flexable</a></Link>
            </Box>
            <Flex as='nav'>
                <Link href='/bookings'>
                    <a>My Bookings</a>
                </Link>
            </Flex>
        </Flex>
    )
}