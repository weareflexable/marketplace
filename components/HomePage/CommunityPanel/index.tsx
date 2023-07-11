import { Button, Flex, Skeleton, Wrap, WrapItem, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

import EmptyServices from "../../shared/EmptyServices/EmptyServices";
import SkeletonList from "../SkeletonList/SkeletonList";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import CommunityCard from "../CommunityCard";
import { Community } from "../../../Types/Community.types";

const PAGE_SIZE = 10;

export default function CommunityPanel(){

  const [page, setPage] = useState(1)

  const toast =  useToast()

  const infiniteCommunityQuery = useInfiniteQuery(
    ['communities'], 
    //@ts-ignore
    async({pageParam=1})=>{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/community?pageNumber=${pageParam}&pageSize=${PAGE_SIZE}`)
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



if(infiniteCommunityQuery.isError){
      toast({
      position:'top-right',
      title: 'Error fetching Communities',
      description: "Please refresh your browser",
      status: 'error',
      duration: 9000,
      isClosable: true,
    })
  }


    return(
        <Flex mt={'5rem'}  direction={"column"}>

              <Flex mx={'1rem'} mb='3rem' w={'100'} direction={'column'}>
                <Text  as='h4' w='100' mb={3} textStyle={'h2'}>Communities</Text>
                <Text color={'text.200'} textStyle={'body'}>Curated experiences grouped into one ticket for extended enjoyment</Text>
              </Flex>

                { infiniteCommunityQuery.isLoading 
                 ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                  {
                    infiniteCommunityQuery && infiniteCommunityQuery.data && infiniteCommunityQuery.data.pages.map((page:any,index:any)=>(
                      <React.Fragment key={index}>
                      {page.data.length==0
                        ?<EmptyServices/>
                        :page.data.map((data:Community)=>(
                          <WrapItem key={data.id} flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']}>
                             <Skeleton w={'100%'} isLoaded={!infiniteCommunityQuery.isLoading}>
                             <CommunityCard data={data}/>
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
               infiniteCommunityQuery.hasNextPage
               ?<Button my='6' ml={'6'} colorScheme={'brand'} variant='ghost' isLoading={infiniteCommunityQuery.isFetchingNextPage} loadingText={'Loading more...'} onClick={()=>infiniteCommunityQuery.fetchNextPage()}>Load more communities</Button>
               : null
                }
        </Flex>
    )
}