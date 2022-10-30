import {useEffect} from 'react'
import Head from 'next/head'
import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import StoreCard from '../components/HomePage/StoreCard/StoreCard'
import {Flex,Box,Container,Grid,GridItem,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAuthContext } from '../context/AuthContext'





export default function Home() {

  const {asPath} = useRouter()


  const {isLoading,data,isError} = useQuery(['stores'],async()=>{
    const res = await fetch('https://platform.flexabledats.com/api/v1.0/services/public?startOffSet=0')
    // const res = await fetch('https://platform.flexabledats.com/api/v1.0/services/public?country=US&startOffSet=0')
    const body = await res.json()
    return body
  })

  

  if(isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }

  // get paseto from path if it exist
  const pasetoFromUrl =asPath.split('?')[1]

  useEffect(() => {
    if(pasetoFromUrl) return
    localStorage.setItem('paseto',pasetoFromUrl)
    // setIsAuthenticated(true)
  }, [])

 
  return (
    <>
          <Head>
          <title>Flexable</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
          <Layout>

                <Flex w={['100%']} h={['20vh','40vh']} mb={['3','5']} alignSelf='center' justifySelf={'center'} direction='column' justifyContent='center' alignItems='center'>
                  <EventSearchBar/>
                </Flex>

              <Flex px={'2em'} w='100vw'> 
                <Wrap w='100%' alignItems='center' justifyContent='center'> 
                    {data && data.payload ? data.payload.slice(0,1).map((store:Store)=>(
                        <WrapItem  key={store.id} flex='1 22%'  overflow='hidden'>
                            <StoreCard data={store}/>
                        </WrapItem> 
                    )):null}
                </Wrap>
              </Flex>

         </Layout>
         </>
  )
}
