import React,{useState} from 'react'
import {Box,Input,Flex,Text} from '@chakra-ui/react'
// import type { DatePickerProps } from 'antd';
import  dayjs from 'dayjs'
// import moment from 'moment';
// @ts-ignore


interface ServiceSearchBarProps{
  onChangeDate: (date:string)=>void
  date: string | string[] | undefined,
  dates: Array<any>
}
export default function ServiceSearchBar({date,dates,onChangeDate}:ServiceSearchBarProps){





  const handleDateChange = (date: string)=>{
    // const formated = moment(date
      onChangeDate(date)
  }

    return(
      <Box px='1em'>
        <Flex alignItems='center' mt='2em'  width={'100%'}> 
            {/* <Text as='h2' height={'100%'} textStyle={'h4'} mb='4'>Pick a date</Text> */}
            <Box ml='2'  height={'40px'} display='inline-block' w='150px'  position={'relative'}>
              {
                // dates.map(date=>(
                //   <Button> </Button>
                // ))
              }
                {/* <Text color='cyan' cursor='pointer' position='absolute' left='0' top='0'>{date}</Text> */}
                {/* @ts-ignore */}
                {/* <DatePicker allowClear={false}  inputReadOnly format='MMM-D-YYYY' defaultValue={moment(ticketDate,'MMM-D-YYYY')} style={{color:'#131313'}} onChange={(date:string)=>handleDateChange(date)}/> */}
            </Box>   
        </Flex>
      </Box>
    )
} 