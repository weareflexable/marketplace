import { Button, Flex, Skeleton, Wrap, WrapItem, Text } from "@chakra-ui/react";
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



  const infiniteServices = useInfiniteQuery(
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



if(infiniteServices.isError){
    // TODO: create error boundary to catch this error.
    throw new Error('Error fetching stores')
  }


    return(
        <Flex mt={'3rem'}  direction={"column"}>

              <Flex mx={'1rem'} mb='3rem'>
                <Text  as='h4' w='100' textStyle={'h1'}>Communities</Text>
              </Flex>

                { infiniteServices.isLoading 
                 ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                  {
                    infiniteServices.data.pages.map((page:any,index:any)=>(
                      <React.Fragment key={index}>
                      {page.data.length==0
                        ?<EmptyServices/>
                        :page.data.map((data:Community)=>(
                          <WrapItem key={data.id} flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']}>
                             <Skeleton w={'100%'} isLoaded={!infiniteServices.isLoading}>
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
               infiniteServices.hasNextPage
               ?<Button my='6' ml={'6'} colorScheme={'brand'} variant='ghost' isLoading={infiniteServices.isFetchingNextPage} loadingText={'Loading more...'} onClick={()=>infiniteServices.fetchNextPage()}>Load more services</Button>
               : null
                }
        </Flex>
    )
}