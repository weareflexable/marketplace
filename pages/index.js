import Head from 'next/head'

import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import EventList from '../components/HomePage/EventList/EventList'
import {Flex,Box,Container,Grid,GridItem} from '@chakra-ui/react'
import {events} from '../data/events'

export default function Home() {
  return (
          // <Head>
          //   <title>Flexable app</title>
          //   <meta name="description" content="No more waiting in queue again" />
          //   <link rel="icon" href="/favicon.ico" />
          // </Head>
    <Grid h='100vh' templateColumns={6} >
      <GridItem colStart={2} colEnd={6}>
        <Flex background='#f6f6f6' h='40vh' mb='5' direction='column' justifyContent='flex-end' alignItems='center'>
          <EventSearchBar/>
        </Flex>
      </GridItem >
      <GridItem colStart={3} colEnd={5}> 
        {/* <Box padding='5'> */}
          <EventList events={events}/> 
        {/* </Box> */}
      </GridItem>
    </Grid>
       
  )
}
