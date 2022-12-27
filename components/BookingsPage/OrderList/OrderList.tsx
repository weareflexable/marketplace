import React from "react";
import {
  Flex, Text, HStack, Button,
  Badge
} from "@chakra-ui/react";
import dayjs from "dayjs";
import moment from "moment-timezone";

interface OrderListProps {
  orders: any;
  navigateToDatPage: () => void;
}
export function OrderList({ orders, navigateToDatPage }: OrderListProps) {
  return (


    <Flex direction="column" w="100">
      {orders
        ? orders.map((order: any) => (
          <Flex
            p="1em"
            bg="blackAlpha.700"
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
              <Text color="whiteAlpha.900" as="h4" textStyle="h4">
                {order.orgServiceItemName}
              </Text>
              <HStack spacing="3">
                <HStack spacing="0.5">
                  <Text color="whiteAlpha.800" textStyle="caption">
                    ${order.unitPrice / 100}
                  </Text>
                  <Text color="whiteAlpha.600" textStyle="caption">
                    x{order.quantity}
                  </Text>
                </HStack>
                <Text textStyle="secondary">
                  ${order.quantity * (order.unitPrice / 100)}
                </Text>
              </HStack>
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
            >
              Show Digital Access Token
            </Button>

          </Flex>
        ))
        : null}
    </Flex>
  );
}
