import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Button, Flex,Skeleton,Text,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { mockData } from '../data/events'
import SkeletonList from '../components/HomePage/SkeletonList/SkeletonList'
import axios from 'axios'
import React, { useState } from 'react'
import EmptyServices from '../components/shared/EmptyServices/EmptyServices'


//@ts-ignore
const fetchServices = async({pageParams,serviceFilter})=>{
  console.log('func prams',pageParams,serviceFilter)
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=${pageParams}&pageSize=10&key2=service_type_id&value2=${serviceFilter}`,
  {
    headers:{
      "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`
    }
  })
  return res.data
}

const PAGE_SIZE = 10;

export default function Home() {


  const [serviceFilter, setServiceFilter] = useState('7')
  const [page, setPage] = useState(1)

  function changeServiceFilter(filter:string){
    setServiceFilter(filter)
  }

  const infiniteServices = useInfiniteQuery(
    ['services',serviceFilter], 
    //@ts-ignore
    async({pageParam=0})=>{
      console.log('func prams',pageParam,serviceFilter)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=${pageParam}&pageSize=${PAGE_SIZE}&key2=service_type_id&value2=${serviceFilter}`,
      {
        headers:{
          "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`
        }
      })
      return res.data
    },
    {
      getNextPageParam:(lastPage, pages)=>{

        // fetchedDataLength: pageSize and multiply by pages.length+1
        // if dataLength > fetchedDataLength, hasNextPage is true, else false
        const fetchedDataLength = PAGE_SIZE * pages.length
        const totalDataLength = lastPage.dataLength;
      
        if(totalDataLength < fetchedDataLength) return undefined
        return pages.length 
      }
    }
)

const servicesPages = infiniteServices.data && infiniteServices.data.pages
console.log(servicesPages)

  // console.log(infiniteServices.data)
  // console.log(infiniteServices.hasNextPage)

  // const services = data && data.data
  // const isServicesEmpty = data && data.data.length === 0;

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

  

  

  if(infiniteServices.isError){
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
                { infiniteServices.isLoading 
                 ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                  {
                    infiniteServices.data.pages.map((page:any,index:any)=>(
                      <React.Fragment key={index}>
                      {page.data.length==0
                        ?<EmptyServices/>
                        :page.data.map((data:Store)=>(
                          <WrapItem key={data.id} flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']}>
                             <Skeleton w={'100%'} isLoaded={!infiniteServices.isLoading}>
                             <StoreCard data={data}/>
                            </Skeleton>
                        </WrapItem> 
                        ))
                      }
                      </React.Fragment>
                    ))
                  }
                 </Wrap> 

               }
               {infiniteServices.hasNextPage?<Button my='6' ml={'6'} colorScheme={'brand'} variant='ghost' isLoading={infiniteServices.isFetchingNextPage} loadingText={'Loading more...'} onClick={()=>infiniteServices.fetchNextPage()}>Load more services</Button>: <Text textStyle={'body'} >No more data</Text> }

         </Layout>
         </>
  )
}
