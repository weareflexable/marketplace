
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

import useTicket from '../hooks/useTicket';
import { MdAdd, MdAddShoppingCart, MdRemove } from 'react-icons/md'
import dayjs from 'dayjs';


interface TicketProps{
    data: any,
    onTriggerAction:(id:string)=>void,
    selectedDate: string
}

function TicketMobile ({data,selectedDate, onTriggerAction}:TicketProps){

    
    return( 
        <Box display={['block','block','none']} bg='blackAlpha.700' cursor='pointer' >
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
                        <Text>${data.price}</Text>
                    </Flex>
                </Flex>
                

                {/* bottom panel */}
                <Flex px='1em' py='.5em' alignItems='center' justifyContent='space-between' bg='gray.800'>
                    <FlexableComboButton ticketData={data}/>
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
    ticketData: any
}
function FlexableComboButton({ticketData:data}:FlexableComboButtonProps){

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
         }= useTicket(data)

    
    return(
        <Flex width={'100%'} direction={'column'}>
            <Flex justifyContent={'space-between'} alignItems='center' width={'100%'}>
                <HStack>
                    <Text>Tickets left</Text>
                    <Text color={'white'}>{ticketData.tickets[0]!.ticketsAvailable}</Text>
                </HStack>
                <HStack>
                    <Text >Subtotal</Text>
                    <Text color={'white'}>{subTotal}</Text>
                </HStack>

            </Flex>
            <Flex width={'100%'} border={'1px solid'} maxW='400px' justifyContent={'space-between'} alignItems='center' borderRadius={'60px'} p={1} mt='2'>
                <FlexableStepper 
                    isMinQuantity={isMinQuantity}
                    quantity={ticketData.quantity}
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


