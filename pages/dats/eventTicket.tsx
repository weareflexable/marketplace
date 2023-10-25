import {useState, useEffect} from 'react'
import {Box, Text, Divider, Grid, SkeletonText, IconButton,  HStack, Flex, Skeleton, VStack, Button, SimpleGrid, GridItem} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import QRCode from 'react-qr-code'
import { useDatContext } from '../../context/DatContext'
import dayjs from 'dayjs'
import { getPlatformPaseto } from '../../utils/storage'
import { ChevronLeftIcon } from '@chakra-ui/icons' 
import request, { gql } from 'graphql-request'
import { useMutation, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { numberFormatter } from '../../utils/formatter'
import axios from 'axios'
import Head from 'next/head'
import RedeemHistory from '../../components/DatsPage/RedeemHistory'
import { useAuthContext } from '../../context/AuthContext'
import useRoleName from '../../hooks/useRoleName'
var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)


export default function EventTicket(){
    const router = useRouter()
    const {paseto} = useAuthContext()
    const {currentDat:ctx_currentDat} = useDatContext()
    const [qrCodePayload, setQrCodePayload] = useState({})
    const [isGeneratingCode, setIsGeneratingCode] = useState(true)
    const [isGeneratingPass, setIsGeneratingPass] = useState(false)
    const {ticketSecret,  quantity, ticketStatus, targetUserId, isVirtual, eventBookingId,   eventDetails, transactionHash,  id} = ctx_currentDat;

    // console.log('event',eventDetails.eventLink)

    const isRedeemed = ticketStatus === 'redeemed'

    const isTxHash = transactionHash !== ''

    const roleName = useRoleName() 

    useEffect(() => {

        let qrCodePayload;
    

        console.log( dayjs(eventDetails.startTime).add(eventDetails.duration/60, 'h').tz("UTC").format())

          qrCodePayload = {
            item:{
                id: eventDetails.id,
                type: 'event'
            },
            ticketId: id, // ticketId
            ticketSecret: ticketSecret,
            validDate: dayjs(eventDetails.startTime).add(eventDetails.duration/60, 'h').tz("UTC").format(),
            quantity: quantity,
            userId: targetUserId,
          };
     
          setQrCodePayload(qrCodePayload);
          setIsGeneratingCode(false)

  }, [id, quantity, eventDetails, targetUserId, ticketSecret]) 

  

   async function generateApplePass(){ 

    setIsGeneratingPass(true)

    const body = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apple-pass?ticketId=${id}&ticketType=event`,{
        method:'GET',
        headers:{
            "Content-Type": "application/vnd.apple.pkpass"
        } 
    })
    
    
    const blob = await body.blob()
    const newBlob = new Blob([blob],{type:'application/vnd.apple.pkpass'})
    
    setIsGeneratingPass(false)
    const blobUrl = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${eventDetails.name}.pkpass`);
    document.body.appendChild(link);
    link.click();
    // link.parentNode.removeChild(link);

    return()=>{
        window.URL.revokeObjectURL(blobUrl);
    }

   }

   const redeemHistoryQuery = useQuery({
    queryKey:['redeem-history', id], 
    queryFn:async()=>{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/tickets/redeem-history?bookingId=${eventBookingId}&ticketType=event&pageSize=50&pageNumber=1`,{
            headers:{
                "Authorization": paseto
            }
        }) 
        return res.data.data
    },
    
    enabled: eventBookingId !== undefined,
})



    const userNftQuery = gql`
        query userNftData($txHash:String!){
            ticketCreateds(where: {transactionHash: $txHash}){
                tokenID
                metaDataURI
            }
        }
    `
    
      
      const nftQuery = useQuery({
        queryKey:['nft'],
        queryFn: async()=> request(
           `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            userNftQuery,
            {txHash: transactionHash}
        ),
        enabled: isTxHash //  only call the graphql endpoint when transaction hash is available
    })

    const nftData = nftQuery.data && nftQuery.data.ticketCreateds[0]

     console.log(eventDetails?.startTime)

    return(
        <>
        <Head>
         <title>Events DAT</title>
         <link rel="icon" href="/favicon.png" />
      </Head>
        <Grid templateColumns='repeat(5, 1fr)' bg='#171717'>
            <GridItem colStart={[1,1,2]} colEnd={[6,6,5]}>
            <Flex direction='column' bg='#171717' minHeight={'100vh'} height='100%' >
                {/* header */}
                {isGeneratingCode?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'2rem'}/>:
                <Flex justifyContent={'flex-start'} alignItems='center' p='2' mb='5' height={'8vh'} borderBottom={'1px solid #242424'}>
                    <HStack ml='2' spacing={'5'}>
                        <IconButton colorScheme={'#242424'} bg='#242424' onClick={()=>router.push('/dats')} isRound icon={<ChevronLeftIcon boxSize={'5'}/>} aria-label='navigateBackToDats'/> 
                        <Text as='h1' textStyle={'h4'} color='text.300' >{eventDetails.name}</Text> 
                    </HStack>
                </Flex> 
                }

            {isGeneratingCode
            ?<TicketSkeleton/> 
            :
            <Flex direction='column'>
                    <Flex direction='column' px='9' mb='5' w='100%'>
                        <Text  as='h3' textStyle={'h3'} mb='5' color='text.300'>QR Code</Text>
                        { isRedeemed
                        ?<Flex justifyContent={'flex-start'} height={'40px'}  direction='column' alignItems='center' w='100%'>
                            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>DAT has already been redeemed</Text>
                        </Flex>
                        :dayjs().isAfter(dayjs(eventDetails.startTime).add(eventDetails.duration/60,'h'))
                        ?<Flex justifyContent={'center'} height={'20vh'} direction='column' alignItems='center' w='100%'>
                            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>DAT has expired</Text>
                        </Flex>
                        :<>
                            <Flex justifyContent={'flex-start'} direction='column' alignItems='center' w='100%'>
                                <HStack w='100%' mt={3} justifyContent={'center'} mb='2'>
                                    <Text color='text.200' textStyle={'secondary'}>Redemption Code:</Text>
                                    <Text color='accent.200' textStyle={'body'}>{ticketSecret}</Text>
                                </HStack>
                                <Box bg={'#ffffff'} padding='5'>
                                <QRCode height={'23px'} width='100%' value={JSON.stringify(qrCodePayload)}/>
                                </Box>
                            </Flex>
                            <Flex w='100%' direction='column' px='3' justifyContent='center' mt='2'>
                                {/* <Text textAlign={'center'} color='text.200' textStyle={'secondary'}>{redeemInstructions}</Text> */}
                            </Flex>
                        </>
                        }
                        {isRedeemed||dayjs().isAfter(dayjs(eventDetails.startTime).add(eventDetails.duration/60,'h'))?null:<Button mt={4} isLoading={isGeneratingPass} loadingText='Generating Apple Pass ...' colorScheme={'brand'} variant={'activeGhost'} onClick={generateApplePass}>Add Pass to Apple Wallet</Button>}
                    </Flex>  

                    <Divider borderColor={'#2b2b2b'}/>

                    <VStack px={'1rem'} mt='5' spacing='2'>
                        <VStack w='100%' spacing={2}>
                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>DAT Status</Text></Flex>
                                <Flex flex={7}> <Text color='text.300' textStyle={'secondary'}>{isRedeemed ? 'Redeemed': dayjs().isAfter(dayjs(eventDetails.startTime).add(eventDetails.duration/60,'h'))? 'Expired': 'Valid'}</Text> </Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Unit Price</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{`$${numberFormatter.from(eventDetails.price/100)}`}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Quantity</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{quantity}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Valid Until</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}>
                                    <Text color='text.300' textStyle={'secondary'}>
                                        {dayjs(eventDetails?.startTime).add(eventDetails?.duration/60,'h').tz("UTC").format('MMM DD, YYYY h A')}
                                        {/* {dayjs().(eventDetails?.startTime)}  */}
                                    </Text>
                                </Flex> 
                            </HStack>

                           
                                    <HStack w='100%'  justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                        <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Location</Text></Flex> 
                                        <Flex flex={7}>
                                {
                                    eventDetails?.eventLink !== ''
                                    ?  
                                    <Text color='brand.200' textStyle={'secondary'}> 
                                        <a target='_blank' href={eventDetails.eventLink}>{eventDetails.eventLink}</a> 
                                    </Text> 
                                   : 
                                    <Text color='brand.200' textStyle={'secondary'}> 
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${eventDetails.address.latitude},${eventDetails.address.longitude}`}>{eventDetails.address.street}</a> 
                                    </Text>

                                    }
                                    </Flex>
                                    </HStack> 


                            <HStack w='100%' justifyContent={'space-between'}   alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Contact Number</Text></Flex>
                                <Flex flex={7}><Text color='brand.200' textStyle={'secondary'}> <a href={`tel:${eventDetails.contactNumber}`}>{`+1 (${eventDetails.contactNumber.substring(2,5)}) ${eventDetails.contactNumber.substring(5,8)}-${eventDetails.contactNumber.substring(8)}`}</a></Text></Flex>
                            </HStack>


                        </VStack>
                        
                        
                        
                    </VStack> 
                    <Divider borderColor={'#2b2b2b'} my={'3rem'}/>
                        
                     <Flex px='1rem' mb='6'  alignItems={'flex-start'} direction={'column'}>
                        <Text   as='h3' alignSelf={'flex-start'}  textStyle={'h3'} mb='1' color='text.300'>Digital Access Token</Text>
                        <Text  alignSelf={'flex-start'}  textStyle={'secondary'} color='text.200'>Fun Fact: Your DAT is also an NFT that you own forever</Text>
                    </Flex>   
                    {isTxHash 
                            ?<>
                                <Flex px='1rem' flexDirection={'column'}  width={'100%'}>
                            {nftQuery.isLoading
                                ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'3rem'}/>
                                : <Box style={{maxWidth: '350px', height: '350px', position: 'relative'}} >
                                    <Image objectFit='contain'  layout='fill' loading='lazy' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${eventDetails.artworkHash}`}  alt='An image of the nft token'/>
                                 </Box>   
                            }
                        </Flex>
                        {nftQuery.isLoading
                        ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'1.5rem'}/>
                        :<VStack px={'1rem'} mt='5' width={'100%'}  mb={'6'} spacing='2'>
                            <VStack w='100%' spacing={2}>
                                <HStack w='100%'  justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                    <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Link</Text></Flex>
                                    <Flex flex={7}>
                                        <Text color='brand.200' textStyle={'secondary'}> 
                                        <a target='_blank' href={`${process.env.NEXT_PUBLIC_OPENSEA_URL}/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${nftData && nftData.tokenID}`}>View DAT on opensea</a> 
                                        </Text>
                                    </Flex>
                                </HStack>
                                <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                    <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Token ID</Text></Flex>
                                    {/* @ts-ignore */}
                                    <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>#{nftData && nftData.tokenID}</Text></Flex>
                                </HStack>
                            </VStack>
                        </VStack>}
                            </>
                            :nftQuery.isError
                            ?<RefreshNFTView refetchNFT={nftQuery.refetch}/>
                            :<NoHash/>
                    }

                            <RedeemHistory 
                                historyQuery={redeemHistoryQuery}
                                quantity={quantity}    
                                type='event'
                            />
        
                        
            </Flex>
            }
            </Flex>
            </GridItem>
        </Grid>
        </>
    )
}


const TicketSkeleton = ()=>{
    return(
    <Flex direction='column'>
        <Flex direction='column' px='9' mb='5' w='100%'>
            <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={1} skeletonHeight='2'/>
            <Skeleton startColor='#2b2b2b' endColor="#464646" height={'200px'}/>
            <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={2} spacing='4' skeletonHeight='2'/>
            <Box w='100%'>
                <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={4} spacing='4' skeletonHeight='2'/>
            </Box>
        </Flex> 
        <Flex direction='column' px='9' mb='5' w='100%'>
            <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={1} skeletonHeight='2'/>
            <Skeleton startColor='#2b2b2b' endColor="#464646" height={'200px'}/>
            <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={2} spacing='4' skeletonHeight='2'/>
            <Box w='100%'>
                <SkeletonText startColor='#2b2b2b' endColor="#464646" mt='4' noOfLines={4} spacing='4' skeletonHeight='2'/>
            </Box>
        </Flex> 
    </Flex>
    )
}



function NoHash(){
    return(
        <Flex justifyContent='center' alignItems='center' height='100%' width={"100%"}>
        <Flex direction='column' mt='2rem' border={'1px solid #333333'} p={'1rem'} borderRadius='4px' maxW={'320px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Minting NFT ...
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                Your NFT is currently being minted. Please check back later.
            </Text>
            {/* <Button variant='ghost' onClick={navigateToMarketPlace}>
                Go back to marketplace
            </Button> */}
        </Flex>
    </Flex>
    )
} 

interface RefreshNFTViewProps{
    refetchNFT: ()=>void
}
function RefreshNFTView({refetchNFT}:RefreshNFTViewProps){
    return(
        <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' minHeight='10vh' width={"100%"}>
        <Flex direction='column' maxW={'350px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Oh oh!
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                There seem to be a problem fetching your NFT data. Please be patient with use and ...
            </Text>
            <Button variant='ghost' onClick={refetchNFT}>
                Try Again
            </Button>
        </Flex>
    </Flex>
    )
} 