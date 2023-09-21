import Head from 'next/head'
import StoreCard from '../components/HomePage/VenueCard/StoreCard'
import {Button, Flex,Skeleton,Text,Wrap,WrapItem} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import {Store} from '../Types/Stores.types'
import {useInfiniteQuery, useQuery} from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { mockData } from '../data/events'
import SkeletonList from '../components/HomePage/SkeletonList/SkeletonList'
import axios from 'axios'
import React, { useState } from 'react'
import EmptyServices from '../components/shared/EmptyServices/EmptyServices'
import VenuePanel from '../components/HomePage/VenuePanel'
import CommunityPanel from '../components/HomePage/CommunityPanel'
import EventPanel from '../components/HomePage/EventPanel'



const PAGE_SIZE = 10;

export default function Home() {



 
  return (
    <>
        <Head>
          <title>Flexable</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
          <Layout>

                <Flex w={['100%']} h={['40vh','30vh']} mb={['3','5']} px={['6']}   justifySelf={'center'} direction='column' justifyContent='flex-end' alignItems='flex-start'>
                  <Text  as='h1' w='100' mb={'5'} textStyle={'h1'}>Let's get you in!</Text>
                  <Text  w={['100%','100%','40%']} color={'text.300'} textStyle={'body'}>Our collection of digital access tokens (DATs) grant you exclusive access to the best venues in your area </Text>
                </Flex>
 
                <VenuePanel/>
                <CommunityPanel/>
                <EventPanel/>

         </Layout>
         </>
  )
}
