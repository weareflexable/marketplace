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
        <Grid mx='1em' minH='100vh' h='100%' templateColumns={['1fr','1fr','1fr','repeat(5, 1fr)']} gap={6} >
            <GridItem colStart={[1,1,1,2]} colEnd={[2,2,2,4]}>
                <Flex width={'100%'} direction='column'>
                    <Box ml={[6]}>
                        <Heading  mt='10' mb='6'>My Bookings</Heading>
                    </Box>
                    <Flex direction='column' w='100'>
                            {filteredOrders?<BookingsFilters onSelectFilter={selectFilterHandler}/>:null}

                                {/* <Skeleton isLoaded={!isLoading}> */}
                                {filteredOrders?filteredOrders.map((order:any)=>(
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
                                            <Text color='whiteAlpha.700'>{dayjs(order.ticketDate).format('MMM D, YYYY')}</Text>
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





