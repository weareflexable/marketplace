import React from 'react'
import {
    Box,
    Wrap,
    Flex,
    WrapItem,
    Heading,
    VStack,
    HStack,
    SimpleGrid
} from '@chakra-ui/react'
import ServiceSearchBar from '../TicketSearchBar/TicketSearchBar'
import Image from 'next/future/image'
import TicketListItem from './TicketListItem'

interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string,
    id: string
}


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
