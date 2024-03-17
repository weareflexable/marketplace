import { Button, Flex, Skeleton, Wrap, WrapItem, Text, useToast, GridItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { Store } from "../../../Types/Stores.types";
import EmptyServices from "../../shared/EmptyServices/EmptyServices";
import SkeletonList from "../SkeletonList/SkeletonList";
import StoreCard from "../VenueCard/StoreCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

const PAGE_SIZE = 10;

export default function VenuePanel(){


  const [serviceFilter, setServiceFilter] = useState('')
  const [page, setPage] = useState(1)

  const toast = useToast()

  function changeServiceFilter(filter:string){
    setServiceFilter(filter)
  }


  const serviceTypesQuery = useQuery({
    queryKey:['seviceTypes']
  , queryFn:async()=>{
    const res =  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service-types?tatus=1&pageSize=10&pageNumber=1`)
    return res.data.data
  },
  onSuccess:(data)=>{
    if(data.length !==0){
      const barId = data[0].id;
      setServiceFilter(barId) 
    }
  }
  
 })


  const infiniteServices = useInfiniteQuery(
    ['services',serviceFilter], 
    //@ts-ignore
    async({pageParam=1})=>{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?status=1&pageNumber=${pageParam}&pageSize=${PAGE_SIZE}&serviceTypeId=${serviceFilter}&itemStatus=active`)
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
      enabled: serviceTypesQuery.data !== undefined && serviceFilter !== ''
    }
)



if(infiniteServices.isError){
   toast({
    position:'top-right',
    title: 'Error fetching Services',
    description: "Please refresh your browser",
    status: 'error',
    duration: 9000,
    isClosable: true,
  })
  }


    return(
      <GridItem colStart={2} colEnd={8}>
        <Flex mt={'7rem'}  direction={"column"}>

              {/* headers */}
              <Flex mx={'1rem'} mb='2rem' direction={'column'}>  
                <Text  as='h4' w='100' mb={3} textStyle={'h2'}>Exclusive Access</Text>
                <Text  color={'text.200'} w='100' textStyle={'body'}>Line skips, last minute reservations, events and more near you</Text>
              </Flex>

              {/* filters */}
              <Flex mx={'1rem'} mb='1rem'>
                  {serviceTypesQuery.data && serviceTypesQuery.data.map((serviceType:any)=>(
                    <Button variant={serviceType.id === serviceFilter?'accentSolid':'ghost'} colorScheme={'brand'} onClick={()=>changeServiceFilter(serviceType.id)}  textStyle={'body'} ml='.3rem' layerStyle={'highPop'} key={serviceType.id}>{serviceType.name}</Button>
                  ))}
              </Flex>

                { infiniteServices.isLoading 
                 ?<SkeletonList/>
                
                :<Wrap w='100%' padding={[3,5]} spacing={8} alignItems='center' justifyContent='center'> 
                  {
                    infiniteServices && infiniteServices.data && infiniteServices.data.pages.map((page:any,index:any)=>(
                      <React.Fragment key={index}>
                      {page.data.length==0
                        ?<EmptyServices/>
                        :page.data.map((data:Store)=>(
                          <WrapItem key={data.id} flexGrow={'1'} flexBasis={['100%','30%']} maxWidth={['100%','34%']}>
                             <Skeleton w={'100%'} isLoaded={!infiniteServices.isLoading}>
                             <StoreCard data={data}/>
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
      </GridItem>
    )
}