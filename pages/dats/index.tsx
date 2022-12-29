import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Layout from "../../components/shared/Layout/Layout";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
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


const fetchWithError = async(url:string, options:any)=>{
  const response = await fetch(url,options)

  if (response.status !== 200) throw new Error('Error in request')

  const result = await response.json()

  if (result.status !== 200) throw new Error(result.message)

  return result;
}

export default function MyBookings() {
  // TODO: fetch user specific data
  // TODO: fallback ui for when user tries to access page without authorization
  const { push } = useRouter();
  const {setDat:ctx_setDat} = useDatContext()
  const { isAuthenticated } = useAuthContext();
  const [isErrorPopup, setIsErrorPopup] = useState(false)

  const datsQuery = useQuery(["dats"], async () => {
    const paseto = getPlatformPaseto();
    const res = await fetchWithError(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/user/get-tickets`,
      {
        method: "GET",
        //@ts-ignore
        headers: {
          Authorization: paseto,
        },
      }
    );
    return res
  });


const gotoTicketPage = (dat:any)=>{
  // set selected dat in context
  ctx_setDat(dat)
  push('/dats/ticket')
}

// This sorts orders in descending order after it's received from DB
  const sortedOrders =
    datsQuery.data &&
    datsQuery.data.payload.sort((a:any,b:any)=>Number(dayjs(b.endTime))-Number(dayjs(a.endTime)));


  if (datsQuery.data && datsQuery.data.payload && datsQuery.data.payload.length<1) {
    return (
      <Layout>
        <NoData/>
      </Layout>
    );
  }

  if (!isAuthenticated && !datsQuery.isLoading) {
    return (
      <Layout>
        <UnAuthenticated/>
      </Layout>
    );
  }

  return (
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
                  datsQuery.isLoading
                  ?<OrderListSkeleton/>
                  :<OrderList
                    orders={sortedOrders}
                    gotoTicketPage={gotoTicketPage}
                   />
              
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
  );
}



