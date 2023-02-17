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

// import {Service} from '../../../data/services'
import Service from './Service/Service'
import dayjs from 'dayjs'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void,
    date: string
}

export default function TicketList({services,date,onAddToCart}:TicketListProps){
    console.log(services)

    return(
        <>
        <Box p='1em' w='100%'>
            <SimpleGrid columns={1} spacing='3'>
                {services && services.map((service: any)=>(
                    <Service 
                        key={service.id}
                        selectedDate={date} 
                        onTriggerAction={onAddToCart}   
                        data={service}
                    />
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
