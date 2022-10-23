import React from 'react'
import {
    Box,
    Heading,
    Input,
    SimpleGrid,
    Text
} from '@chakra-ui/react'

import TicketListItem from '../../shared/Ticket/Ticket'
import {Service} from '../../../data/services'
import TicketMobile from '../../shared/Ticket/TicketMobile/TicketMobile'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void
}

export default function TicketList({services,onAddToCart}:TicketListProps){



    return(
        <>
        <Box p='1em' w='100%'>
            <Text as='h2' textStyle={'h2'} mb='4'>Showing you ticket for current date</Text>
            <Input type='date' variant='unstyled'/>
            <SimpleGrid columns={1} spacing='3'>
                {services && services.map((service: Service)=>(
                    <>
                    <TicketMobile onTriggerAction={onAddToCart}  key={service.id} data={service}/>
                    <TicketListItem onTriggerAction={onAddToCart}  key={service.id} data={service}/>
                    </>
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
