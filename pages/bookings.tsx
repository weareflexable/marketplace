import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Skeleton,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Badge,
  useMediaQuery,
} from "@chakra-ui/react";
import Layout from "../components/shared/Layout/Layout";
import Ticket from "../components/shared/Ticket/Ticket";
import { useRouter } from "next/router";
import supabase from "../utils/supabase";
import { useAuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import QrCodeModal from "../components/BookingsPage/QrCodeModal/QrCodeModal";
import { getPlatformPaseto } from "../utils/storage";
import BookingsFilters from "../components/BookingsPage/BookingFilter/BookingFilter";
import QrCodeMobile from "../components/BookingsPage/QrCodeModal/QrCodeMobile/QrCodeMobile";
import axios from "axios";
import moment from "moment-timezone";

export default function MyBookings() {
  // TODO: fetch user specific data
  // TODO: fallback ui for when user tries to access page without authorization
  const { asPath, push } = useRouter();
  const { setIsAuthenticated, isAuthenticated } = useAuthContext();
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [qrSignature, setQrSignature] = useState<any>({
    tokenId: "loading",
    quantity: "loading",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState("PAYMENT_PAID");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tokenId, setTokenId] = useState(0)
  const [uniqueCode, setUniqueCode] = useState('')

  const [isLargerThan62] = useMediaQuery("(min-width: 62em)");

  const { isLoading, data, isError } = useQuery(["bookings"], async () => {
    const paseto = getPlatformPaseto();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      {
        method: "GET",
        //@ts-ignore
        headers: {
          Authorization: paseto,
        },
      }
    );
    const body = await res.json();
    return body;
  });

  async function getTokenId(txHash: string): Promise<number> {
    // It should be all lower case

    const body = {
      query: `{
          tokens( 
              where: { txHash:"${txHash}" } 
          )
          { id }
        }`,
    };
    const res = await axios.post(
      "https://api.thegraph.com/subgraphs/name/thisisommore/flexable",
      body
    );
    return +res.data.data.tokens[0].id;
  }


  const generateQrCode = async (order: any) => {

    let qrCodePayload;

    // TODO: fix this error
    // Fetch tokenId from the graph before generating qrCode signature
    const tokenId = await getTokenId(order.transactionHash);

    setTokenId(tokenId)
    setUniqueCode(order.uniqueCode)

    const payload = {
      orgServiceItemId: order.orgServiceItemId,
      orderId: order.id
    };

    isLargerThan62 ? setIsModalOpen(true) : setIsDrawerOpen(true);

    try {
      setIsGeneratingCode(true);
      const res = await fetch(
        "https://platform.flexabledats.com/api/v1.0/get-redeem-signature",
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
        userId: isAuthenticated ? supabase.auth.user()?.email : "",
      };


      setQrSignature(qrCodePayload);

    } catch (err) {
      setIsGeneratingCode(false);
      console.log(err);
    }
  };

  const selectFilterHandler = (value: string) => {
    console.log(value);
    setOrderFilter(value);
  };

  const filteredOrders =
    data &&
    data.payload.filter(
      (order: any) => orderFilter === order.paymentIntentStatus
    ).sort((a:any,b:any)=>Number(moment(b.ticketDate))-Number(moment(a.ticketDate)));

  if (!isAuthenticated) {
    return (
      <Layout>
        <Box>
          <Text color="whiteAlpha.900">
            Please login first before trying to access this page
          </Text>
        </Box>
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
            <Flex direction="column" w="100">
              {filteredOrders ? (
                <BookingsFilters onSelectFilter={selectFilterHandler} />
              ) : null}

              <Skeleton isLoaded={!isLoading}>
                {filteredOrders
                  ? filteredOrders.map((order: any) => (
                      <Flex
                        p="1em"
                        bg="blackAlpha.700"
                        mb="3"
                        w="100%"
                        direction="column"
                        key={order.id}
                      >
                        <HStack mb="1" spacing="1">
                          <Text color="whiteAlpha.700">
                            {order.serviceName}·
                          </Text>
                          {order.orderStatus === "TICKETS_ISSUED" &&
                          moment().isAfter(moment(order.ticketDate))? (
                            <Badge colorScheme={"gray"} ml="1">
                              Expired
                            </Badge>
                          ) : order.status === "REDEEMED" ? (
                            <Badge colorScheme={"yellow"} ml="1">
                              Redeemed
                            </Badge>
                          ) : (
                            <Badge colorScheme={"green"} ml="1">
                              Valid
                            </Badge>
                          )}
                        </HStack>
                        <Flex mb="1" justifyContent="space-between">
                          <Text color="whiteAlpha.900" as="h4" textStyle="h4">
                            {order.name}
                          </Text>
                          <HStack spacing="3">
                            <HStack spacing="0.5">
                              <Text color="whiteAlpha.800" textStyle="caption">
                                ${order.unitPrice / 100}
                              </Text>
                              <Text color="whiteAlpha.600" textStyle="caption">
                                x{order.quantity}
                              </Text>
                            </HStack>
                            <Text textStyle="secondary">
                              ${order.quantity * (order.unitPrice / 100)}
                            </Text>
                          </HStack>
                        </Flex>
                        <HStack mb="1" spacing="1">
                          <Text color="whiteAlpha.500">Valid on:</Text>
                          <Text color="whiteAlpha.700">
                            {moment(order.ticketDate).add(5,'hours').tz('America/New_York').format("MMM D, YYYY")}
                          </Text>
                        </HStack>

                        {/* show button only for confirmedOrders */}
                        {order.paymentIntentStatus !== "PAYMENT_PAID" ? null : (
                          <Button
                            colorScheme="cyan"
                            onClick={() => generateQrCode(order)}
                          >
                            Show Digital Access Token
                          </Button>
                        )}
                      </Flex>
                    ))
                  : null}
              </Skeleton>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>

      {/* only show on web */}
      <QrCodeModal
        tokenId={tokenId}
        uniqueCode={uniqueCode}
        isGeneratingCode={isGeneratingCode}
        qrValue={qrSignature}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />

      {/* only show on mobile */}
      <QrCodeMobile
        tokenId={tokenId}
        uniqueCode={uniqueCode}
        isGeneratingCode={isGeneratingCode}
        qrValue={qrSignature}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />
    </Layout>
  );
}
