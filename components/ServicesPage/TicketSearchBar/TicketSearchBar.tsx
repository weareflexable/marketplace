import React,{useState} from 'react'
import {Box,Input,HStack,Button,FormControl} from '@chakra-ui/react'
import  dayjs from 'dayjs'

export default function ServiceSearchBar(){

  const dateHandler= (event)=>{
    console.log(dayjs(event.target.value).format('MMM-M-YYYY'))

  }

    return(
        <Box mb='6'>
          <HStack as='form' spacing={2}>
            <FormControl w='40%'>
                <Input onChange={dateHandler} type={'date'}/>
            </FormControl>
            <Button>Search service</Button>  
          </HStack>
        </Box>
    )
}