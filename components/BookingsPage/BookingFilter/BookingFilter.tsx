import { useRadio, useRadioGroup, HStack, Box, UseRadioProps } from "@chakra-ui/react"


function RadioCard(props:any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()
  
    return (
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          color='whiteAlpha.600'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            // boxShadow: 'outline',

          }}
          px={4}
          py={1}
        >
          {props.children}
        </Box>
      </Box>
    )
  }


  interface BookingsFiltersProps{
    onSelectFilter: (value:string)=>void
  } 
  
  // Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
  export default function BookingsFilters({onSelectFilter}:BookingsFiltersProps) {
    const options = ['PAYMENT_PAID', 'PAYMENT_PENDING']
  
    const { getRootProps, getRadioProps } = useRadioGroup({
      name: 'bookingsFilter',
      defaultValue: 'PAYMENT_PAID',
      onChange: onSelectFilter,
    })
  
    const group = getRootProps()
  
    return (
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          )
        })}
      </HStack>
    )
  }
  