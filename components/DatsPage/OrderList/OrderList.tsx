import React from "react";
import {
  Flex, Text, HStack, Button,
  Badge
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

interface OrderListProps {
  orders: any;
  gotoTicketPage: (dat:any) => void;
}
export function OrderList({ orders, gotoTicketPage }: OrderListProps) {

console.log(orders)
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
                  p="1em"
                  bg="#242424"
                  mb="3"
                  w="100%"
                  direction="column"
                  borderRadius={'6px'}
                  key={order.id}
                >
                  <HStack justifyContent={'space-between'} mb="3" spacing="1">
                    <HStack>
                      <Text color="text.200">
                        {dayjs(order.validityEnd).tz('America/New_York').format("MMM D, YYYY HA z")}
                      </Text>
                      
                      { order.isRedeem 
                      ?
                        <Text textStyle={'secondary'} colorScheme={"yellow"} ml="1">
                          Redeemed
                        </Text>
                        :
                        dayjs().isAfter(dayjs(order.validityEnd))
                        ?
                        <Text textStyle={'secondary'} color='#F16161' ml="1">
                          Expired
                        </Text>
                      : (
                        <Text textStyle={'secondary'} colorScheme={"green"} ml="1">
                          Valid
                        </Text>
                      )}
                    </HStack>
                    <ChevronRightIcon boxSize={'5'} onClick={()=>gotoTicketPage(order)}/>
                  </HStack>
                  <Flex mb="1" justifyContent="space-between">
                    
                    {/* order name */}
                    <Text color="whiteAlpha.900" as="h4" textStyle="body">
                      {order.serviceItemsDetails[0].name} 
                    </Text>

                    {/* pricing */}
                    <Flex direction={'column'}>
                      <Text mb='1' textStyle="secondary" color={'text.200'}>
                        ${order.quantity * (order.serviceItemsDetails[0].price/100)}
                      </Text>
                      <HStack spacing="0.5">
                        <Text color="text.100" textStyle="caption">
                          ${order.serviceItemsDetails[0].price/100} 
                        </Text>
                        <Text color="text.200" textStyle="caption">
                          x{order.quantity}
                        </Text>
                      </HStack>
                    </Flex>
                  </Flex>

                  <HStack mb="1" spacing="1">
                    <Text textStyle={'secondary'} color="text.100">
                      By
                    </Text>
                    <Text textStyle={'secondary'} color="text.300">
                      {order.serviceDetails[0].name}
                    </Text>
                  </HStack>

                </Flex>
              ))
            }
            
          </React.Fragment>
        ))
        : null}
    </Flex>
  );
}
