import Head from 'next/head'
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
import VenuePanel from '../components/HomePage/VenuePanel'
import CommunityPanel from '../components/HomePage/CommunityPanel'



const PAGE_SIZE = 10;

export default function Home() {


  const [serviceFilter, setServiceFilter] = useState('')
  const [page, setPage] = useState(1)

  function changeServiceFilter(filter:string){
    setServiceFilter(filter)
  }


  const serviceTypesQuery = useQuery({
    queryKey:['seviceTypes']
  , queryFn:async()=>{
    const res =  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service-types?key=status&value=1&pageSize=10&pageNumber=1`)
    return res.data.data
  },
  onSuccess:(data)=>{
    if(data.length !==0){
      const barId = data[0].id;
      setServiceFilter(barId) 
    }
  }
  
 })


  const infiniteServices = useInfiniteQuery(
    ['services',serviceFilter], 
    //@ts-ignore
    async({pageParam=1})=>{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=${pageParam}&pageSize=${PAGE_SIZE}&key2=service_type_id&value2=${serviceFilter}&itemStatus=active`)
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
      },
      enabled: serviceTypesQuery.data !== undefined && serviceFilter !== ''
    }
)

  

  if(infiniteServices.isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }



 
  return (
    <>
        <Head>
          <title>Flexable</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
          <Layout>

                <Flex w={['100%']} h={['40vh','30vh']} mb={['3','5']} px={['6']}   justifySelf={'center'} direction='column' justifyContent='flex-end' alignItems='flex-start'>
                  <Text  as='h1' w='100' mb={'5'} textStyle={'h1'}>We get you in!</Text>
                  <Text  w={['100%','100%','40%']} color={'text.300'} textStyle={'body'}>Our collection of digital access tokens (DATs) grant you exclusive access to the best venues in your area </Text>
                </Flex>
 
                <VenuePanel/>
                <CommunityPanel/>

         </Layout>
         </>
  )
}
