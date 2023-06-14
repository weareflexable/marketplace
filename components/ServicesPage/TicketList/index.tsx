import React,{ReactNode, useState} from 'react'
import {
    Box,
    SimpleGrid,
} from '@chakra-ui/react'

import TicketListItem from './TicketListItem'


interface TicketListProps{

    children: ReactNode
}

export default function TicketList({children}:TicketListProps){

    return(
        <>
        <Box p='1em' w='100%'>
            <SimpleGrid columns={1} spacing='3'>
                {children}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
