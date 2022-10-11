import React, { ReactNode } from 'react'
import {HStack,Flex,Box, Text} from '@chakra-ui/react'


interface CartListProps{
    children: ReactNode
}
export default function CartList({children}:CartListProps){
    return(
        <Flex as='ul' direction='column' w='100%'>
            {children}
        </Flex>
    )
}


