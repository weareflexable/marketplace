import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
  Button,
  IconButton,
} from "@chakra-ui/react";
import Layout from "../../components/shared/Layout/Layout";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/AuthContext";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getPlatformPaseto } from "../../utils/storage";
import axios from "axios";
import UnAuthenticated from "../../components/shared/UnAuthenticated/UnAuthenticated";
import { OrderList } from "../../components/DatsPage/OrderList/OrderList";
import NoData from "../../components/shared/NoData/NoData";
// import moment from "moment-timezone";
import { ErrorBoundary } from "react-error-boundary";
import PopupError from "../../components/shared/PopupError/PopupError";
import OrderListSkeleton from '../../components/DatsPage/OrderList/SkeletonList'
import { useDatContext } from "../../context/DatContext";
import {RepeatIcon} from '@chakra-ui/icons'
import Head from "next/head";


const fetchWithError = async(url:string, options:any)=>{
  const response = await fetch(url,options)

  if (response.status !== 200) throw new Error('Error in request')

  const result = await response.json() 

  if (result.status !== 200) throw new Error(result.message)

  return result;
}

const PAGE_SIZE = 10;

const datsFilter = [{key:'services',label:'Exclusive Access'},{key:'communities', label:'Communities'},{key:'events', label:'Events'}]

export default function MyDats() {

  const { push } = useRouter();
  const {setDat:ctx_setDat} = useDatContext()
  const { isAuthenticated, paseto } = useAuthContext();
  const [isErrorPopup, setIsErrorPopup] = useState(false)
  const [isDelaying, setIsDelaying] = useState(true)
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)

  const [currentFilter, setCurrentFilter] = useState<{key:string,label:string}>(datsFilter[0])


  // Effect to check localstorage for filter value provided at the time of checkout
  useEffect(()=>{
    const filterKeyFromStorage = localStorage.getItem('filter')

    // Check whether or not filter is null
    if(filterKeyFromStorage == null){
      setIsLoadingFilters(false)
      // return function
      return
    }else{
      
      // Get the filter object
      const filter:{key:string,label:string} = datsFilter.find(filter=>filterKeyFromStorage === filter.key) || {key:'services',label:'Venues'}
      
      // set currentFilter to filter from storage
      setCurrentFilter(filter)
      setIsLoadingFilters(false)
    }
  })

  useEffect(()=>{
    const isUserComingFromPurchase = localStorage.getItem('comingFromPurchase')
    // check if user is coming from payment page
    if(isUserComingFromPurchase === 'false'){
      return
    }else{

    }
    
  })

  /* 
  * Effect for adding an extra delay before fetching user tickets to give enough
  * time to db to update
  */  
  useEffect(() => {
    let delay;
    const isUserComingFromPurchase = localStorage.getItem('comingFromPurchase')

    if(isUserComingFromPurchase === null){
      delay = 0
    }else{
      delay = 4000
    }
    
  const timeout =  setTimeout(()=>{

    setIsDelaying(false)

    // clear comingFromStorage storage value immediately after page first load
    localStorage.removeItem("comingFromPurchase")
    localStorage.removeItem("filter")
  },delay)

  return()=>{
    clearInterval(timeout)
    console.log('clear timeout')
  }
  }, [])

  const datsQuery = useInfiniteQuery(["dats",currentFilter], async ({pageParam=1}) => {
    const paseto = getPlatformPaseto();
    const res = await fetchWithError( 
      `${process.env.NEXT_PUBLIC_API_URL}/users/tickets?pageNumber=${pageParam}&pageSize=${PAGE_SIZE}&ticketType=${currentFilter.key}`,
      {
        method: "GET",
        //@ts-ignore
        headers: {
          Authorization: paseto,
        },
      }
    );
    return res
  },
  {
    getNextPageParam:(lastPage, pages)=>{
      // console.log(lastPage)

      // fetchedDataLength: pageSize and multiply by pages.length+1
      // if dataLength > fetchedDataLength, hasNextPage is true, else false
      const fetchedDataLength = PAGE_SIZE * pages.length
      const totalDataLength = lastPage.dataLength;
      // console.log(totalDataLength)
    
      if(totalDataLength < fetchedDataLength) return undefined
      return pages.length 
    },
    enabled:isAuthenticated && !isDelaying && !isLoadingFilters
  }
  );

  const totalDatsQuery = useQuery(['totalDats',currentFilter.key],async()=>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tickets?pageNumber=1&pageSize=${PAGE_SIZE}&ticketType=${currentFilter.key}`,
    {
       //@ts-ignore
      headers: {
        Authorization: paseto,
      }
    })
    return res.data.dataLength
  },{
    enabled: isAuthenticated && !isDelaying
  }
  )

  console.log('total dats query',totalDatsQuery)


function changeDatsFilter(filter:{key:string,label:string}){
  setCurrentFilter(filter)
}


const gotoTicketPage = (dat:any)=>{
  // set selected dat in context
  ctx_setDat(dat)
  push('/dats/ticket')
}

const gotoEventTicketPage = (dat:any)=>{
  // set selected dat in context
  ctx_setDat(dat)
  push('/dats/eventTicket')
}

const gotoCommunityTicketPage =(dat:any)=>{
  ctx_setDat(dat)
  push('/dats/communityTicket')
}
// This sorts orders in descending order after it's received from DB
  // const sortedOrders =
  //   datsQuery.data &&
  //   datsQuery.data.payload.sort((a:any,b:any)=>Number(dayjs(b.endTime))-Number(dayjs(a.endTime)));


  // if (datsQuery.data && datsQuery.data && datsQuery.data.length<1) {
  //   return (
  //     <Layout>
  //       <NoData/>
  //     </Layout>
  //   );
  // }

  // This gives chance to start fetching, only after it fails
  // will it show user that they're not authenticated
  if(datsQuery.isFetched && !isAuthenticated){
    return (
      <Layout>
        <UnAuthenticated/>
      </Layout>
    );
  }

  return (
    <>
    <Head>
      {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
      <title>My DAT Orders</title>
      <link rel="icon" href="/favicon.png" />
    </Head>
    <Layout>
      <Grid
        // mx="1em"
        minH="inherit"
        h="100%"
        templateColumns={["1fr", "1fr", "1fr", "repeat(5, 1fr)"]}
        gap={6}
      >
        <GridItem colStart={[1, 1, 1, 2]} colEnd={[2, 2, 2, 4]}>
        <Flex width={"100%"} direction="column">
              <Box ml={[0]} >
                <Flex px={'1rem'}  mt="10" mb="7" w={'100%'} justifyContent={'space-between'}>
                  <Text
                    as="h1"
                    textStyle='h3'
                    color='text.300'
                    >
                    My Digital Access Tokens 
                  </Text>
                  <IconButton onClick={()=>datsQuery.refetch()} colorScheme="brand" color={'brand.200'} isLoading={datsQuery.isRefetching} variant={'ghost'} aria-label={'Refresh aggregate'} icon={<RepeatIcon/>}/>
                </Flex>
                <Flex mb='2rem' w={'100%'} direction={'column'}> 
                  <Box maxWidth={'100vw'} px={'1rem'} w={'100%'}  pb={'1rem'} style={{whiteSpace:'nowrap', overflow:'auto'}} position='relative' >
                    {isLoadingFilters? <Text textStyle={'body'} color={'text.200'}>Loading filters...</Text>: datsFilter.map((filter:any)=>(
                      <Box display={'inline-block'} ml='.3rem'> 
                       <Button variant={filter.key === currentFilter.key?'accentSolid':'ghost'} colorScheme={'brand'} onClick={()=>changeDatsFilter(filter)}  textStyle={'body'} layerStyle={'highPop'} key={filter.key}>{filter.label}</Button>
                      </Box>
                      )) 
                      } 
 
                  </Box>
                  { datsQuery.isLoading || totalDatsQuery.isLoading ? null :  <Text px={'1rem'} mt={4} textStyle={'secondary'} color='text.200'>{`Total of (${totalDatsQuery && totalDatsQuery.data}) DAT`} </Text>} 
                </Flex>
              </Box> 
                {
                  datsQuery.isLoading || datsQuery.isRefetching || isDelaying
                  ?<OrderListSkeleton/>
                  :<OrderList
                    currentFilter={currentFilter.key}
                    orders={datsQuery.data && datsQuery.data.pages}
                    gotoTicketPage={gotoTicketPage}
                    gotoEventPage={gotoEventTicketPage}
                    gotoCommunityPage={gotoCommunityTicketPage}
                   />
            }
 
            {
               datsQuery.hasNextPage
               ?<Button my='4' colorScheme={'brand'} variant='ghost' isLoading={datsQuery.isFetchingNextPage} loadingText={'Loading more...'} onClick={()=>datsQuery.fetchNextPage()}>Load more DATs</Button>
               : null
                }
          </Flex>
        </GridItem>
      </Grid>

      {datsQuery.isError?
      <PopupError
        onClose={()=>setIsErrorPopup(false)}
        onRetryQuery={datsQuery.refetch}
        // @ts-ignore
        message = {datsQuery.error.message}
        isError={datsQuery.isError}
      />
      :null
      }

    </Layout>
    </>
  );
}



