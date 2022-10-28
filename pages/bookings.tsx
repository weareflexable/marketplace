import React,{useEffect,useState} from 'react';
import {Flex,Box,Heading,Skeleton,SimpleGrid,Text,VStack,HStack,Grid,GridItem,Button,Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Badge, useMediaQuery} from '@chakra-ui/react'
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
import QrCodeMobile from '../components/BookingsPage/QrCodeModal/QrCodeMobile/QrCodeMobile';



export default function MyBookings(){

    // TODO: fetch user specific data
    // TODO: fallback ui for when user tries to access page without authorization
    const {asPath,push} = useRouter()
    const {setIsAuthenticated,isAuthenticated} = useAuthContext();
    const [isGeneratingCode, setIsGeneratingCode] = useState(false)
    const [qrSignature, setQrSignature] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderFilter, setOrderFilter] = useState('PAYMENT_PAID')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const [isLargerThan62] = useMediaQuery('(min-width: 62em)')


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
       isLargerThan62? setIsModalOpen(true) : setIsDrawerOpen(true)

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
      
      
      const orders=[
          {
              id: "708a922d-2407-4f98-9579-a5a510425348",
              quantity: 1,
              transactionHash: "0xddae0658e387b1a232af9c1ac1e083369f12590ba74575c9155242350f1dd05b",
              orgServiceItemId: "40829a91-6570-4b67-b197-8c7be4a13c23",
              paymentIntentId: "pi_3Lxa7iLY9m0w00gp0IX17qwv",
              paymentIntentStatus: "PAYMENT_PAID",
              name: "Line Skip",
              serviceName: "Benjamin’s On Franklin",
              endDate: "2022-11-14T00:00:00Z",
              unitPrice: 2500,
              currency: "USD",
              tokenId: 1,
              orderStatus: "TICKETS_ISSUED",
              ticketDate: "2022-10-27T00:00:00Z"
            },
            {
                id: "8e05be0f-16e5-4480-aa0c-853a56c4e747",
                quantity: 1,
                orgServiceItemId: "40829a91-6570-4b67-b197-8c7be4a13c23",
                paymentIntentId: "pi_3Lxby2LY9m0w00gp0nEGwvXO",
            paymentIntentStatus: "PAYMENT_INITIATED",
            name: "Line Skip",
            serviceName: "Benjamin’s On Franklin",
            endDate: "2022-11-14T00:00:00Z",
            unitPrice: 2500,  
            currency: "USD",    
            ticketDate: "2022-10-28T00:00:00Z"
        }
    ]
    
    const filteredOrderz = orders.filter((order:any)=> orderFilter === order.paymentIntentStatus )

    // if(!isAuthenticated){
    //     return(
    //         <Layout>
    //             <Box>
    //                 <Text color='whiteAlpha.900'>Please login first before trying to access this page</Text>
    //             </Box>
    //         </Layout>
    //     )
    // }

    return(
    <Layout>
        <Grid mx='1em' minH='100vh' h='100%' templateColumns={['1fr','1fr','1fr','repeat(5, 1fr)']} gap={6} >
            <GridItem colStart={[1,1,1,2]} colEnd={[2,2,2,4]}>
                <Flex width={'100%'} direction='column'>
                    <Box ml={[6]}>
                        <Heading  mt='10' mb='6'>My Bookings</Heading>
                    </Box>
                    <Flex w='100'>
                            {filteredOrders?<BookingsFilters onSelectFilter={selectFilterHandler}/>:null}

                                {/* <Skeleton isLoaded={!isLoading}> */}
                                {orders?filteredOrderz.map((order:any)=>(
                                    <Flex p='1em' bg='blackAlpha.700' mb='3' w='100%' direction='column' key={order.id}>
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
                                            <Text color='whiteAlpha.500'>Valid on:</Text>
                                            <Text color='whiteAlpha.700'>{dayjs(order.endDate).format('MMM D, YYYY')}</Text>
                                        </HStack>
                                        {order.paymentIntentStatus !== 'PAYMENT_PAID'? null 
                                        :
                                        <Button colorScheme='cyan' onClick={()=>generateQrCode(order)}>Show Digital Access Token</Button>
                                        }
                                    </Flex>
                                ))
                                :null}
                               {/* </Skeleton> */}
                    </Flex>
                </Flex>
            </GridItem>
        </Grid>

        {/* only show on web */}
        <QrCodeModal
            isGeneratingCode={isGeneratingCode}
            qrValue={qrSignature}
            isModalOpen={isModalOpen} 
            onCloseModal={()=>setIsModalOpen(false)}

        />

        {/* only show on mobile */}
        <QrCodeMobile
            isGeneratingCode={isGeneratingCode}
            qrValue={qrSignature}
            isDrawerOpen={isDrawerOpen} 
            onCloseDrawer={()=>setIsDrawerOpen(false)}
        />
    </Layout>
    )
}





