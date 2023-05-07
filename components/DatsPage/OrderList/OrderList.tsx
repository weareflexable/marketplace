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
  gotoCommunityPage: (dat:any) => void;
}


export function OrderList({ orders, gotoTicketPage, gotoCommunityPage }: OrderListProps) {

  return (

    <Flex direction="column" w="100%">
      {orders
        ? orders.map((page:any, index: any) => (
          <React.Fragment key={index}>
            {
              page.data && page.data.length === 0
              ?<NoData/>
              : page.data && page.data.map((order:any)=>{
                const isCommunity = order.communityDetails.length !== 0
                if(isCommunity){
                  return <CommunityListItem key={order.id} gotoCommunityPage={gotoCommunityPage} order={order}/>
                }else{
                  return <VenueListItem key={order.id} order={order} gotoTicketPage={gotoTicketPage}/>
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


interface VenueProps{
  gotoTicketPage: (value:any)=>void
  order: any
}

function VenueListItem({order, gotoTicketPage}:VenueProps){
  return(
  <Flex
  // px="1em"
  pt=".5em"
  pb="1rem" 
  // bg="#242424"
  mb="3"
  // borderBottom={'1px solid #444444'}
  w="100%"
  direction="row"
  borderRadius={'6px'}
  key={order.id}
  cursor={'pointer'}
  onClick={()=>gotoTicketPage(order)}
>
   
  <Image  width='170px' height='70px'  objectFit="cover" src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${order.serviceItemsDetails[0].logoImageHash}`}/>
  <Flex  ml={5} width={'100%'} direction={'column'}>

  <HStack>
      <Text textStyle={'caption'} color="text.200">
        {/* {dayjs(order.validityEnd).tz('America/New_York').format("MMM D, YYYY HA z")} */}
        {dayjs(order.targetDate).format("MMM D, YYYY")}
      </Text>
      
      { order.isRedeem 
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
          {order.serviceItemsDetails[0].name} 
        </Text>
        <HStack mt="1" spacing="1">
          <Text textStyle={'secondary'} color="text.100">
            By
          </Text>
          <Text textStyle={'secondary'} color="text.200">
            {order.serviceDetails[0].name}
          </Text>
        </HStack>
      </Flex>
    </Flex>

    {/* pricing */}
    <HStack mt='5' spacing={5} >
      <HStack spacing="0.9">
        <Text color="text.300" textStyle="secondary">
          {`$${numberFormatter.from(order.serviceItemsDetails[0].price/100)}`}
        </Text>
        <Text color="text.200" textStyle="secondary">
           x{order.quantity}
        </Text>
      </HStack>
      <Text  textStyle="secondary" color={'text.300'}>
        {/* @ts-ignore */}
       {` $${order.quantity * numberFormatter.from(order.serviceItemsDetails[0].price/100)}`}
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
    // px="1em"
    pt=".5em"
    pb="1rem" 
    // bg="#242424"
    mb="3"
    // borderBottom={'1px solid #444444'}
    w="100%"
    direction="row"
    borderRadius={'6px'}
    key={order.id}
    cursor={'pointer'}
    onClick={()=>gotoCommunityPage(order)}
  >
     
    <Image  width='170px' height='70px'  objectFit="cover" src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${order.communityDetails[0].artworkHash}`}/>
    <Flex  ml={5} width={'100%'} direction={'column'}>

    <HStack>
      
        
        { order.isRedeem 
        ?
          <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme={"green"} ml="1">
            Redeemed
          </Tag>
          :
          <Tag size={'sm'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} colorScheme='yellow' ml="1">
            Valid
          </Tag>
        }
        <Tag size={'sm'} borderRadius='3xl'  textTransform={'uppercase'} textStyle={'caption'} ml="1">
            Community
        </Tag>
    </HStack>
      
      {/* order name */}
      <Flex mt={3} alignItems={'center'}>
        
        <Flex direction={'column'}>
          <Text color="whiteAlpha.900" as="h4" textStyle="body">
            {order.communityDetails[0].name} 
          </Text>
        </Flex>
      </Flex>

      {/* pricing */}
      <HStack mt='5' spacing={5} >
        <HStack spacing="0.9">
          <Text color="text.300" textStyle="secondary">
            {`$${numberFormatter.from(order.communityDetails[0].price/100)}`}
          </Text>
          <Text color="text.200" textStyle="secondary">
             x{order.quantity}
          </Text>
        </HStack>
        <Text  textStyle="secondary" color={'text.300'}>
          {/* @ts-ignore */}
         {` $${order.quantity * numberFormatter.from(order.communityDetails[0].price/100)}`}
        </Text>
      </HStack>

    </Flex>

  </Flex>
  )
}