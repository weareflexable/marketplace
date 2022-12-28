import {useState, useEffect} from 'react'
import {Box, Text, Divider, SkeletonText, IconButton, HStack, Flex, Skeleton, VStack, Image} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import QRCode from 'react-qr-code'
import { useDatContext } from '../../context/DatContext'
import dayjs from 'dayjs'
import { getPlatformPaseto } from '../../utils/storage'
// import {ChevronLeftIcon} from '@chakra-ui/icons'

export default function Ticket(){
    const router = useRouter()
    const {currentDat:ctx_currentDat} = useDatContext()
    const [qrCodePayload, setQrCodePayload] = useState({})
    const [isGeneratingCode, setIsGeneratingCode] = useState(true)
    const {ticketSecret, startTime, quantity, tokenId, status, endTime, orgServiceItemId, id} = ctx_currentDat



      useEffect(() => {

        const generateQrCode = async () => {

            let qrCodePayload;
        
            // request payload for getting signature to generate QR code
            const payload = {
              orgServiceItemId: orgServiceItemId,
              ticketId: id
            };
        
        
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/get-redeem-signature`,
                {
                  method: "POST",
                  body: JSON.stringify(payload),
                  // @ts-ignore
                  headers: {
                    Authorization: getPlatformPaseto(),
                  },
                }
              );
        
              const body = await res.json();
    
              qrCodePayload = {
                ...payload,
                signature: body.payload.signature,
                validity: body.payload.validity,
                quantity: quantity,
                userId: body.payload.userId,
              };
        
              setQrCodePayload(qrCodePayload);
              setIsGeneratingCode(false)
        
            } catch (err) {
              console.log(err);
              setIsGeneratingCode(false)
            }
          };
        generateQrCode()
      }, [])

    return(
        <Flex direction='column' bg='#171717' minHeight={'100vh'} height='100%' >
            {/* header */}
            <Flex justifyContent={'flex-start'} alignItems='center' p='2' mb='5' height={'7vh'} borderBottom={'1px solid #242424'}>
                <HStack ml='5' spacing={'2'}>
                    {/* <IconButton colorScheme={'#242424'} isRound icon={<ChevronLeftIcon/>} aria-label='navigateBackToDats'/> */} 
                    <Text as='h1' textStyle={'h4'} color='text.300' >Line skip + Cover</Text>
                </HStack>
            </Flex>

           {isGeneratingCode?<TicketSkeleton/>
           :
           <Flex direction='column'>
                <Flex direction='column' px='9' mb='5' w='100%'>
                    <Flex justifyContent={'flex-start'} direction='column' alignItems='center' w='100%'>
                        <HStack w='100%' justifyContent={'center'} mb='2'>
                            <Text color='text.200' textStyle={'secondary'}>Redeem Code:</Text>
                            <Text color='accent.200' mt='3'  textStyle={'body'}>{ticketSecret}</Text>
                        </HStack>
                        <QRCode height={'23px'} width='100%' value={JSON.stringify(qrCodePayload)}/>
                    </Flex>
                    <Flex w='100%' direction='column' px='3' justifyContent='center' mt='2'>
                        <Text textAlign={'center'} color='text.200' textStyle={'secondary'}>Cut the line and show this QR code to the bouncer to redeem it.</Text>
                    </Flex>
                </Flex> 

                <Divider borderColor={'#2b2b2b'}/>

                <VStack px={'1rem'} mt='5' spacing='2'>
                    <VStack w='100%' spacing={2}>
                       
                        <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                            <Text color='text.200' textStyle={'secondary'}>Status</Text>
                            <Text color='text.300' textStyle={'secondary'}>{status}</Text>
                        </HStack>

                        <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                            <Text color='text.200' textStyle={'secondary'}>Quantity</Text>
                            {/* @ts-ignore */}
                            <Text color='text.300' textStyle={'secondary'}>{quantity}</Text>
                        </HStack>

                        <HStack w='100%' spacing='2' justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                            <Text color='text.200' textStyle={'secondary'}>Valid On</Text>
                            {/* @ts-ignore */}
                            <Text color='text.300' textStyle={'secondary'}>{startTime && dayjs(startTime).format('MMM DD, YYYY')}</Text>
                        </HStack>

                        <HStack w='100%'  justifyContent={'space-between'} alignItems='flex-start' mb='1'>
                            <Text color='text.200' textStyle={'secondary'}>Location</Text>
                            <Text color='brand.200' textStyle={'secondary'}> 
                                <a href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477">314 S Franklin St Syracuse, NY 13206</a> 
                            </Text>
                        </HStack>

                        <HStack w='100%' justifyContent={'space-between'}   alignItems='flex-start' mb='1'>
                            <Text color='text.200' textStyle={'secondary'}>Call</Text>
                            <Text color='brand.200' textStyle={'secondary'}> <a href="tel:+1-315-299-4756">+1 (315) 299-4756</a></Text>
                        </HStack>


                    {/* 
                        { tokenId?
                        <HStack spacing='2' mb='1'>
                        <Text color='blackAlpha.500' textStyle={'caption'}>NFT:</Text>
                        {/* @ts-ignore */}
                        
                        {/* <Text color='cyan.700' textStyle={'caption'}>
                            <a href={`https://opensea.io/assets/matic/0x0632534712c3abef9922ce3bc587a2f27e25901f/${tokenId && tokenId}`}>View DAT on opensea</a>
                        </Text>
                        </HStack>
                        :null
                    } */} 
                    </VStack>

                            {/* <Image width={600} objectFit='fill' height={250} src={`/lineskip.png`}  alt='An image of the nft token'/> */}

                {/* <Divider/> */}


                </VStack> 
            </Flex>}
        </Flex>
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