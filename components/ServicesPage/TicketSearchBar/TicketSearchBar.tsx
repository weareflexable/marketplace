import React,{useState} from 'react'
import {Box,Input,Flex,Text} from '@chakra-ui/react'
import  dayjs from 'dayjs'
// @ts-ignore
import DatePicker from 'react-datepicker'

interface ServiceSearchBarProps{
  onChangeDate: (date:string)=>void
  date: string
}
export default function ServiceSearchBar({date,onChangeDate}:ServiceSearchBarProps){



  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
      const unFormatedDate = event.target.value
      onChangeDate(dayjs(unFormatedDate).format('MMM-D-YYYY'))
  }

    return(
      <Box px='1em'>
        <Flex alignItems='center' mt='2em'  width={'100%'}> 
            <Text as='h2' height={'100%'} textStyle={'h4'} mb='4'>Pick a date</Text>
            <Box ml='2'  height={'40px'} display='inline-block' w='100px'  position={'relative'}>
                {/* <Text color='cyan' cursor='pointer' position='absolute' left='0' top='0'>{date}</Text> */}
                <Input cursor='pointer' h='100%' width='100px' type='date'   variant='unstyled'/>
            </Box>
        </Flex>
      </Box>
    )
}