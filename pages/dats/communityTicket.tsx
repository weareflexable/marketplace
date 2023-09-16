import {useState, useEffect} from 'react'
import {Box, Text, Divider, Grid, SkeletonText, IconButton,  HStack, Flex, Skeleton, VStack, Button, SimpleGrid, GridItem, Select} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import QRCode from 'react-qr-code'
import { useDatContext } from '../../context/DatContext'
import dayjs from 'dayjs'
import { getPlatformPaseto } from '../../utils/storage'
import { ChevronLeftIcon, RepeatIcon } from '@chakra-ui/icons' 
import request, { gql } from 'graphql-request'
import { useMutation, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { numberFormatter } from '../../utils/formatter'
import axios from 'axios'
import Head from 'next/head'
import RedeemHistory from '../../components/DatsPage/RedeemHistory'
import { useAuthContext } from '../../context/AuthContext'
var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)


export default function Ticket(){

    const router = useRouter()
    const {paseto} = useAuthContext()
    const {currentDat:ctx_currentDat} = useDatContext()
    const [qrCodePayload, setQrCodePayload] = useState({})
    const [isGeneratingPass, setIsGenereatingPass] = useState(false)
    const [isGeneratingCode, setIsGeneratingCode] = useState(true)
    const {  quantity,  targetUserID, createdAt, expirationDate, ticketStatus, communityId, communityDetails, communityBookingId, validityEnd,  serviceDetails, transactionHash, serviceItemsDetails, id} = ctx_currentDat;
    const [selectedVenue, setSelectedVenue] = useState({name:'', id: '',ticketSecret:''})

    const serviceTypeName = serviceDetails && serviceDetails[0]?.serviceType[0]?.name;
    const redeemInstructions = serviceTypeName === 'Restaurant' ? 'Please show this QR code to the hostess at the restaurant' : 'Cut the line and show this QR code to the bouncer to redeem it'


    const communityDats = communityDetails && communityDetails 


    const isTxHash = transactionHash !== ''
    // const serviceItemName = serviceItemDetails[0].name
    // const address = serviceDetails[0].street

    useEffect(()=>{
        const firstVenue = communityDats.venuesDetails[0]
        setSelectedVenue({name: firstVenue.name, id: firstVenue.id, ticketSecret:firstVenue.ticketSecret})
    },[])

    useEffect(() => {

        let qrCodePayload;
    

          qrCodePayload = {
            item:{
                id: communityDats.id,
                type: 'community'
            },
            ticketId: id, // ticketId
            ticketSecret: selectedVenue.ticketSecret, // venue ticket secret
            communityVenueId: selectedVenue.id, 
            quantity: quantity,
            userId: targetUserID,
          };
    
          setQrCodePayload(qrCodePayload);
          setIsGeneratingCode(false)

  }, [id, quantity, selectedVenue, serviceItemsDetails, targetUserID, validityEnd]) 

  

  const redeemHistoryQuery = useQuery({
    queryKey:['redeem-history', id], 
    queryFn:async()=>{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tickets/redeem-history?bookingId=${id}&ticketType=community&pageSize=50&pageNumber=1`,{
            headers:{
                "Authorization": paseto 
            }
        }) 
        return res.data.data
    },
    
    enabled: id !== undefined,
})

const redemptionAggregateQuery = useQuery({
    queryKey:['redeem-history', id, selectedVenue], 
    queryFn:async()=>{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tickets/redemption-aggregate?bookingId=${communityBookingId}&venueId=${selectedVenue.id}`,{
            headers:{
                "Authorization": paseto
            }
        }) 
        return res.data.data
    },
    cacheTime:0,
    enabled: id !== undefined,
})

const redemptionAggregate = redemptionAggregateQuery && redemptionAggregateQuery.data


function refreshAggregateAndHistory(){  
    redemptionAggregateQuery.refetch()
    redeemHistoryQuery.refetch()
}

async function generateApplePass(){ 

    setIsGenereatingPass(true)
   
    const body = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apple-pass?ticketId=${id}&ticketType=community`,{
        method:'GET',
        headers:{
            "Content-Type": "application/vnd.apple.pkpass"
        } 
    })


    const blob = await body.blob()
    const newBlob = new Blob([blob],{type:'application/vnd.apple.pkpass'})

    setIsGenereatingPass(false)

    const blobUrl = window.URL.createObjectURL(newBlob); 

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${selectedVenue.name}.pkpass`);
    document.body.appendChild(link);
    link.click();
    // link.parentNode.removeChild(link);

    return()=>{
        window.URL.revokeObjectURL(blobUrl);
    }

   }


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


   const communityVenues = communityDats && communityDats.venuesDetails

   function handleVenues(e:any){
    const [name, id, ticketSecret] = e.target.value.split(',')
    setSelectedVenue({
        name: name,
        id: id,
        ticketSecret:ticketSecret
    })

   }

   const aggregateDisplay = redemptionAggregateQuery.isLoading || redemptionAggregateQuery.isRefetching
   ? <Text ml={4} textStyle={'body'} mb={5} color={'text.200'}>Fetching aggregate...</Text> 
   : redemptionAggregateQuery.isError
   ? <Text ml={4} textStyle={'body'} mb={5} color={'text.100'}>Redemption aggregate currently unavailable</Text>
   : <Flex  width={'100%'} px={2} mb={5} justifyContent='space-between'> 
        <Text  textStyle={'body'} color={'text.200'}>{redemptionAggregate && redemptionAggregate?.redeemCount}/{ quantity} redeemed</Text>   
        <Button  onClick={refreshAggregateAndHistory} isLoading={redemptionAggregateQuery.isRefetching} variant={'link'} leftIcon={<RepeatIcon/>} aria-label={'Refresh aggregate'}>Refresh</Button>
    </Flex>

//    const venueIsRedeemed = redemptionAggregate && redemptionAggregate.ticketsLeftToRedeem === 0 // determine agg using ticketsLeftToRedeem value
   const venueIsRedeemed = redemptionAggregate && quantity - redemptionAggregate.redeemCount === 0 // determine agg using ticketsLeftToRedeem value
     

    return(
        <>
        <Head>
         <title>Community DAT</title>
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
                        <Text as='h1' textStyle={'h4'} color='text.300' >{communityDats.name}</Text>
                    </HStack>
                </Flex> 
                }

            {isGeneratingCode
            ?<TicketSkeleton/> 
            :
            <Flex direction='column'>
                    <Flex direction='column' px='4' mb='5' w='100%'>
                        <Text  as='h3' textStyle={'h3'} mb='5' color='text.300'>Select Venue</Text>
                        { ticketStatus === 'redeemed'
                        ?<Flex justifyContent={'flex-start'} height={'40px'}  direction='column' alignItems='center' w='100%'>
                            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>DAT has been redeemed</Text>
                        </Flex>
                        :<> 
                            <Flex justifyContent={'flex-start'} direction='column' w='100%'>
                                <Flex width={'100%'} direction={'column'} alignItems={'flex-start'}>
                                    <Select mb={2}  onChange={handleVenues} defaultValue={selectedVenue.name} variant='filled' bg='#232323' _hover={{bg:'#333333', cursor:'pointer'}} colorScheme='brand' color='text.300' >
                                        {communityVenues&&communityVenues.map((venue:any)=>(
                                            <option key={venue.id} value={[venue.name,venue.id,venue.ticketSecret]}>{venue.name}</option>
                                            ))}
                                    </Select> 
                                    {aggregateDisplay} 
                                </Flex> 
                                {venueIsRedeemed
                                ?<Flex justifyContent={'center'} mt={3} border={'1px solid #333333'} height={'140px'}  direction='column'  alignItems='center' w='100%'>
                                    <Text p='5' textAlign={'center'} textStyle={'body'} color='text.200'>{`All tickets of ${selectedVenue.name} have been fully redeemed`}</Text>
                                </Flex>
                                :redemptionAggregateQuery.isLoading|| redemptionAggregateQuery.isRefetching
                                ?<Flex justifyContent={'center'} mt={3} border={'1px solid #333333'} height={'140px'}  direction='column'  alignItems='center' w='100%'>
                                    <Text textStyle={'body'} color={'text.200'}>Loading...</Text> 
                                 </Flex>
                                :<Flex width={'100%'} direction='column'>
                                    <HStack w='100%' mt={3}  justifyContent={'center'} mb='2'>
                                        <Text color='text.200' textStyle={'body'}>Redemption Code:</Text>
                                        <Text color='accent.200'  textStyle={'body'}>{selectedVenue.ticketSecret}</Text>
                                    </HStack>
                                    <Flex bg={'#ffffff'} justifyContent={'center'} alignItems={'center'} borderEndRadius={4} p='7'>  
                                      <QRCode height={'25px'} width='100%' value={JSON.stringify(qrCodePayload)}/>
                                    </Flex>
                                    <Flex w='100%' direction='column' px='3' justifyContent='center' mt='2'>
                                        <Text textAlign={'center'} color='text.200' textStyle={'secondary'}>{redeemInstructions}</Text>
                                    </Flex>
                                    {ticketStatus === 'complete'?null:<Button mt={4} isLoading={isGeneratingPass} loadingText='Generating Apple Pass ...' colorScheme={'brand'} variant={'activeGhost'} onClick={generateApplePass}>Add Pass to Apple Wallet</Button>}
                                </Flex>
                                }
                            </Flex>
                           
                        </> 
                        }
                       
                    </Flex>  

                    <Divider borderColor={'#2b2b2b'}/>
 
                    <VStack px={'1rem'} mt='5' spacing='2'>
                        <VStack w='100%' spacing={2}>
                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>DAT Status</Text></Flex>
                                <Flex flex={7}> <Text color='text.300' textStyle={'secondary'}>{ticketStatus==='redeemed' ? 'Completely Redeemed':ticketStatus==='partial'?'Partially Redeemed':'Valid'}</Text> </Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Unit Price</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{`$${numberFormatter.from(communityDats.price/100)}`}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Quantity</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{quantity}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Valid Until</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{dayjs(expirationDate).format('MMM DD, YYYY')}</Text></Flex>
                            </HStack>


                            {/* <HStack w='100%'  justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Location</Text></Flex>
                                <Flex flex={7}>
                                    <Text color='brand.200' textStyle={'secondary'}> 
                                        <a href={`https://www.google.com/maps/place/?q=place_id:${communityDats.address.placeId}`}>{ctx_currentDat.serviceDetails[0].street}</a> 
                                    </Text>
                                </Flex>
                            </HStack> 

                            <HStack w='100%' justifyContent={'space-between'}   alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Call</Text></Flex>
                                <Flex flex={7}><Text color='brand.200' textStyle={'secondary'}> <a href={`tel:${serviceDetails[0].contactNumber}`}>{`+1 (${serviceDetails[0].contactNumber.substring(2,5)}) ${serviceDetails[0].contactNumber.substring(5,8)}-${serviceDetails[0].contactNumber.substring(8)}`}</a></Text></Flex>
                            </HStack> */}


                        </VStack>
                        
                        
                        
                    </VStack> 
                    <Divider borderColor={'#2b2b2b'} my={'3rem'}/>
                        
                    <Flex px='1rem' mb='6'  alignItems={'flex-start'} direction={'column'}>
                        <Text   as='h3' alignSelf={'flex-start'}  textStyle={'h3'} mb='2' color='text.300'>Digital Access Token</Text>
                        <Text  alignSelf={'flex-start'}  textStyle={'secondary'} color='text.200'>Fun Fact: Your DAT is also an NFT that you own forever</Text>
                    </Flex>   
                    {isTxHash
                            ?<>
                                <Flex px='1rem' flexDirection={'column'}  width={'100%'}>
                            {nftQuery.isLoading
                                ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'3rem'}/>
                                : <Box style={{maxWidth: '350px', height: '350px', position: 'relative'}} >
                                    <Image objectFit='contain'  layout='fill' loading='lazy' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${communityDats.artworkHash}`}  alt='An image of the nft token'/>
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
                        type='community'
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