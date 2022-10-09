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
    Flex,
    Checkbox
} from '@chakra-ui/react'


export default function ServiceFilter(){
    return(
        <Flex direction='column' p='2' borderEndRadius='4' w='100%' >
            <Heading mb='3' as='h4'  size='sm'>Service Filter</Heading>
            <Accordion w='100%' bg='#f6f6f6' allowToggle>
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
        </Flex>
    )
}


const FilterList = ()=>{
    return(
        <Flex direction='column'>
            <FilterListItem/>
            <FilterListItem/>
        </Flex>
    )
}

const FilterListItem =()=>{
    return(
        <Flex w='100%' alignItems='center' justifyContent='space-between'>
            <Box>
                Angles
            </Box>
            <Checkbox/>
        </Flex>
    )
}