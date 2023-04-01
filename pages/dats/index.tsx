import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
  Button,
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
import Head from "next/head";


const fetchWithError = async(url:string, options:any)=>{
  const response = await fetch(url,options)

  if (response.status !== 200) throw new Error('Error in request')

  const result = await response.json()

  if (result.status !== 200) throw new Error(result.message)

  return result;
}

const PAGE_SIZE = 10;
export default function MyBookings() {
  // TODO: fetch user specific data
  // TODO: fallback ui for when user tries to access page without authorization
  const { push } = useRouter();
  const {setDat:ctx_setDat} = useDatContext()
  const { isAuthenticated } = useAuthContext();
  const [isErrorPopup, setIsErrorPopup] = useState(false)
  const [isDelaying, setIsDelaying] = useState(false)

  useEffect(() => {
  const interval =  setInterval(()=>{
    setIsDelaying(true)
  },4000)
  return()=>{
    clearInterval(interval)
  }
  }, [])

  const datsQuery = useInfiniteQuery(["dats"], async ({pageParam=0}) => {
    const paseto = getPlatformPaseto();
    const res = await fetchWithError(
      `${process.env.NEXT_PUBLIC_API_URL}/users/tickets?pageNumber=${pageParam}&pageSize=${PAGE_SIZE}`,
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
    enabled:isAuthenticated && isDelaying
  }
  );

  // console.log(datsQuery.data)
  // console.log(datsQuery.hasNextPage)


const gotoTicketPage = (dat:any)=>{
  // set selected dat in context
  ctx_setDat(dat)
  push('/dats/ticket')
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
     <title>DATs</title>
     <link rel="icon" href="/favicon.png" />
  </Head>
    <Layout>
      <Grid
        mx="1em"
        minH="inherit"
        h="100%"
        templateColumns={["1fr", "1fr", "1fr", "repeat(5, 1fr)"]}
        gap={6}
      >
        <GridItem colStart={[1, 1, 1, 2]} colEnd={[2, 2, 2, 4]}>
        <Flex width={"100%"} direction="column">
              <Box ml={[0, 6]}>
                <Text
                  as="h1"
                  textStyle='h3'
                  color='text.300'
                  mt="10"
                  mb="6"
                >
                  My Digital Access Tokens
                </Text>
              </Box>
                {
                  datsQuery.isLoading || !isDelaying
                  ?<OrderListSkeleton/>
                  :<OrderList
                    orders={datsQuery.data && datsQuery.data.pages}
                    gotoTicketPage={gotoTicketPage}
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



