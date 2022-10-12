import * as React from 'react';
import {Flex,Box,Heading,SimpleGrid,VStack,Grid,GridItem,Button,Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'


const purchasedTickets = [
    {
        productName: 'Avery Black Classic Line Skip Service',
        price: 130,
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        serviceType:'lineSkip',
        quantity: 1,
        id:'1',
        description: 'Summer is around the corner and with the best way of knowing if it truly means something'
    },
    {
        productName: 'Tyler Perry Exclusive Bottle service',
        price: 102,
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        serviceType:'bottleService',
        quantity: 2,
        id:'2',
        description: 'Summer is around the corner and with the best way of knowing if it truly means something'
    },
    
]

export default function MyBookings(){

    // TODO: fetch user specific data
    // TODO: fallback ui for when user tries to access page without authorization

    return(
        <Grid templateColumns='repeat(5, 1fr)' gap={6} >
            <GridItem colStart={2} colEnd={4}>
                <Flex w='600px' direction='column'>
                    <Heading mt='10' mb='6'>My Bookings</Heading>
                    <Tabs variant='soft-rounded'>
                        <TabList>
                            <Tab>Purchased</Tab>
                            <Tab>Redeemed</Tab>
                            <Tab>Expired</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <PurchasedTickets/>
                            </TabPanel>
                            <TabPanel>
                                <PurchasedTickets/>
                            </TabPanel>
                            <TabPanel>
                                <PurchasedTickets/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </GridItem>
        </Grid>
    )
}


const PurchasedTickets = ()=>{
    return(
    <Box w='100%' mt='3' >
        <SimpleGrid columns={1} spacing='3'>
            {purchasedTickets.map((ticket)=>(
                <Ticket key={ticket.id} data={ticket}/>
            ))}
        </SimpleGrid>
    </Box>
    )
}

const Ticket = ({data})=>{
    return(
        <Box border='1px solid #e5e5e5' cursor='pointer'>
            {/* <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} alt={data.thumbnailAlt} width='100' height='150' /> */}
            <VStack align='left' spacing={3} p='4'>
                <Box as='h4' mb='0' lineHeight='tight' fontWeight='medium' noOfLines={1}>
                    {data.productName}
                </Box>    
                <Box>
                    {data.description}
                </Box>
                <Box>
                    ${data.price}
                    <Box as='span' color='gray.600' fontSize='sm'>
                        /person
                    </Box>
                </Box>
                <Button>
                    Redeem Ticket
                </Button>
            </VStack>
        </Box>
    )
}