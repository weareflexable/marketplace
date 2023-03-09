import React from "react";
import {
  Flex, Text, HStack, Button,
  Badge,
  Avatar
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
interface OrderListProps {
  orders: any;
  gotoTicketPage: (dat:any) => void;
}
export function OrderList({ orders, gotoTicketPage }: OrderListProps) {


  return (

    <Flex direction="column" w="100">
      {orders
        ? orders.map((page:any, index: any) => (
          <React.Fragment key={index}>
            {
              page.data && page.data.length === 0
              ?<NoData/>
              : page.data && page.data.map((order:any)=>(
                <Flex
                  px="1em"
                  pt=".5em"
                  pb=".7em"
                  bg="#242424"
                  mb="3"
                  w="100%"
                  direction="column"
                  borderRadius={'6px'}
                  key={order.id}
                >
                  <HStack justifyContent={'space-between'} mb="1" spacing="1">
                    <HStack>
                      <Text textStyle={'caption'} color="text.200">
                        {dayjs(order.validityEnd).tz('America/New_York').format("MMM D, YYYY HA z")}
                      </Text>
                      
                      { order.isRedeem 
                      ?
                        <Text textStyle={'caption'} colorScheme={"yellow"} ml="1">
                          Redeemed
                        </Text>
                        :
                        dayjs().isAfter(dayjs(order.validityEnd))
                        ?
                        <Text textStyle={'caption'} color='#F16161' ml="1">
                          Expired
                        </Text>
                      : (
                        <Text textStyle={'caption'} color='state.success' ml="1">
                          Valid
                        </Text>
                      )}
                    </HStack>
                    <ChevronRightIcon _hover={{color:'brand.300'}} style={{cursor:'pointer'}} boxSize={'6'} onClick={()=>gotoTicketPage(order)}/>
                  </HStack>
                  <Flex  justifyContent="space-between">
                    
                    {/* order name */}
                    <Flex alignItems={'center'}>
                      <Avatar mr='3' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${order.serviceItemsDetails[0].logoImageHash}`}/>
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
                    <Flex direction={'column'} alignItems='flex-end'>
                      <Text mb='1' textStyle="secondary" color={'text.200'}>
                        {/* @ts-ignore */}
                       {` $${order.quantity * numberFormatter.from(order.serviceItemsDetails[0].price/100)}`}
                      </Text>
                      <HStack spacing="0.9">
                        <Text color="text.100" textStyle="caption">
                          {`$${numberFormatter.from(order.serviceItemsDetails[0].price/100)}`}
                        </Text>
                        <Text color="text.200" textStyle="caption">
                           x{order.quantity}
                        </Text>
                      </HStack>
                    </Flex>

                  </Flex>
{/* 
                  <HStack mb="1" spacing="1">
                    <Text textStyle={'secondary'} color="text.100">
                      By
                    </Text>
                    <Text textStyle={'secondary'} color="text.300">
                      {order.serviceDetails[0].name}
                    </Text>
                  </HStack> */}

                </Flex>
              ))
            }
            
          </React.Fragment>
        ))
        : null}
    </Flex>
  );
}
