import { Button, Flex, Skeleton, Wrap, WrapItem, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

import EmptyServices from "../../shared/EmptyServices/EmptyServices";
import SkeletonList from "../SkeletonList/SkeletonList";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import EventCard from "../EventCard";
import { Event } from "../../../Types/Event.types";


const PAGE_SIZE = 10;

export default function EventPanel(){


  const toast = useToast()


  const infiniteEventQuery = useInfiniteQuery(
    ['events'], 
    //@ts-ignore
    async({pageParam=1})=>{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/events?pageNumber=${pageParam}&pageSize=${PAGE_SIZE}`)
      return res.data
    },
    {
      getNextPageParam:(lastPage, pages)=>{

        // fetchedDataLength: pageSize and multiply by pages.length+1
        // if dataLength > fetchedDataLength, hasNextPage is true, else false
        const fetchedDataLength = PAGE_SIZE * pages.length
        const totalDataLength = lastPage.dataLength;
      
        if(totalDataLength < fetchedDataLength) return undefined
        return pages.length 
      },
    }
)



if(infiniteEventQuery.isError){
    toast({
      position:'top-right',
      title: 'Error fetching Events',
      description: "Please refresh your browser",
      status: 'error',
      duration: 9000,
      isClosable: true,
    })

    // throw new Error('Error fetching services')
  }


    return(
        <Flex mt={'5rem'}  direction={"column"}>

              <Flex mx={'1rem'} mb='3rem' w={'100'} direction={'column'}>
                <Text  as='h4' w='100' mb={3} textStyle={'h2'}>Events</Text>
                <Text color={'text.200'} textStyle={'body'}>Enjoy event services offered only by flexable</Text>
              </Flex>

                { infiniteEventQuery.isLoading 
                 ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                  {
                    infiniteEventQuery && infiniteEventQuery.data && infiniteEventQuery.data.pages.map((page:any,index:any)=>(
                      <React.Fragment key={index}>
                      {page.data.length==0
                        ?<EmptyServices/>
                        :page.data.map((data:Event)=>(
                          <WrapItem key={data.id} flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']}>
                             <Skeleton w={'100%'} isLoaded={!infiniteEventQuery.isLoading}>
                             <EventCard data={data}/>
                            </Skeleton>
                          </WrapItem> 
                        ))
                      }
                      </React.Fragment>
                    ))
                  }
                 </Wrap> 

               }
               {
               infiniteEventQuery.hasNextPage
               ?<Button my='6' ml={'6'} colorScheme={'brand'} variant='ghost' isLoading={infiniteEventQuery.isFetchingNextPage} loadingText={'Loading more...'} onClick={()=>infiniteEventQuery.fetchNextPage()}>Load more events</Button>
               : null
                }
        </Flex>
    )
}