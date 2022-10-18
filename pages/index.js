import Head from 'next/head'

import EventSearchBar from '../components/HomePage/EventSearchBar/EventSearchBar'
import EventList from '../components/HomePage/EventList/EventList'
import {Flex,Box,Container,Grid,GridItem,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {EventListItem} from '../components/HomePage/EventList/EventList'
import {events} from '../data/events'

export default function Home() {
  return (
          // <Head>
          //   <title>Flexable app</title>
          //   <meta name="description" content="No more waiting in queue again" />
          //   <link rel="icon" href="/favicon.ico" />
          // </Head>
          <Layout>
            <Grid h='100vh' templateColumns={6} >
              <GridItem colStart={2} colEnd={6}>
                <Flex background='#f6f6f6' h='40vh' mb='5' direction='column' justifyContent='flex-end' alignItems='center'>
                  <EventSearchBar/>
                </Flex>
              </GridItem >
              <GridItem px={'2em'} gridColumnStart={1} gridColumnEnd={6}> 
                <Wrap w='100%' alignItems='center' justifyContent='center'> 
                    {events.map(event=>(
                        <WrapItem  key={event.serviceId} flex='1 22%'  borderWidth='1px' overflow='hidden'>
                            <EventListItem data={event}/>
                        </WrapItem> 
                    ))}
                </Wrap>
              </GridItem>
            </Grid>
         </Layout>
       
  )
}
