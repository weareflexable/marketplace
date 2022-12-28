import React from "react";
import {
  Flex, Text, HStack, Button,
  SkeletonText,
  Badge
} from "@chakra-ui/react";
import dayjs from "dayjs";
import moment from "moment-timezone";
import timezone from 'dayjs/plugin/timezone'

// dayjs.extend(timezone)


export default function SkeletonList() {
  return (

    <Flex direction="column" w="100">
      {Array(5).fill('').map((_, i)=> 
          <Flex
            p="1em"
            bg="#242424"
            mb="3"
            w="100%"
            direction="column"
            key={i}
          >
            <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </Flex>
        )}
    </Flex>
  );
}
