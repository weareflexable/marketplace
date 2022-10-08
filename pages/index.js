import Head from 'next/head'
import styles from '../styles/Home.module.css'
import EventSearchBar from '../components/HomePageComponents/EventSearchBar/EventSearcBar'
import EventList from '../components/HomePageComponents/EventList/EventList'
import {Flex,Box,Container} from '@chakra-ui/react'
import {events} from '../data/events'

export default function Home() {
  console.log(events)
  return (
          // <Head>
          //   <title>Flexable app</title>
          //   <meta name="description" content="No more waiting in queue again" />
          //   <link rel="icon" href="/favicon.ico" />
          // </Head>
    <Box h='100vh' >
      <Flex background='#f6f6f6' h='40%' direction='column' justifyContent='flex-end' alignItems='center'>
        <EventSearchBar/>
      </Flex>
      <Box padding='5'>
      <EventList events={events}/>
      </Box>
    </Box>
       
  )
}
