
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
import useService from '../hooks/useService';

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
    onTriggerAction:(id:string)=>void,
    selectedDate: string
}

const { FormatMoney } = require('format-money-js');

const numberFormatter = new FormatMoney({
    decimals: 0
  });
  

function Ticket ({data,selectedDate, onTriggerAction}:TicketProps){


    const [isLargerThan800] = useMediaQuery('(min-width: 600px)', {
        ssr: true,
        fallback: false, // return false on the server, and re-evaluate on the client side
      })

    const {
        ticketData,
        isTicketsAvailable,
        isBuyingTicket,
        // isTicketsSoldOut,
        isMaxQuantity,
        isMinQuantity,
        // ticketDate,
        subTotal,
        isAuthenticated,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
         }= useService(data)

    
    return( 
        <Box display={['block']} bg='#242424' borderRadius={8} cursor='pointer' >
            <Flex direction={['column','column','row']}>
                <Box objectFit={'contain'} maxH='300px' height={'300px'} width='100%' maxW='400px' position={'relative'}>
                    <Image alt='Artwork for ticket' loading='lazy' layout='fill'  objectFit={'cover'} src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${ticketData.logoImageHash}`}/>
                </Box>
                <Flex direction={['column']}>
                    <Flex py='1em'>
                        <Flex px='1em' flex={4} direction='column'>
                            <Text textStyle={'secondary'} color='accent.300'>{dayjs(selectedDate).format('MMM DD, YYYY')}</Text>
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
                    <Flex px='1em' py='.5em' mb={3} width={'100%'} alignItems='center' justifyContent={['space-between','center','center']} bg='gray.800'>
                        <FlexableComboButton
                            isMinQuantity= {isMinQuantity}
                            isTicketsAvailable = {isTicketsAvailable}
                            subTotal ={subTotal}
                            isBuyingTicket={isBuyingTicket}
                            isMaxQuantity = {isMaxQuantity}
                            isAuthenticated = {isAuthenticated}
                            incrementQuantity = {incrementQuantity}
                            decrementQuantity = {decrementQuantity}
                            buyTicketNow ={buyTicketNow}
                            label='Tickets'
                            quantity={ticketData.quantity}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}


interface FlexableStepperProps{
    isMinQuantity: boolean,
    isMaxQuantity: boolean,
    decrementQuantity: ()=>void
    incrementQuantity: ()=>void,
    quantity: number
    label: string
}
// Signature stepper button which features
// increment btn, quantity incremented, decrement btn in that order
function FlexableStepper({isMinQuantity, decrementQuantity, isMaxQuantity, incrementQuantity, quantity, label}:FlexableStepperProps){
    return(
            <Flex width={'50%'}  borderRadius={'50px'} p={1} justifyContent={'space-between'} alignItems='center'>
                <IconButton colorScheme={'brand.200'} textStyle={'buttonLabel'} isRound disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} bg={isMinQuantity?'brand.disabled':'brand.400'} color={isMinQuantity?'text.100':'text.300'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                <HStack spacing="2">
                    <Text textStyle={'secondary'}  color={isMinQuantity?'text.100':'text.300'}>{quantity}</Text>
                    <Text textStyle={'secondary'} color={'text.200'}>{label}</Text>
                </HStack>
                <IconButton colorScheme={'brand.200'} textStyle={'buttonLabel'} bg='brand.400' disabled={isMaxQuantity} isRound onClick={incrementQuantity} size='sm' color='text.300' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
            </Flex>
    )
}


interface FlexableComboButtonProps{
    isMinQuantity: boolean,
    quantity: number,
    isBuyingTicket: boolean,
    decrementQuantity: ()=>void,
    incrementQuantity: ()=>void,
    isMaxQuantity:boolean
    label: string,
    isTicketsAvailable: boolean,
    isAuthenticated:boolean,
    buyTicketNow: ()=>void,
    subTotal:number,
    // children:React.ReactNode
    
}
function FlexableComboButton({isMinQuantity, isBuyingTicket, isMaxQuantity, quantity, isTicketsAvailable, subTotal, decrementQuantity, incrementQuantity, label, isAuthenticated, buyTicketNow}:FlexableComboButtonProps){
    
    return(
        <>
    { isTicketsAvailable
        ?
        <Flex maxW='400px' outline={'2px solid'} outlineColor='rgba(171, 77, 247, 0.4)' outlineOffset={2} bg='brand.300' width={'100%'} borderRadius={'60px'} direction={'column'}>
             <Flex width={'100%'}  maxW='400px' justifyContent={'space-between'} alignItems='center'>
                <FlexableStepper 
                    isMinQuantity={isMinQuantity}
                    isMaxQuantity={isMaxQuantity}
                    quantity={quantity}
                    decrementQuantity ={decrementQuantity}
                    incrementQuantity = {incrementQuantity}
                    label = {'Tickets'}
                    />
                <Divider orientation='vertical' borderLeftWidth={'2px'} borderColor='brand.disabled' height='40px'/>
                <Box py='1' mr='6'>
                    <Button size='sm' textStyle={'buttonLabel'} isLoading={isBuyingTicket} layerStyle={'primaryBtn'} disabled={isMinQuantity&&isAuthenticated} onClick={buyTicketNow} variant='flexable-combo'>Buy Now!</Button>
                </Box>
             </Flex>
        </Flex>
        : <Flex width={'100%'} justifyContent={'center'} alignItems='center'>
            <Text>Sorry! Tickets are sold out</Text>
          </Flex>
    }
    </>
    )
}

export default Ticket


interface BuyNowButton{
    isMinQuantity:boolean
    buyTicketNow:()=>void
    isAuthenticated: boolean
}
function BuyNowButton({isMinQuantity, buyTicketNow, isAuthenticated}:BuyNowButton){
    return(
        <Box py='1' mr='6'>
            <Button size='sm' textStyle={'buttonLabel'} layerStyle={'primaryBtn'} disabled={isMinQuantity&&isAuthenticated} onClick={buyTicketNow} variant='flexable-combo'>Buy Now!</Button>
        </Box>
    )
}
