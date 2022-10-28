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
import { getPlatformPaseto } from '../utils/storage';
import BookingsFilters from '../components/BookingsPage/BookingFilter/BookingFilter';

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
    const [isGeneratingCode, setIsGeneratingCode] = useState(false)
    const [qrSignature, setQrSignature] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderFilter, setOrderFilter] = useState('PAYMENT_PAID')


    const {isLoading,data,isError} = useQuery(['bookings'],async()=>{
        const paseto = getPlatformPaseto()
        const res = await fetch('https://platform.flexabledats.com/api/v1.0/orders',{
            method:'GET',
            //@ts-ignore
            headers:{
                'Authorization': paseto
              }
        })
        const body = await res.json()
        return body
      })

      const generateQrCode = async(order:any)=>{
        let qrCodePayload;
        const payload = {
            orgServiceItemId: order.orgServiceItemId,
            tokenId: order.tokenId
        }
        setIsModalOpen(true)

        try{
            setIsGeneratingCode(true)
            const res = await fetch('https://platform.flexabledats.com/api/v1.0/get-redeem-signature',{
                method:'POST',
                body: JSON.stringify(payload),
                // @ts-ignore
                headers:{
                    'Authorization': getPlatformPaseto()
                }
            })
            setIsGeneratingCode(false)
            const body = await res.json()
            qrCodePayload={
                ...payload,
                signature: body.payload.signature,
                validity: body.payload.validity,
                quantity:order.quantity,
                userId: isAuthenticated?supabase.auth.user()?.email:''
            }
            setQrSignature(qrCodePayload)


        }catch(err){
            setIsGeneratingCode(false)
            console.log(err)
        }

      }

      const selectFilterHandler=(value:string)=>{
        console.log(value)
        setOrderFilter(value)
      }
      

      const filteredOrders = data && data.payload.filter((order:any)=> orderFilter === order.paymentIntentStatus )




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
        <Grid minH='100vh' h='100%' templateColumns={['2fr','2fr','repeat(5, 1fr)']} gap={6} >
            <GridItem colStart={[1,1,2]} colEnd={[3,3,4]}>
                <Flex direction='column'>
                    <Heading mt='10' mb='6'>My Bookings</Heading>
                    <Tabs variant='unstyled' >
                        <TabList>
                            <Tab textStyle={'h4'}  _selected={{ color: 'cyan'}}>Tickets</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                            <BookingsFilters onSelectFilter={selectFilterHandler}/>
                                <Skeleton isLoaded={!isLoading}>
                                {filteredOrders ? filteredOrders.map((order:any)=>(
                                    <Flex p='1em' bg='blackAlpha.700' mb='3' direction='column' key={order.id}>
                                        <HStack mb='1' spacing='1'>
                                            <Text color='whiteAlpha.700'>{order.serviceName}·</Text>
                                            <Badge colorScheme={order.paymentIntentStatus==='PAYMENT_PAID'?'green':'purple'}  ml='1' >
                                                {order.paymentIntentStatus} 
                                            </Badge>
                                        </HStack>
                                        <Flex mb='1' justifyContent='space-between'>
                                            <Text color='whiteAlpha.900' as='h4' textStyle='h4'>{order.name}</Text>
                                            <Text textStyle='secondary'>${order.unitPrice/100}</Text>
                                        </Flex>
                                        <HStack mb='1' spacing='1'>
                                            <Text color='whiteAlpha.300'>Valid on:</Text>
                                            <Text color='whiteAlpha.700'>{dayjs(order.ticketPrice).format('MMM D, YYYY')}</Text>
                                        </HStack>
                                        {order.paymentIntentStatus !== 'PAYMENT_PAID'? null : <Button colorScheme='teal' onClick={()=>generateQrCode(order)}>Show Digital Access Token</Button>}
                                    </Flex>
                                ))
                                :null}
                                </Skeleton>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </GridItem>
        </Grid>
        <QrCodeModal
            isGeneratingCode={isGeneratingCode}
            qrValue={qrSignature}
            isModalOpen={isModalOpen}
            onCloseModal={()=>setIsModalOpen(false)}

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


