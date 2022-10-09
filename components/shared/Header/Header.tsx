import React from 'react'
import {Flex,HStack,Box} from '@chakra-ui/react'
import Link from 'next/link'

export default function Header(){
    return(
        <Flex alignItems='center' justifyContent='space-between' p='1em' w='100%' h='3em'>
            <Box>
                <Link href='/'><a>Logo</a></Link>
            </Box>
            <Flex as='nav'>
                <Link href='/'>
                    <a>Booking history</a>
                </Link>
            </Flex>
        </Flex>
    )
}