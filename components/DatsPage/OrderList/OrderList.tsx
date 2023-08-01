import React from "react";
import {
  Flex, Text, HStack, Button,
  Badge,
  Avatar,
  Tag
} from "@chakra-ui/react";
import dayjs from "dayjs";
import {ChevronRightIcon} from '@chakra-ui/icons'
import NoData from "../../shared/NoData/NoData";

var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

import { numberFormatter } from "../../../utils/formatter";
import Image from "next/image";


interface OrderListProps {
  orders: any;
  gotoTicketPage: (dat:any) => void;
  gotoEventPage: (dat:any)=>void,
  gotoCommunityPage: (dat:any) => void;
  currentFilter:string
}


export function OrderList({ orders, currentFilter, gotoTicketPage, gotoEventPage, gotoCommunityPage }: OrderListProps) {

  return (

    <Flex direction="column" w="100%">
      {orders
        ? orders.map((page:any, index: any) => (
          <React.Fragment key={index}>
            {
              page.data && page.data.length === 0
              ?<NoData/>
              : page.data && page.data.map((order:any)=>{
                // const isCommunity = order.communityDetails.length !== 0
                if(currentFilter==='communities'){
                  return <CommunityListItem key={order.id} gotoCommunityPage={gotoCommunityPage} order={order}/>
                }else if(currentFilter === 'services'){
                  return <VenueListItem key={order.id} order={order} gotoTicketPage={gotoTicketPage}/>
                }else{
                  return <EventListItem key={order.id} order={order} gotoEventPage={gotoEventPage}/>
                }
                
               }
              )
            }
            
          </React.Fragment>
        ))
        : null}
    </Flex>
  );
}


interface EventProps{
  gotoEventPage: (value:any)=>void
  order: any
}

function EventListItem({order, gotoEventPage}:EventProps){
  return(
  <Flex
  py="1rem"
  px="1rem" 
  bg="#242424"
  mb="3"
  borderBottom={'1px solid #44444'}
  w="100%"
  direction="row"
  borderRadius={'6px'}
  key={order.id}
  cursor={'pointer'}
  onClick={()=>gotoEventPage(order)}
>
   
  <Image  width='170px' height='70px'  objectFit="cover" src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${ order.eventDetails.coverImageHash}`}/>
  <Flex  ml={5} width={'100%'} direction={'column'}>

  <HStack> 
      <Text textStyle={'caption'} color="text.200" noOfLines={1}> 
        {/* {dayjs(order.validityEnd).tz('America/New_York').format("MMM D, YYYY HA z")} */}
        {dayjs(order.eventDetails.startTime).tz("UTC").format("MMM D, YYYY h A")} {order.eventDetails.timeZone}
      </Text>

      { order.ticketStatus === 'redeemed' 
      ?
        <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme={"green"} ml="1">
          Redeemed
        </Tag>
        :
        dayjs().isAfter(dayjs(order.eventDetails.startTime).add(order.duration/60,'h').tz('UTC'))
        ?
        <Tag size={'sm'} borderRadius='3xl'  variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='orange' ml="1">
          Expired
        </Tag>
      : (
        <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='yellow' ml="1">
          Valid
        </Tag>
      )}
  </HStack>
    
    {/* order name */}
    <Flex mt={3} alignItems={'center'}>
      
      <Flex direction={'column'}>
        <Text color="whiteAlpha.900" as="h4" textStyle="body">
          {order.eventDetails.name} 
        </Text>
        <HStack mt="1" spacing="1">
          <Text textStyle={'secondary'} color="text.100">
            By
          </Text>
          <Text textStyle={'secondary'} color="text.200">
            {order.eventDetails.name}
          </Text>
        </HStack>
      </Flex>
    </Flex>

    {/* pricing */}
    <HStack mt='5' spacing={5} >
      <HStack spacing="0.9">
        <Text color="text.300" textStyle="secondary">
          {`$${numberFormatter.from(order.eventDetails.price/100)}`}
        </Text>
        <Text color="text.200" textStyle="secondary">
           x{order.quantity}
        </Text>
      </HStack>
      <Text  textStyle="secondary" color={'text.300'}>
        {/* @ts-ignore */}
       {` $${order.quantity * numberFormatter.from(order.eventDetails.price/100)}`}
      </Text>
    </HStack>

  </Flex>

</Flex>
  )
}

interface CommunityListItemProp{
  order:any,
  gotoCommunityPage: (dat:any) => void
}

function CommunityListItem({order, gotoCommunityPage}:CommunityListItemProp){


  return(
    <Flex
    px="1rem"
    py="1rem"
    bg="#242424"
    mb="3"
    borderBottom={'1px solid #44444'}
    w="100%"
    direction="row"
    borderRadius={'6px'}
    key={order.id}
    cursor={'pointer'}
    onClick={()=>gotoCommunityPage(order)}
  >
     
    <Image  width='170px' height='70px'  objectFit="cover" src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${order.communityDetails.artworkHash}`}/>
    <Flex  ml={5} width={'100%'} direction={'column'}>

    <HStack>
      <Text textStyle={'caption'} color="text.200">
        {dayjs(order.createdAt).format("MMM D, YYYY")}
      </Text>
        
        { order.ticketStatus === 'active'
        ?
          <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme={"green"} ml="1">
            Active
          </Tag>
          :order.ticketStatus === 'partial'
          ?<Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='yellow' ml="1">
          Partially Redeemed
        </Tag>
        :<Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='yellow' ml="1">
        Redeemed
      </Tag>
          
        }
       
    </HStack>
      
      {/* order name */}
      <Flex mt={3} alignItems={'center'}>
        
        <Flex direction={'column'}>
          <Text color="whiteAlpha.900" as="h4" textStyle="body">
            {order.communityDetails.name} 
          </Text>
        </Flex>
      </Flex>

      {/* pricing */}
      <HStack mt='5' spacing={5} >
        <HStack spacing="0.9">
          <Text color="text.300" textStyle="secondary">
            {`$${numberFormatter.from(order.communityDetails.price/100)}`}
          </Text>
          <Text color="text.200" textStyle="secondary">
             x{order.quantity}
          </Text>
        </HStack>
        <Text  textStyle="secondary" color={'text.300'}>
          {/* @ts-ignore */}
         {` $${numberFormatter.from(order.quantity * order.communityDetails.price/100)}`}
        </Text>
      </HStack>

    </Flex>

  </Flex>
  )
}

interface VenueProps{
  gotoTicketPage: (value:any)=>void
  order: any
}

function VenueListItem({order, gotoTicketPage}:VenueProps){
  return(
  <Flex
  py="1rem"
  px="1rem" 
  bg="#242424"
  mb="3"
  borderBottom={'1px solid #44444'}
  w="100%"
  direction="row"
  borderRadius={'6px'}
  key={order.id}
  cursor={'pointer'}
  onClick={()=>gotoTicketPage(order)}
>
   
  <Image  width='170px' height='70px'  objectFit="cover" src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${ order.serviceItemDetails.logoImageHash}`}/>
  <Flex  ml={5} width={'100%'} direction={'column'}>

  <HStack> 
      <Text textStyle={'caption'} color="text.200">
        {/* {dayjs(order.validityEnd).tz('America/New_York').format("MMM D, YYYY HA z")} */}
        {dayjs(order.targetDate).format("MMM D, YYYY")}
      </Text>
      
      { order.ticketStatus === 'redeemed' 
      ?
        <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme={"green"} ml="1">
          Redeemed
        </Tag>
        :
        dayjs().isAfter(dayjs(order.validityEnd))
        ?
        <Tag size={'sm'} borderRadius='3xl'  variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='orange' ml="1">
          Expired
        </Tag>
      : (
        <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='yellow' ml="1">
          Valid
        </Tag>
      )}
  </HStack>
    
    {/* order name */}
    <Flex mt={3} alignItems={'center'}>
      
      <Flex direction={'column'}>
        <Text color="whiteAlpha.900" as="h4" textStyle="body">
          {order.serviceItemDetails.name} 
        </Text>
        <HStack mt="1" spacing="1">
          <Text textStyle={'secondary'} color="text.100">
            By
          </Text>
          <Text textStyle={'secondary'} color="text.200">
            {order.serviceDetails.name}
          </Text>
        </HStack>
      </Flex>
    </Flex>

    {/* pricing */}
    <HStack mt='5' spacing={5} >
      <HStack spacing="0.9">
        <Text color="text.300" textStyle="secondary">
          {`$${numberFormatter.from(order.serviceItemDetails.price/100)}`}
        </Text>
        <Text color="text.200" textStyle="secondary">
           x{order.quantity}
        </Text>
      </HStack>
      <Text  textStyle="secondary" color={'text.300'}>
        {/* @ts-ignore */}
       {` $${order.quantity * numberFormatter.from(order.serviceItemDetails.price/100)}`}
      </Text>
    </HStack>

  </Flex>

</Flex>
  )
}