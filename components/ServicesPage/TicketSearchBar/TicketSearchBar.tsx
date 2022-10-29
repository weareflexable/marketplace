import React,{useState} from 'react'
import {Box,Input,Flex,Text} from '@chakra-ui/react'
// import type { DatePickerProps } from 'antd';
import {DatePicker} from 'antd'
import  dayjs from 'dayjs'
import moment from 'moment';
// @ts-ignore


interface ServiceSearchBarProps{
  onChangeDate: (date:string)=>void
  date: string
}
export default function ServiceSearchBar({date,onChangeDate}:ServiceSearchBarProps){

console.log(date)
const dateFormat = 'YYYY/MM/DD'

  const handleDateChange = (date: string)=>{
    const formated = moment(date).format('MMM-D-YYYY')
    console.log(formated)
    // console.log(moment(unFormatedDate))
      onChangeDate(formated)
  }

    return(
      <Box px='1em'>
        <Flex alignItems='center' mt='2em'  width={'100%'}> 
            <Text as='h2' height={'100%'} textStyle={'h4'} mb='4'>Pick a date</Text>
            <Box ml='2'  height={'40px'} display='inline-block' w='150px'  position={'relative'}>
                {/* <Text color='cyan' cursor='pointer' position='absolute' left='0' top='0'>{date}</Text> */}
                <DatePicker format='MMM-D-YYYY' defaultValue={moment(date,'MMM-D-YYYY')} style={{color:'#131313'}} onChange={(event:string)=>handleDateChange(event)}/>
            </Box>   
        </Flex>
      </Box>
    )
} 