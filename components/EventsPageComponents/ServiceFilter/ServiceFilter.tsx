import React from 'react'
import {
    Box,
    Heading,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    HStack,
    Flex
} from '@chakra-ui/react'


export default function ServiceFilter(){
    return(
        <VStack>
            <Heading as='h4' size='lg'>Service Filter</Heading>
            <Accordion>
            <AccordionItem>
                <AccordionButton>
                    <Box flex='1' textAlign='left'>
                        <Text>Bottle Service</Text> 
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <FilterList/>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionButton>
                    <Box flex='1' textAlign='left'>
                        <Text>Line Skip</Text> 
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                     <FilterList/>
                </AccordionPanel>
            </AccordionItem>
            </Accordion>
        </VStack>
    )
}


const FilterList = ()=>{
    return(
        <Flex>
            <FilterListItem/>
        </Flex>
    )
}

const FilterListItem =()=>{
    return(
        <HStack>List item</HStack>
    )
}