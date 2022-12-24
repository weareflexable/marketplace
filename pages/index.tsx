import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Flex, Text, Wrap, WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { mockData } from '../data/events'
import SkeletonList from '../components/HomePage/SkeletonList/SkeletonList'





export default function Home() {


  const {isLoading,data,isError} = useQuery(['stores'],async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/public?startOffSet=0`,
    {
      headers:{
        "Authorization":'v4.local.v17L4FzidZy1uzcGkjUeIusFSvxl2a5zUpWofhMnrmRVXrv9efnmwOe5SNtxB693aZVn1Hm5sbJLwm3UkKnAZFZhAqRGKeHcBy_cq-Bimua2jO6H2Z7i8ZZMtxn88PybteJx4xMzM2lL0e0eUv-gqKAX9o_7iDFfhgqG793vcJ1Q8p-DGMiO-GRNSzzCb-FSDtpAXUkbKBgGGrcHB_IKVnTL'
      }
    })
    const body = await res.json()
    return body
  })

  

  if(isError){
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

                <Flex w={['100%']} h={['20vh','40vh']} mb={['3','5']} px={['6','0']}  alignSelf={'center'} justifySelf={'center'} direction='column' justifyContent='center' alignItems='center'>
                  {/* <EventSearchBar/> */}
                  <Text  as='h1' w='100' textStyle={'h3'}>Showing you bars in Syracuse NY</Text>
                </Flex>

                <SkeletonList/>

         </Layout>
         </>
  )
}
