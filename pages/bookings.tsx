import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Skeleton,
  SimpleGrid,
  Text,
  VStack,
  Grid,
  GridItem,
  useMediaQuery,
} from "@chakra-ui/react";
import Layout from "../components/shared/Layout/Layout";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import QrCodeModal from "../components/BookingsPage/QrCodeModal/QrCodeModal";
import { getPlatformPaseto } from "../utils/storage";
import BookingsFilters from "../components/BookingsPage/BookingFilter/BookingFilter";
import QrCodeMobile from "../components/BookingsPage/QrCodeModal/QrCodeMobile/QrCodeMobile";
import axios from "axios";
import UnAuthenticated from "../components/shared/UnAuthenticated/UnAuthenticated";
import { OrderList } from "../components/BookingsPage/OrderList/OrderList";
import NoData from "../components/shared/NoData/NoData";
// import moment from "moment-timezone";


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
  const { asPath, push } = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [qrSignature, setQrSignature] = useState<any>({
    tokenId: "loading",
    quantity: "loading",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tokenId, setTokenId] = useState(0)
  const [uniqueCode, setTicketSecret] = useState('')
  const [ticketDate, setTicketDate] = useState('')

  const [isLargerThan62] = useMediaQuery("(min-width: 62em)");

  const { isLoading, data, isError } = useQuery(["bookings"], async () => {
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




  const generateQrCode = async (order: any) => {

    let qrCodePayload;

    setTokenId(order.tokenId)
    setTicketSecret(order.uniqueCode)
    setTicketDate(order.endTime)

    const payload = {
      orgServiceItemId: order.orgServiceItemId,
      ticketId: order.id
    };

    isLargerThan62 ? setIsModalOpen(true) : setIsDrawerOpen(true);

    try {
      setIsGeneratingCode(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/get-redeem-signature`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          // @ts-ignore
          headers: {
            Authorization: getPlatformPaseto(),
          },
        }
      );

      setIsGeneratingCode(false);
      const body = await res.json();
      qrCodePayload = {
        ...payload,
        signature: body.payload.signature,
        validity: body.payload.validity,
        quantity: order.quantity,
        userId: body.payload.userId,
      };

      setQrSignature(qrCodePayload);

    } catch (err) {
      setIsGeneratingCode(false);
      console.log(err);
    }
  };

// This sorts orders in descending order after it's received from DB
  const sortedOrders =
    data &&
    data.payload.sort((a:any,b:any)=>Number(dayjs(b.endTime))-Number(dayjs(a.endTime)));


  if (data && data.payload && data.payload.length<1) {
    return (
      <Layout>
        <NoData/>
      </Layout>
    );
  }

  if (!isAuthenticated) {
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
        minH="100vh"
        h="100%"
        templateColumns={["1fr", "1fr", "1fr", "repeat(5, 1fr)"]}
        gap={6}
      >
        <GridItem colStart={[1, 1, 1, 2]} colEnd={[2, 2, 2, 4]}>
        <Flex width={"100%"} direction="column">
              <Box ml={[0, 6]}>
                <Heading
                  color="whiteAlpha.800"
                  as="h1"
                  fontSize={["1.5em", "2em"]}
                  mt="10"
                  mb="6"
                >
                  My Digital Access Tokens
                </Heading>
              </Box>
              <OrderList
                orders={sortedOrders}
                navigateToDatPage={()=>console.log('navigateToPage')}
              />
          </Flex>
        </GridItem>
      </Grid>

      {/* only show on web */}
      <QrCodeModal
        tokenId={tokenId}
        ticketDate={ticketDate}
        uniqueCode={uniqueCode}
        isGeneratingCode={isGeneratingCode}
        qrValue={qrSignature}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />

      {/* only show on mobile */}
      <QrCodeMobile
        tokenId={tokenId}
        ticketDate={ticketDate}
        uniqueCode={uniqueCode}
        isGeneratingCode={isGeneratingCode}
        qrValue={qrSignature}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />
    </Layout>
  );
}



