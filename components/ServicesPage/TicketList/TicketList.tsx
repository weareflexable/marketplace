import React from 'react'
import {
    Box,
    Heading,
    SimpleGrid,
    Text
} from '@chakra-ui/react'

import TicketListItem from '../../shared/Ticket/Ticket'
import {Service} from '../../../data/services'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void
}

export default function TicketList({services,onAddToCart}:TicketListProps){



    return(
        <>
        <Box p='1em' w='100%'>
            <Text as='h2' textStyle={'h2'} mb='4'>Showing you ticket for current date</Text>
            <SimpleGrid columns={1} spacing='3'>
                {services.map((service: Service)=>(
                    <TicketListItem onAddToCart={onAddToCart}  key={service.id} data={service}/>
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
