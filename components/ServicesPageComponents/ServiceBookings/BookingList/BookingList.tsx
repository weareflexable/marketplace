import React, { ReactNode } from 'react'
import {HStack,Flex,Box, Text} from '@chakra-ui/react'


interface BookingsListProps{
    children: ReactNode
}
export default function BookingList({children}:BookingsListProps){
    return(
        <Flex as='ul' direction='column' w='100%'>
            {children}
        </Flex>
    )
}


