import React from 'react'
import {
    Box,
    Heading,
    SimpleGrid
} from '@chakra-ui/react'

import TicketListItem from './TicketListItem'
import {Service} from '../../../data/services'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void
}

export default function TicketList({services,onAddToCart}:TicketListProps){



    return(
        <>
        <Box p='1em' w='100%'  border='1px solid #e5e5e5' >
            <Heading as='h2' mb='4' size='md'>Showing you ticket for current date</Heading>
            <SimpleGrid columns={1} spacing='3'>
                {services.map((service: Service)=>(
                    <TicketListItem onAddToCart={onAddToCart}  key={service.id} data={service}/>
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
