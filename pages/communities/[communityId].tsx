import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, SkeletonText, SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery, Button, Divider} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Header from '../../components/shared/Header/Header'
import {useQuery} from '@tanstack/react-query'
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
import useCommunityTicket from '../../components/CommunityPage/hooks/useCommunityTicket'
import TicketButtonAction from '../../components/ServicesPage/TicketList/TicketButton/TicketButtonAction'
import { useAuthContext } from '../../context/AuthContext'
import { convertToAmericanFormat } from '../../utils/phoneNumberFormatter'


export default function CommunityPage(){
    

    

    const router = useRouter();


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
            <SimpleGrid mt='2'layerStyle={'base'} minH={'100%'} h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  mb='6rem'  position={"relative"}  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} direction='column'  flex='2'>
                    
                       { communityQuery.isLoading || community === undefined || communityQuery.isError
                       ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'4.5rem'}/> 
                       :<HeroSection 
                         name={community && community.name} 
                         price={community && community.price}
                         artworkHash={community && community.artworkHash}
                         description= {community && community.description}
                         logoImageHash = {community && community.logoImageHash}
                         />
                        }  

                       

                        {community && community.venuesDetails && community.venuesDetails.map((venue:any)=>(
                            <React.Fragment key={venue.id}>
                            <Flex   direction={['column','column','row']}  mx={[0]} borderRadius={'4px'} px='4' py={5} mb={3}>  
                                <Text textStyle={'h4'} mb={8} layerStyle={'highPop'} flex={1}>{venue.name}</Text>
                                <VStack alignItems={'flex-start'} mt={2}  flex={3} spacing={7}>  
  
                                    <Flex direction={'column'} >
                                        <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Promotion</Text>
                                        <Text textStyle={'body'} layerStyle={'mediumPop'}>{venue.promotion}</Text>
                                    </Flex>

                                    <Flex direction={'column'} >
                                        <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Location</Text>
                                        <Text color='brand.100' textStyle={'body'}> 
                                            <a href={`https://www.google.com/maps/place/?q=place_id:${venue.address.placeId}`}>{venue.address.fullAddress}</a> 
                                        </Text>
                                    </Flex>

                                    <Flex direction={'column'}>
                                        <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Contact </Text>
                                        <Text textStyle={'body'} layerStyle={'mediumPop'}>{convertToAmericanFormat(venue.contactNumber)}</Text> 
                                    </Flex>
                                </VStack> 
                            </Flex>
                            <Divider my={9} borderColor={'#232323'}    _last={{display:'none'}}></Divider>  
                            </React.Fragment>
                        ))}

                        

                        {/* <Flex mt={2} border={"1px solid #333333"} borderRadius={'4px'} p='1rem' mb={3}>
                            <Text textStyle={'body'} layerStyle={'highPop'} flex={1}>Mully's Restaurant</Text>
                            <VStack alignItems={'flex-start'} flex={3} spacing={1}>
                                <Text textStyle={'body'} layerStyle={'mediumPop'}>Buy 43 bottles get 3 free invoice going on with you forward</Text>
                                <Text textStyle={'body'} layerStyle={'mediumPop'}>4641 Buffalo Street, Wiscontin, United States</Text>
                                <Text textStyle={'body'} layerStyle={'highPop'}>+1 (453) 434 8543</Text> 
                            </VStack> 
                        </Flex> */}
                        

                </Flex> 
            </SimpleGrid>

            <SimpleGrid width={'100%'} position={'fixed'} bottom={'0'}  borderTop={"1px solid"} bg={"#2b2b2b"} columns={8} spacing='2'>
            <Flex  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} py={2} px={3}  width={'100%'}  alignItems={"baseline"} >
                <Text textStyle={"body"} display={['none','block']}  layerStyle={"highPop"}>{community && community.name}</Text>
                <Flex px='1em' py='.5em' width={['100%','370px']}  alignItems='center' justifyContent={['space-between','center','flex-start']} >
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