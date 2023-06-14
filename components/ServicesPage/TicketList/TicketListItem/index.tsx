
import * as React from 'react';
import {
    Box,
    HStack,
    Text,
    Flex,
    Divider,
    Button,
    IconButton,
    // Image,
    useMediaQuery
} from '@chakra-ui/react'

import Image from 'next/image'
import { MdAdd, MdRemove } from 'react-icons/md'
import dayjs from 'dayjs';
import useService from '../hooks/useTicket';
import useTicket from '../hooks/useTicket';
import TicketButton from '../TicketButton';
import TicketButtonStepper from '../TicketButton/TicketButtonStepper';
import TicketButtonAction from '../TicketButton/TicketButtonAction';


var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)


// REFACTOR THIS PAGE!
// CONSIDER CREATING A CONTEXT FOR THIS COMPONENT OR HAVE BETTER COMPOSITION



interface TicketProps{
    data: any,
    selectedDate: string
}

const { FormatMoney } = require('format-money-js');

const numberFormatter = new FormatMoney({
    decimals: 0
  });
  

function TicketListItem ({data,selectedDate}:TicketProps){


      // I need each ticketListItem to manage it's own state (quantity, action buttons), hence the reason for passing the state to useTicket hook.
    const {
        ticketData,
        isTicketsAvailable,
        // isTicketsSoldOut,
        isMaxQuantity,
        isMinQuantity,
        // ticketDate,
        subTotal,
        isProceedingToPayment,
        isAuthenticated,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
         }= useTicket(data)

    
    return( 
        <Box display={['block']} bg='#242424' borderRadius={8} cursor='pointer' >
            <Flex direction={['column','column','row']}>
                <Box objectFit={'contain'} maxH='300px' height={'300px'} width='100%' maxW='400px' position={'relative'}>
                    <Image alt='Artwork for ticket' loading='lazy' layout='fill'  objectFit={'cover'} src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${ticketData.logoImageHash}`}/>
                </Box>
                <Flex direction={['column']}>
                    <Flex py='1em'>
                        <Flex px='1em' flex={4} direction='column'>
                            <Text textStyle={'secondary'} color='accent.200'>{dayjs(selectedDate).format('MMM DD, YYYY')}</Text>
                            <Text as='h4' mb='0' textTransform={'capitalize'} textStyle={'h4'} layerStyle={'highPop'} lineHeight='tight' noOfLines={1}>
                                {data.name}
                            </Text>    
                            <Text textStyle={'secondary'} layerStyle={'mediumPop'}>
                                {data.description}
                            </Text>
                            <Flex mt='2' justifyContent={'space-between'} alignItems='center'>
                                <HStack spacing={5}>
                                    <HStack spacing={1}>
                                        <Text textStyle={'secondary'} color='accent.300'>${numberFormatter.from(data.price/100)}</Text>
                                        <Text textStyle={'secondary'} color='text.200'>/ Ticket</Text>
                                    </HStack> 
                                    <HStack spacing={2}>
                                        <Text textStyle={'secondary'} color={'text.300'}>{numberFormatter.from(ticketData.ticketsAvailable)}</Text>
                                        <Text textStyle={'secondary'} color={'text.200'}>Tickets left</Text>
                                    </HStack>
                                </HStack>
                                {subTotal===0?null:<Text color={'white'}>${numberFormatter.from(subTotal)}</Text>}
                            </Flex>
                        </Flex>
                    </Flex>
                    

                    {/* bottom panel */}
                    <Flex px='1em' py='.5em' mb={3} width={['100%','370px']}  alignItems='center' justifyContent={['space-between','center','flex-start']} >
                        <TicketButton
                            isTicketsAvailable = {isTicketsAvailable} 
                        >
                             <TicketButtonStepper 
                                isMinQuantity={isMinQuantity}
                                isMaxQuantity={isMaxQuantity}
                                quantity={ticketData.quantity}
                                decrementQuantity ={decrementQuantity}
                                incrementQuantity = {incrementQuantity}
                                label = {'Tickets'}
                            />
                            <Divider orientation='vertical' borderLeftWidth={'2px'} borderColor='brand.disabled' height='40px'/>
                            <TicketButtonAction
                                isAuthenticated = {isAuthenticated}
                                isMinQuantity = {isMinQuantity}
                                isBuyingTicket = {isProceedingToPayment}
                                buyTicketNow={buyTicketNow}
                            />
                        </TicketButton>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}



export default TicketListItem


