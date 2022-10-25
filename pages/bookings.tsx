import React,{useEffect} from 'react';
import {Flex,Box,Heading,SimpleGrid,VStack,Grid,GridItem,Button,Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout';
import Ticket from '../components/shared/Ticket/Ticket';
import { useRouter } from 'next/router';
import supabase from "../utils/supabase";

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
    const {asPath} = useRouter()
    
    useEffect(() => {
        const paceto = asPath.split('?')[1]
        // console.log(accessToken);
        localStorage.setItem('paceto',paceto)
    //   console.log
    }, [])

    return(
    <Layout>
        <Grid templateColumns='repeat(5, 1fr)' gap={6} >
            <GridItem colStart={2} colEnd={4}>
                <Flex w='600px' direction='column'>
                    <Heading mt='10' mb='6'>My Bookings</Heading>
                    <Tabs variant='unstyled' >
                        <TabList>
                            <Tab textStyle={'h4'}  _selected={{ color: 'blue'}}>Tickets</Tab>
                            <Tab textStyle={'h4'} _selected={{ color: 'blue'}}>Orders</Tab>
                        </TabList>
                        <TabPanels>
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
    </Layout>
    )
}


const PurchasedTickets = ()=>{
    return(
    <Box w='100%' mt='3' >
        <SimpleGrid columns={1} spacing='3'>
            {/* {purchasedTickets.map((ticket)=>(
                <Ticket key={ticket.id} onTriggerAction={()=>console.log('hello')} data={ticket}/>
            ))} */}
            <div>hello</div>
        </SimpleGrid>
    </Box>
    )
}

