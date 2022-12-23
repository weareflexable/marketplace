
import * as React from 'react';
import {
    Box,
    HStack,
    Text,
    Flex,
    Divider,
    Button,
    IconButton
} from '@chakra-ui/react'

import { MdAdd, MdRemove } from 'react-icons/md'
import dayjs from 'dayjs';
import useService from '../hooks/useService';


interface TicketProps{
    data: any,
    onTriggerAction:(id:string)=>void,
    selectedDate: string
}

function TicketMobile ({data,selectedDate, onTriggerAction}:TicketProps){

    const {
        ticketData,
        isTicketsAvailable,
        isTicketsSoldOut,
        isMinQuantity,
        ticketDate,
        subTotal,
        isAuthenticated,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
         }= useService(data)


    
    return( 
        <Box display={['block']} bg='blackAlpha.700' cursor='pointer' >
            <Flex direction='column'>
                <Flex py='1em'>
                    <Flex px='1em' flex={4} direction='column'>
                        <Text>{dayjs(selectedDate).format('MMM DD, YYYY')}</Text>
                        <Text as='h4' mb='1' textStyle={'h4'} lineHeight='tight' noOfLines={1}>
                            {data.name}
                        </Text>    
                        <Text textStyle={'secondary'}>
                            {data.description}
                        </Text>
                        <Flex justifyContent={'space-between'} alignItems='center'>
                            <HStack spacing={5}>
                                <HStack spacing={1}>
                                    <Text>${data.price}</Text>
                                    <Text>/ Ticket</Text>
                                </HStack>
                                <HStack spacing={2}>
                                    <Text color={'white'}>{data.tickets[0]!.ticketsAvailable}</Text>
                                    <Text>Tickets left</Text>
                                </HStack>
                            </HStack>
                            <Text color={'white'}>${subTotal}</Text>
                        </Flex>
                    </Flex>
                </Flex>
                

                {/* bottom panel */}
                <Flex px='1em' py='.5em' width={'100%'} alignItems='center' justifyContent={['space-between','center','center']} bg='gray.800'>
                    <FlexableComboButton
                        isMinQuantity= {isMinQuantity}
                        subTotal ={subTotal}
                        isAuthenticated = {isAuthenticated}
                        incrementQuantity = {incrementQuantity}
                        decrementQuantity = {decrementQuantity}
                        buyTicketNow ={buyTicketNow}
                        label='Tickets'
                        quantity={ticketData.quantity}
                    />
                </Flex>
            </Flex>
        </Box>
    )
}


interface FlexableStepperProps{
    isMinQuantity: boolean
    decrementQuantity: ()=>void
    incrementQuantity: ()=>void,
    quantity: number
    label: string
}
// Signature stepper button which features
// increment btn, quantity incremented, decrement btn in that order
function FlexableStepper({isMinQuantity, decrementQuantity, incrementQuantity, quantity, label}:FlexableStepperProps){
    return(
            <Flex width={'50%'}  borderRadius={'50px'} p={1} justifyContent={'space-between'} alignItems='center'>
                <IconButton isRound disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} color={isMinQuantity?'cyan.50':'cyan.400'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                <Text textStyle={'caption'} color={isMinQuantity?'whiteAlpha.500':'whiteAlpha.800'}>{quantity} {label}</Text>
                <IconButton isRound onClick={incrementQuantity} size='sm' color='cyan.400' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
            </Flex>
    )
}


interface FlexableComboButtonProps{
    isMinQuantity: boolean,
    quantity: number,
    decrementQuantity: ()=>void,
    incrementQuantity: ()=>void,
    label: string,
    isAuthenticated:boolean,
    buyTicketNow: ()=>void,
    subTotal:number
    
}
function FlexableComboButton({isMinQuantity, quantity, subTotal, decrementQuantity, incrementQuantity, label, isAuthenticated, buyTicketNow}:FlexableComboButtonProps){
    
    return(
        <Flex maxW='400px' width={'100%'} direction={'column'}>
            <Flex width={'100%'} border={'1px solid'} maxW='400px' justifyContent={'space-between'} alignItems='center' borderRadius={'60px'} p={1}>
                <FlexableStepper 
                    isMinQuantity={isMinQuantity}
                    quantity={quantity}
                    decrementQuantity ={decrementQuantity}
                    incrementQuantity = {incrementQuantity}
                    label = {'Tickets'}
                    />
                <Box id='divider' width={'2px'} height='40px'></Box>
                <Box mr='4'>
                    <Button size='sm' disabled={isMinQuantity&&isAuthenticated} onClick={buyTicketNow} variant='unstyled'>Buy Now!</Button>
                </Box>
            </Flex>
        </Flex>
    )
}

export default TicketMobile


