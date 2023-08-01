import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, SkeletonText, SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery, Button, Divider, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, HStack} from '@chakra-ui/react'
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
import HeroSection from '../../components/EventPage/HeroSection'
import TicketButton from '../../components/ServicesPage/TicketList/TicketButton'
import TicketButtonStepper from '../../components/ServicesPage/TicketList/TicketButton/TicketButtonStepper'
import useEventTicket from '../../components/EventPage/hooks/useEvent'
import TicketButtonAction from '../../components/ServicesPage/TicketList/TicketButton/TicketButtonAction'
import { useAuthContext } from '../../context/AuthContext'
import { convertToAmericanFormat } from '../../utils/phoneNumberFormatter'


export default function EventPage(){
    

    

    const router = useRouter();


    const eventId  = router.query.eventId;
    
    
    const eventQuery = useQuery({
        queryKey:['single-event',eventId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/events?pageNumber=1&pageSize=10&id=${eventId}`) 
            return res.data
        },
        enabled: eventId !== undefined,
        staleTime: Infinity
    })

    
    // Confirming object is not undefined before accessing fields
    const event = eventQuery && eventQuery.data && eventQuery.data.data[0] 

    
    const {
        isMinQuantity,
        isMaxQuantity,
        decrementQuantity,
        incrementQuantity,
        ticketData,
        isProceedingToPayment,
        buyTicketNow
    } = useEventTicket(event && event) 

    const {isAuthenticated} = useAuthContext()



     


        return( 

    <> 
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
         <title>{event && event.name}</title>
         <link rel="icon" href="/favicon.png" />
      </Head> 
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            {eventQuery.isLoading
                ?<Skeleton startColor='#2b2b2b' endColor="#464646" height={'1rem'}/>
                :<Header/>
            }  
            <SimpleGrid mt='2'  minH={'100%'} h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  mb='6rem'  position={"relative"}  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} direction='column' >
                    
                       { eventQuery.isLoading || event === undefined || eventQuery.isError
                       ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'4.5rem'}/> 
                       :<HeroSection 
                         name={event && event.name} 
                         price={event && event.price}
                         artworkHash={event && event.artworkHash}
                         coverImageHash={event && event.coverImageHash}
                         description= {event && event.description}
                         logoImageHash = {event && event.logoImageHash}
                         />
                        }  

                       { eventQuery.isLoading
                       ? null
                       : 
                        // <Accordion mb={'3'} px={3}  defaultIndex={[0]} allowMultiple>
                        //             <AccordionItem  background={'#333333'} borderRadius={'4px'} border={'none'}>
                                    
                                    // <AccordionPanel pb={4}>
                                        <VStack alignItems={'flex-start'} mt={2} px={4}  flex={3} spacing={7}>   

                                            <Flex direction={'column'} >
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Tickets Left</Text>
                                                <Text textStyle={'body'} layerStyle={'mediumPop'}>{`${event.ticketsAvailable}`}</Text>
                                            </Flex>

                                            <Flex direction={'column'} >
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Date and Time</Text>
                                                <HStack spacing={1}>
                                                    <Text textStyle={'secondary'} layerStyle={'mediumPop'} lineHeight='tight' noOfLines={2}>
                                                        {dayjs(event.startTime).tz("UTC").format('MMM DD, YYYY h A')} {event.timeZone} 
                                                    </Text>
                                                </HStack>
                                            </Flex>

                                            <Flex direction={'column'} >
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Duration</Text>
                                                <Text textStyle={'body'} layerStyle={'mediumPop'}>{`${event.duration/60} Hrs`}</Text>
                                            </Flex>


                                            <Flex direction={'column'} >
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Venue name</Text>
                                                <Text textStyle={'body'} layerStyle={'mediumPop'}>{event.locationName}</Text>
                                            </Flex>

                                            <Flex direction={'column'} >
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Location</Text>
                                                <Text color='brand.100' textStyle={'body'}> 
                                                    <a href={`https://www.google.com/maps/place/?q=place_id:${event.address.placeId}`}>{event.address.fullAddress}</a> 
                                                </Text>
                                            </Flex>

                                            <Flex direction={'column'}>
                                                <Text textStyle={'caption'} mb={3} letterSpacing={1}  textTransform={'uppercase'} layerStyle={'highPop'}>Contact </Text>
                                                <Text textStyle={'body'} color='brand.100' layerStyle={'mediumPop'}> <a href={`tel:${event.contactNumber}`}>{convertToAmericanFormat(event.contactNumber)}</a> </Text> 
                                            </Flex>
                                        </VStack>
                        //             </AccordionPanel>
                        //             </AccordionItem>
                        //   </Accordion>
                          
                        }

                        

                </Flex> 
            </SimpleGrid>

            <SimpleGrid width={'100%'} position={'fixed'} bottom={'0'}  borderTop={"1px solid"} bg={"#2b2b2b"} columns={8} spacing='2'>
            <Flex  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} py={2} px={3}  width={'100%'}  alignItems={"baseline"} >
                <Text textStyle={"body"} display={['none','block']}  layerStyle={"highPop"}>{event && event.name}</Text>
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
                            label = {'DATs'}
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

const EventPageSkeleton = ()=>{
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







