import {useEffect} from 'react'
import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Flex,Box,Container,Grid,GridItem,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useQuery} from '@tanstack/react-query'




export default function Home() {

  const {isLoading,data,isError} = useQuery(['stores'],async()=>{
    const res = await fetch('https://platform.flexabledats.com/api/v1.0/services/public?country=US&startOffSet=0')
    const body = await res.json()
    console.log(body)
    return body
  })

  if(isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }


  return (
          // <Head>
          //   <title>Flexable app</title>
          //   <meta name="description" content="No more waiting in queue again" />
          //   <link rel="icon" href="/favicon.ico" />
          // </Head>
          <Layout>
            <Grid h='100vh' gridTemplateColumns={'6'} >
              <GridItem colStart={2} colEnd={6}>
                <Flex background='#f6f6f6' h='40vh' mb='5' direction='column' justifyContent='flex-end' alignItems='center'>
                  <EventSearchBar/>
                </Flex>
              </GridItem >
              <GridItem px={'2em'} gridColumnStart={1} gridColumnEnd={6}> 
                <Wrap w='100%' alignItems='center' justifyContent='center'> 
                    {data && data.payload.map((store:Store)=>(
                        <WrapItem  key={store.id} flex='1 22%'  borderWidth='1px' overflow='hidden'>
                            <StoreCard data={store}/>
                        </WrapItem> 
                    ))}
                </Wrap>
              </GridItem>
            </Grid>
         </Layout>
       
  )
}