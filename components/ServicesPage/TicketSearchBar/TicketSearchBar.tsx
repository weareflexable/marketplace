import React,{useState} from 'react'
import {Box,Input,Flex,Text} from '@chakra-ui/react'
// import type { DatePickerProps } from 'antd';
import {DatePicker} from 'antd'
import  dayjs from 'dayjs'
// import moment from 'moment';
import moment from 'moment-timezone'
import { RangePickerProps } from 'antd/lib/date-picker'
// @ts-ignore


interface ServiceSearchBarProps{
  onChangeDate: (date:string)=>void
  date: string
}
export default function ServiceSearchBar({date,onChangeDate}:ServiceSearchBarProps){

const ticketDate = moment(date).add(5,'hours').tz('America/New_York')



const disabledDate: RangePickerProps['disabledDate'] = current => {
  // Can not select days before today and today
  return  current <= moment().endOf('day');
};

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
                {/* @ts-ignore */}
                <DatePicker disabledDate={disabledDate} inputReadOnly format='MMM-D-YYYY' defaultValue={moment(ticketDate,'MMM-D-YYYY')} style={{color:'#131313'}} onChange={(date:string)=>handleDateChange(date)}/>
            </Box>   
        </Flex>
      </Box>
    )
} 