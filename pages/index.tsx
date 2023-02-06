import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Flex,Skeleton,Text,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { mockData } from '../data/events'
import SkeletonList from '../components/HomePage/SkeletonList/SkeletonList'





export default function Home() {


  const {isLoading,data,isError} = useQuery(['services'],async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=0&pageSize=10`,
    {
      headers:{
        "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`
      }
    })
    const body = await res.json()
    return body
  })

  

  if(isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }

  const loadedServiceList = (
    <Wrap w='100%' padding={[3,5]} spacing={5} alignItems='center' justifyContent='center'> 
    {/* {data && data.payload ? data.payload.map((store:Store)=>( */}
      {mockData? mockData.map((store:Store)=>(
        <WrapItem flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']} key={store.id}>
            {/* <Skeleton w={'100%'} isLoaded={!isLoading}> */}
              <StoreCard data={store}/>
            {/* </Skeleton> */}
        </WrapItem> 
    )):null}
</Wrap>
  )

  console.log(data.data)


 
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
                { isLoading?<SkeletonList/>:
                  <Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                      {/* {mockData? mockData.map((store:Store)=>( */}
                    {data && data.data ? data.data.map((store:Store)=>(
                        <WrapItem flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']} key={store.id}>
                            {/* <Skeleton w={'100%'} isLoaded={!isLoading}> */}
                              <StoreCard data={store}/>
                            {/* </Skeleton> */}
                        </WrapItem> 
                    )):null}
                </Wrap>
                }

         </Layout>
         </>
  )
}
