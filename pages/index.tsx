import Head from 'next/head'
import {Box, Button, Flex,Skeleton,Image,Text,Wrap,WrapItem, Hide} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import React from 'react'
import VenuePanel from '../components/HomePage/VenuePanel'
import CommunityPanel from '../components/HomePage/CommunityPanel'
import EventPanel from '../components/HomePage/EventPanel'
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css"; 
import Slider from 'react-slick'


 

const PAGE_SIZE = 10;

export default function Home() {

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    arrows: false
  };

 
  return (
    <>
        <Head>
          <title>Flexable</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
          <Layout>

                {/* <Flex w={['100%']} h={['40vh','30vh']} mb={['3','5']} px={['6']}   justifySelf={'center'} direction='column' justifyContent='flex-end' alignItems='flex-start'>
                  <Text  as='h1' w='100' mb={'5'} textStyle={'h1'}>Let's get you in!</Text>
                  <Text  w={['100%','100%','40%']} color={'text.300'} textStyle={'body'}>Our collection of digital access tokens (DATs) grant you exclusive access to the best venues in your area </Text>
                </Flex> */}
                <Box width={'100%'} height={'400px'} mx={[0,0]}>
                  <Hide below='md'>
                   <Image height={'100%'} width={'100%'} objectFit={'contain'} src={'/tickets -with-stripes.png'}/>
                  </Hide>
                  <Hide above='md'>
                  <Image height={'100%'} width={'100%'} objectFit={'contain'} src={'/jumbotron-mobile.png'}/>
                  </Hide>
                  {/* <Slider {...settings}>
                    <Box height={'600px'} bgPosition={'0 4rem'} >
                      <Image height={'100%'} width={'100%'} objectFit={'cover'} src='/glasses.jpg'/>
                    </Box>
                    <Box  height={'600px'} >
                      <Image height={'100%'} width={'100%'} objectFit={'cover'} src='/cocktail.jpg'/>
                    </Box>
                    <Box  height={'600px'}>
                      <Image height={'100%'} width={'100%'} objectFit={'cover'} src='/glasses-pro.jpg'/> 
                    </Box>
                  </Slider> */}
                </Box>
 
                <VenuePanel/>
                <CommunityPanel/>
                <EventPanel/>

         </Layout>
         </>
  )
}
