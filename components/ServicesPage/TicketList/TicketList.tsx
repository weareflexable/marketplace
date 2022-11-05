import React,{useState} from 'react'
import {
    Box,
    Heading,
    Input,
    Flex,
    SimpleGrid,
    Skeleton,
    HStack,
    Text
} from '@chakra-ui/react'

import TicketListItem from '../../shared/Ticket/Ticket'
import {Service} from '../../../data/services'
import TicketMobile from '../../shared/Ticket/TicketMobile/TicketMobile'
import dayjs from 'dayjs'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void,
    date: string
}

export default function TicketList({services,date,onAddToCart}:TicketListProps){

    return(
        <>
        <Box p='1em' w='100%'>
            <SimpleGrid columns={1} spacing='3'>
                {services && services.map((service: any)=>(
                    <div key={service.serviceItemId}>
                    <TicketMobile 
                        selectedDate={date} 
                        onTriggerAction={onAddToCart}   
                        data={service}
                        />
                    <TicketListItem 
                        selectedDate={date}
                        onTriggerAction={onAddToCart}  
                        data={service}
                        />
                    </div>
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
