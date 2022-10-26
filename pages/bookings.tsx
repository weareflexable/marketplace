import React,{useEffect,useState} from 'react';
import {Flex,Box,Heading,Skeleton,SimpleGrid,Text,VStack,HStack,Grid,GridItem,Button,Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Badge} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout';
import Ticket from '../components/shared/Ticket/Ticket';
import { useRouter } from 'next/router';
import supabase from "../utils/supabase";
import { useAuthContext } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import QrCodeModal from '../components/BookingsPage/QrCodeModal/QrCodeModal';

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
    const {asPath,push} = useRouter()
    const {setIsAuthenticated,isAuthenticated} = useAuthContext();

    const [isModalOpen, setIsModalOpen] = useState(false);

    let paseto:string|null|undefined=undefined;

    if(typeof window !== 'undefined'){
        paseto = localStorage.getItem('paseto')

        if(!paseto){
            paseto = asPath.split('?')[1]
        }
    }

    if(paseto){
        // save paseto first
        localStorage.setItem('paseto', paseto)
        // authenticate user
        setIsAuthenticated(true);
        // check is login request was created from cart
        const isPaymentPending = localStorage.getItem('paymentStatus')==='pending';
        if(isPaymentPending){
            push('/payments')
        }
      }

      const generateQrCode=(ticket: any)=>{
        console.log(ticket);
      }

      const redeemTicket = (order:any)=>{
        console.log(order)
        setIsModalOpen(true)
      }

        const {isLoading,data,isError} = useQuery(['bookings'],async()=>{
            const res = await fetch('https://platform.flexabledats.com/api/v1.0/orders',{
                method:'GET',
                headers:{
                    'Authorization': paseto
                  }
            })
            const body = await res.json()
            return body
          })

          console.log(data,isError)


    if(!isAuthenticated){
        return(
            <Layout>
                <Box>
                    <Text color='whiteAlpha.900'>Please login first before trying to access this page</Text>
                </Box>
            </Layout>
        )
    }

    return(
    <Layout>
        <Grid minH='100vh' h='100%' templateColumns='repeat(5, 1fr)' gap={6} >
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
                                <Skeleton isLoaded={!isLoading}>
                                {data && data.payload ? data.payload.map(order=>(
                                    <Flex p='1em' bg='blackAlpha.700' mb='3' direction='column' key={order.id}>
                                        <HStack mb='1' spacing='1'>
                                            <Text color='whiteAlpha.700'>{order.serviceName}·</Text>
                                            <Badge  ml='1' >
                                                {order.isPaid?'Paid':'Pending payment'} 
                                            </Badge>
                                        </HStack>
                                        <Flex mb='1' justifyContent='space-between'>
                                            <Text color='whiteAlpha.900' as='h4' textStyle='h4'>{order.name}</Text>
                                            <Text textStyle='secondary'>${order.unitPrice}</Text>
                                        </Flex>
                                        <HStack mb='1' spacing='1'>
                                            <Text color='whiteAlpha.300'>Ends on:</Text>
                                            <Text color='whiteAlpha.700'>{dayjs(order.endDate).format('MMM D, YYYY')}</Text>
                                        </HStack>
                                        <Button colorScheme='teal' onClick={()=>redeemTicket(order)}>Redeem Ticket</Button>
                                    </Flex>
                                ))
                                :null}
                                </Skeleton>
                            </TabPanel>
                            <TabPanel>
                                <PurchasedTickets/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </GridItem>
        </Grid>
        <QrCodeModal
            isModalOpen={isModalOpen}
            onCloseModal={()=>setIsModalOpen(false)}
            ticket={{}}
        />
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
            
        </SimpleGrid>
    </Box>
    )
}


