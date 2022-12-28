import React from "react";
import {
  Flex, Text, HStack, Button,
  Badge
} from "@chakra-ui/react";
import dayjs from "dayjs";
import moment from "moment-timezone";
import timezone from 'dayjs/plugin/timezone'

// dayjs.extend(timezone)

interface OrderListProps {
  orders: any;
  gotoTicketPage: (dat:any) => void;
}
export function OrderList({ orders, gotoTicketPage }: OrderListProps) {


  return (

    <Flex direction="column" w="100">
      {orders
        ? orders.map((order: any) => (
          <Flex
            p="1em"
            bg="#242424"
            mb="3"
            w="100%"
            direction="column"
            key={order.id}
          >
            <HStack mb="1" spacing="1">
              <Text color="whiteAlpha.700">
                {order.orgServiceName}
              </Text>
              {(order.status === "ISSUED" &&
                dayjs().isAfter(dayjs(order.endTime))) || order.status === '' ? (
                <Badge colorScheme={"gray"} ml="1">
                  Expired
                </Badge>
              ) : order.status === "REDEEMED" ? (
                <Badge colorScheme={"yellow"} ml="1">
                  Redeemed
                </Badge>
              ) : (
                <Badge colorScheme={"green"} ml="1">
                  Valid
                </Badge>
              )}
            </HStack>
            <Flex mb="1" justifyContent="space-between">
              
              {/* order name */}
              <Text color="whiteAlpha.900" as="h4" textStyle="h4">
                {order.orgServiceItemName}
              </Text>

              {/* pricing */}
              <Flex direction={'column'}>
                <Text mb='1' textStyle="secondary" color={'text.300'}>
                  ${order.quantity * (order.unitPrice/100)}
                </Text>
                <HStack spacing="0.5">
                  <Text color="text.100" textStyle="caption">
                    ${order.unitPrice / 100}
                  </Text>
                  <Text color="text.200" textStyle="caption">
                    x{order.quantity}
                  </Text>
                </HStack>
              </Flex>
            </Flex>
            <HStack mb="1" spacing="1">
              <Text color="whiteAlpha.500">Valid on:</Text>
              <Text color="whiteAlpha.700">
                {moment(order.endTime).tz('America/New_York').format("MMM D, YYYY")}
              </Text>
            </HStack>

            {/* show button only for confirmedOrders */}

            <Button
              colorScheme="cyan"
              onClick={()=>gotoTicketPage(order)}
            >
              Show Digital Access Token
            </Button>

          </Flex>
        ))
        : null}
    </Flex>
  );
}
