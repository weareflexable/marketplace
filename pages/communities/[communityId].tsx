import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, SkeletonText, Heading,useDisclosure,Image,SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery, Button, Divider} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import CartSummary from '../../components/ServicesPage/CartSummary/CartSummary'
import {useQuery} from '@tanstack/react-query'
import { useCheckoutContext } from '../../context/CheckoutContext'
import StoreHeader from '../../components/ServicesPage/StoreHeader/StoreHeader'
import { deleteStorage, getStorage, setStorage } from '../../utils/localStorage'
import { MdAddShoppingCart } from 'react-icons/md'
import MobileCart from '../../components/ServicesPage/Cart/MobileCart/MobileCart'
import MobileCartSummary from '../../components/ServicesPage/CartSummary/MobileCartSummary/MobileCartSummary'
import useLocalStorage from '../../hooks/useLocalStorage'
import Head from 'next/head'
import axios from 'axios'
import dayjs from 'dayjs'


var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

//@ts-ignore
import HeroSection from '../../components/CommunityPage/HeroSection'
import TicketButton from '../../components/ServicesPage/TicketList/TicketButton'
import TicketButtonStepper from '../../components/ServicesPage/TicketList/TicketButton/TicketButtonStepper'
import useTicket from '../../components/ServicesPage/TicketList/hooks/useTicket'
import useCommunityTicket from '../../components/CommunityPage/hooks/useCommunityTicket'
import TicketButtonAction from '../../components/ServicesPage/TicketList/TicketButton/TicketButtonAction'
import { useAuthContext } from '../../context/AuthContext'


export default function CommunityPage(){
    

    

    const router = useRouter();

    const [isLargerThan62] = useMediaQuery('(min-width: 62em)')

    const communityId  = router.query.communityId;
    
    
    
    const communityQuery = useQuery({
        queryKey:['single-community',communityId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/community?pageNumber=1&pageSize=12&id=${communityId}`) 
            return res.data
        },
        enabled: communityId !== undefined,
        staleTime: Infinity
    })
    
    // Confirming object is not undefined before accessing fields
    const community = communityQuery && communityQuery.data && communityQuery.data.data[0]
    
    const {
        isMinQuantity,
        isMaxQuantity,
        decrementQuantity,
        incrementQuantity,
        ticketData,
        isProceedingToPayment,
        buyTicketNow
    } = useCommunityTicket(community && community) 

    const {isAuthenticated} = useAuthContext()



     

    
    // const activeServiceItems = serviceItemsQuery.data && serviceItemsQuery.data.filter((serviceItem: any)=>communityItem.status == 1)


        return( 

    <> 
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
         <title>{community && community.name}</title>
         <link rel="icon" href="/favicon.png" />
      </Head>
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            {communityQuery.isLoading
                ?<Skeleton mx='1rem' startColor='#2b2b2b' endColor="#464646" height={'1rem'}/>
                :<Header/>
            }  
            <SimpleGrid mt='2' h={'100%'} columns={8} spacing='2'>
                <Flex h='100%' position={"relative"}  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} direction='column'  flex='2'>
                    
                       { communityQuery.isLoading || community === undefined || communityQuery.isError
                       ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'4.5rem'}/> 
                       :<HeroSection 
                         name={community && community.name}
                         price={community && community.price}
                         artworkHash={community && community.artworkHash}
                         logoImageHash = {community && community.logoImageHash}
                         />
                        }  

                        <Text mt={2} textStyle={'body'} layerStyle={'highPop'}>{community && community.description}</Text>
                        
                        <Flex py={5} width={'100%'} mt={6} alignItems={"baseline"} border={"2px solid"}>
                            <Text textStyle={"body"} layerStyle={"highPop"}>{community && community.name}</Text>
                            <Flex px='1em' py='.5em' mb={3} width={['100%','370px']}  alignItems='center' justifyContent={['space-between','center','flex-start']} >
                                <TicketButton
                                    isTicketsAvailable = {true} 
                                >
                                    <TicketButtonStepper 
                                        isMinQuantity={isMinQuantity}
                                        isMaxQuantity={isMaxQuantity}
                                        quantity={ticketData.quantity}
                                        decrementQuantity ={decrementQuantity}
                                        incrementQuantity = {incrementQuantity}
                                        label = {'Tickets'}
                                    />
                                    <Divider orientation='vertical' borderLeftWidth={'2px'} borderColor='brand.disabled' height='40px'/>
                                    <TicketButtonAction
                                        isAuthenticated = {isAuthenticated}
                                        isMinQuantity = {isMinQuantity}
                                        isBuyingTicket = {isProceedingToPayment}
                                        buyTicketNow={buyTicketNow}
                                    />
                                </TicketButton>
                            </Flex>
                        </Flex>

                </Flex> 

            </SimpleGrid>
          

          
        </Box> 
        </>
    // </DarkMode>
    )
}

const CommunityPageSkeleton = ()=>{
    return(
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            <Skeleton height={'1.2rem'}/>
            <SimpleGrid mt='2' h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    <Skeleton w='100%' height={'350px'}/>

                    <Skeleton my='1' height={'1rem'}/>

                    <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='2' />
                    <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='2' />

                </Flex> 
            </SimpleGrid>       
        </Box> 
    )
}








// { isOpen? <CartSummary 
//     onCloseModal={onClose} 
//     isModalOpen={isOpen} 
//     cart={cart}
//     totalCost = {50}
//     />:null}

//     {isProcessDrawerOpen?<MobileCartSummary
//       onCloseDrawer={()=>setIsProcessDrawerOpen(false)} 
//       isDrawerOpen={isProcessDrawerOpen} 
//       cart={cart}
//       totalCost = {50}
//     />:null}


  {/* cart button to only display on mobile */}
//   {cart.length>0?
//     <Box
//     display={['block','block','block','none']}
//     width='50px'
//     height='55px' 
//     position='absolute'
//     bottom ='8%'
//     right='10%'
//     >
//         <Center zIndex={2} position='absolute' borderRadius={'50%'} w='20px' h='20px' bg='tomato' color='white'>
//             <Text fontSize='12px' fontWeight='bold'>{cart.length}</Text>
//         </Center>

//          <IconButton 
//             isRound
//             onClick={()=>setIsCartDrawerOpen(true)}
//             colorScheme='teal'
//             aria-label='Open cart'
//             size='lg'
//             icon={<MdAddShoppingCart color='cyan.300'/>}
//           />
//     </Box>
// :null}