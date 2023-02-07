import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Button, Flex,Skeleton,Text,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { mockData } from '../data/events'
import SkeletonList from '../components/HomePage/SkeletonList/SkeletonList'
import axios from 'axios'
import { useState } from 'react'
import EmptyServices from '../components/shared/EmptyServices/EmptyServices'





export default function Home() {


  const [serviceFilter, setServiceFilter] = useState('7')

  function changeServiceFilter(filter:string){
    setServiceFilter(filter)
  }

  const {isLoading,data,isError} = useQuery(['services',serviceFilter],async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=0&pageSize=12&key2=service_type_id&value2=${serviceFilter}`,
    {
      headers:{
        "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`
      }
    })
    const body = await res.json()
    return body
  })

  const services = data && data.data
  const isServicesEmpty = data && data.data.length === 0;

  const {data:serviceTypes, isLoading:isLoadingServiceTypes} = useQuery({
    queryKey:['seviceTypes']
  , queryFn:async()=>{
    const res =  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service-types?key=status&value=1&pageSize=10&pageNumber=0`,{
      headers:{
        "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}` 
      }
    })
    return res.data 
  }})

  

  

  if(isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }

//   const loadedServiceList = (
//     <Wrap w='100%' padding={[3,5]} spacing={5} alignItems='center' justifyContent='center'> 
//     {/* {data && data.payload ? data.payload.map((store:Store)=>( */}
//       {mockData? mockData.map((store:Store)=>(
//         <WrapItem flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']} key={store.id}>
//             {/* <Skeleton w={'100%'} isLoaded={!isLoading}> */}
//               <StoreCard data={store}/>
//             {/* </Skeleton> */}
//         </WrapItem> 
//     )):null}
// </Wrap>
//   )



 
  return (
    <>
          <Head>
          <title>Flexable</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
          <Layout>

                <Flex w={['100%']} h={['20vh','40vh']} mb={['3','5']} px={['6','0']}  alignSelf={'center'} justifySelf={'center'} direction='column' justifyContent='center' alignItems='center'>
                  {/* <EventSearchBar/> */}
                  <Text  as='h1' w='100' textStyle={'h1'}>Showing you bars in Syracuse NY</Text>
                </Flex>
                <Flex mx={'1rem'} mb='1rem'>
                  {serviceTypes && serviceTypes.data.map((serviceType:any)=>(
                    <Button variant={'ghost'} colorScheme={'brand'} onClick={()=>changeServiceFilter(serviceType.id)}  textStyle={'body'} ml='.3rem' layerStyle={'highPop'} key={serviceType.id}>{serviceType.name}</Button>
                  ))}
                </Flex>
                { isLoading 
                ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                      {/* {mockData? mockData.map((store:Store)=>( */}
                    {!isServicesEmpty?services.map((store:Store)=>(
                        <WrapItem flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']} key={store.id}>
                            {/* <Skeleton w={'100%'} isLoaded={!isLoading}> */}
                              <StoreCard data={store}/>
                            {/* </Skeleton> */}
                        </WrapItem> 
                    )):<EmptyServices/>}
                </Wrap>
                }

         </Layout>
         </>
  )
}
