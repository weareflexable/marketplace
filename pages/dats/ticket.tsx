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
var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)


export default function Ticket(){
    const router = useRouter()
    const {currentDat:ctx_currentDat} = useDatContext()
    const [qrCodePayload, setQrCodePayload] = useState({})
    const [isGeneratingCode, setIsGeneratingCode] = useState(true)
    const {ticketSecret,  quantity,  isRedeem, targetUserID, targetDate, validityStart, validityEnd,  serviceDetails, transactionHash, serviceItemsDetails, orgServiceItemId, id} = ctx_currentDat;

    const serviceTypeName = serviceDetails && serviceDetails[0]?.serviceType[0]?.name;
    const redeemInstructions = serviceTypeName === 'Restaurant' ? 'Please show this QR code to the hostess at the restaurant' : 'Cut the line and show this QR code to the bouncer to redeem it'

    const isTxHash = transactionHash !== ''
    // const serviceItemName = serviceItemDetails[0].name
    // const address = serviceDetails[0].street

    useEffect(() => {

        let qrCodePayload;
    

          qrCodePayload = {
            serviceItemId: serviceItemsDetails[0].id,
            ticketId: id, // ticketId
            ticketSecret: ticketSecret,
            validDate: validityEnd,
            quantity: quantity,
            userId: targetUserID,
          };
    
          setQrCodePayload(qrCodePayload);
          setIsGeneratingCode(false)

  }, [id, quantity, serviceItemsDetails, targetUserID, ticketSecret, validityEnd]) 

  

// console.log(ctx_currentDat)
   async function generateApplePass(){ 
    console.log(validityEnd)
    const payload = {
        qrCode: qrCodePayload,
        expiryDate: validityEnd,
        ticketSecret: ticketSecret,
        targetDate: targetDate,
        quantity: quantity,
        price: serviceItemsDetails[0].price/100,
        eventName: serviceItemsDetails[0].name,
        street: serviceDetails[0].street,
        location: {
            latitude: serviceDetails[0].latitude,
            longitude: serviceDetails[0].longitude, 
        },
    }

    const body = await fetch('/api/generatePass',{
        method:'POST',
        body: JSON.stringify(payload),
        headers:{
            "Content-Type": "application/vnd.apple.pkpass"
       } 
    })


    const blob = await body.blob()
    const newBlob = new Blob([blob],{type:'application/vnd.apple.pkpass'})

    const blobUrl = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${serviceItemsDetails[0].name}.pkpass`);
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
            'https://api.thegraph.com/subgraphs/name/weareflexable/flexablenft-mumbai',
            userNftQuery,
            {txHash: transactionHash}
        ),
        enabled: isTxHash //  only call the graphql endpoint when transaction hash is available
    })

    const nftData = nftQuery.data && nftQuery.data.ticketCreateds[0]

     

    return(
        <>
        <Head>
         <title>Ticket</title>
         <link rel="icon" href="/favicon.png" />
      </Head>
        <Grid templateColumns='repeat(5, 1fr)' bg='#171717'>
            <GridItem colStart={[1,1,2]} colEnd={[6,6,5]}>
            <Flex direction='column' bg='#171717' minHeight={'100vh'} height='100%' >
                {/* header */}
                {isGeneratingCode?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'2rem'}/>:
                <Flex justifyContent={'flex-start'} alignItems='center' p='2' mb='5' height={'8vh'} borderBottom={'1px solid #242424'}>
                    <HStack ml='5' spacing={'5'}>
                        <IconButton colorScheme={'#242424'} bg='#242424' onClick={()=>router.push('/dats')} isRound icon={<ChevronLeftIcon boxSize={'5'}/>} aria-label='navigateBackToDats'/> 
                        <Text as='h1' textStyle={'h4'} color='text.300' >{ctx_currentDat.serviceItemsDetails[0].name}</Text>
                    </HStack>
                </Flex> 
                }

            {isGeneratingCode
            ?<TicketSkeleton/> 
            :
            <Flex direction='column'>
                    <Flex direction='column' px='9' mb='5' w='100%'>
                        <Text  as='h3' textStyle={'h3'} mb='5' color='text.300'>Qr Code</Text>
                        { isRedeem
                        ?<Flex justifyContent={'flex-start'} height={'40px'}  direction='column' alignItems='center' w='100%'>
                            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>Ticket has been redeemed</Text>
                        </Flex>
                        :dayjs().isAfter(dayjs(validityEnd))
                        ?<Flex justifyContent={'center'} height={'20vh'} direction='column' alignItems='center' w='100%'>
                            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>Ticket has expired</Text>
                        </Flex>
                        :<>
                            <Flex justifyContent={'flex-start'} direction='column' alignItems='center' w='100%'>
                                <HStack w='100%' justifyContent={'center'} mb='2'>
                                    <Text color='text.200' textStyle={'secondary'}>Redeem Code:</Text>
                                    <Text color='accent.200' mt='3'  textStyle={'body'}>{ticketSecret}</Text>
                                </HStack>
                                <Box bg={'#ffffff'} padding='5'>
                                <QRCode height={'23px'} width='100%' value={JSON.stringify(qrCodePayload)}/>
                                </Box>
                            </Flex>
                            <Flex w='100%' direction='column' px='3' justifyContent='center' mt='2'>
                                <Text textAlign={'center'} color='text.200' textStyle={'secondary'}>{redeemInstructions}</Text>
                            </Flex>
                        </>
                        }
                        {isRedeem||dayjs().isAfter(dayjs(validityEnd))?null:<Button mt={4} colorScheme={'brand'} variant={'ghost'} onClick={generateApplePass}>Add to Apple Pass</Button>}
                    </Flex>  

                    <Divider borderColor={'#2b2b2b'}/>

                    <VStack px={'1rem'} mt='5' spacing='2'>
                        <VStack w='100%' spacing={2}>
                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Status</Text></Flex>
                                <Flex flex={7}> <Text color='text.300' textStyle={'secondary'}>{isRedeem ? 'Redeemed': dayjs().isAfter(dayjs(validityEnd))? 'Expired': 'Valid'}</Text> </Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Unit Price</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{`$${numberFormatter.from(serviceItemsDetails[0].price/100)}`}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Quantity</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{quantity}</Text></Flex>
                            </HStack>

                            <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Valid Until</Text></Flex>
                                {/* @ts-ignore */}
                                <Flex flex={7}><Text color='text.300' textStyle={'secondary'}>{dayjs(validityEnd).tz('America/New_York').format('MMM DD, YYYY HA z ')}</Text></Flex> 
                            </HStack>

                            <HStack w='100%'  justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Location</Text></Flex>
                                <Flex flex={7}>
                                    <Text color='brand.200' textStyle={'secondary'}> 
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${serviceDetails[0].latitude},${serviceDetails[0].longitude}`}>{ctx_currentDat.serviceDetails[0].street}</a> 
                                    </Text>
                                </Flex>
                            </HStack> 

                            <HStack w='100%' justifyContent={'space-between'}   alignItems='flex-start' mb='1'>
                                <Flex flex={3}><Text color='text.200' textStyle={'secondary'}>Call</Text></Flex>
                                <Flex flex={7}><Text color='brand.200' textStyle={'secondary'}> <a href={`tel:${serviceDetails[0].contactNumber}`}>{`+1 (${serviceDetails[0].contactNumber.substring(2,5)}) ${serviceDetails[0].contactNumber.substring(5,8)}-${serviceDetails[0].contactNumber.substring(8)}`}</a></Text></Flex>
                            </HStack>


                        </VStack>
                        
                        
                        
                    </VStack> 
                    <Divider borderColor={'#2b2b2b'} my={'3rem'}/>
                        
                    {isTxHash
                            ?<>
                                <Flex px='1rem' flexDirection={'column'}  width={'100%'}>
                            <Text  as='h3' alignSelf={'flex-start'}  textStyle={'h3'} mb='5' color='text.300'>Digital access token</Text>
                            {nftQuery.isLoading
                                ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'3rem'}/>
                                : <Box style={{maxWidth: '350px', height: '350px', position: 'relative'}} >
                                    <Image objectFit='contain'  layout='fill' loading='lazy' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${serviceItemsDetails[0].logoImageHash}`}  alt='An image of the nft token'/>
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
                                        <a href={`https://testnets.opensea.io/assets/mumbai/0xdc34c09270bfe7316854e6b58647d63616defd6d/${nftData && nftData.tokenID}`}>View DAT on opensea</a> 
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
        <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' minHeight='10vh' width={"100%"}>
        <Flex direction='column' maxW={'350px'} alignItems='center'>
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