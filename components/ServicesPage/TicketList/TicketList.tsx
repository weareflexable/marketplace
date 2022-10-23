import React,{useState} from 'react'
import {
    Box,
    Heading,
    Input,
    Flex,
    SimpleGrid,
    HStack,
    Text
} from '@chakra-ui/react'

import TicketListItem from '../../shared/Ticket/Ticket'
import {Service} from '../../../data/services'
import TicketMobile from '../../shared/Ticket/TicketMobile/TicketMobile'
import dayjs from 'dayjs'


interface TicketListProps{
    services: any
    onAddToCart: (id:string)=>void
}

export default function TicketList({services,onAddToCart}:TicketListProps){

    const [date, setDate] = useState(dayjs().format('MMM-D-YYYY'))

    const handleDateChange = (event)=>{
        const unFormatedDate = event.target.value
    setDate(dayjs(unFormatedDate).format('MMM-D-YYYY'))
    }

    return(
        <>
        <Box p='1em' w='100%'>
            <Flex alignItems='center' mt='2em'  width={'100%'}> 
                <Text as='h2' height={'100%'} textStyle={'h4'} mb='4'>Showing you ticket for current date</Text>
                <Box ml='2'  height={'40px'} display='inline-block' w='100px'  position={'relative'}>
                    <Text cursor='pointer' position='absolute' left='0' top='0'>{date}</Text>
                    <Input cursor='pointer' opacity='0' sx={{'&::-webkit-calendar-picker-indicator':{position:'absolute', height:'100%', width:'100px'}}} position='absolute' left='0' top='0' h='100%' width='100px' type='date' value={date} onChange={(event)=>handleDateChange(event)} variant='unstyled'/>
                </Box>
            </Flex>

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
