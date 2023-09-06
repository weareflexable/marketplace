import { Box, Flex, FormControl, FormHelperText, Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useState } from "react";


type ExclusiveAccess = {
    organizationId: string,
    name: string,
    price: number,
    serviceType: string,
    ticketsPerDay: number,
    description:string,
    orgServiceId: string,
    address: string,
    contactNumber: string,
    logoImageHash?: string | null | any,
    validityStartDate: string,
    validityEndDate: string,
    // serviceItemId: string
    serviceItemTypeId?: string | undefined | string[]
}


export default function ExclusiveAccess(){
    const methods = useForm<ExclusiveAccess>({
       
    })
    return(
        <Layout>
        <Grid h='100%'  layerStyle={'base'} templateColumns={'repeat(5,1fr)'} mt={'1rem'}>
            {/* <GridItem colSpan={6}>

            </GridItem> */}
            <GridItem px={['1rem','1rem',0,0]} mb='2rem' mt={'3rem'} colStart={[1,1,2,2]} colEnd={[6,6,5,4]}>
              <Heading color={'text.300'}>Create new Exclusive Access</Heading>
            </GridItem>
            <FormProvider {...methods}>
                <GridItem px={['1rem','1rem',0,0]} colStart={[1,1,2,2]} colEnd={[6,6,5,4]}>
                    <form>
                        <Stack w={'100%'} spacing={8}>
                            <FormControl mb={'1rem'} w={'50%'}>
                                <FormLabel color={'text.300'}>Select your organaization</FormLabel>
                                <Select textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('organizationId')}>
                                    <option value="flexable">Flexable organization</option>
                                    <option value="principle">Principle organization</option>
                                    <option value="Magerine">Magerine organization</option>
                                </Select>
                                <FormHelperText>
                                    Your exclusive access will be created under this organization
                                </FormHelperText>
                            </FormControl>

                            <Stack mt={'1rem'} mb={'2rem'}>
                                <Heading color={'text.200'}  size={'md'}>Select exclusive access type</Heading>
                                {/* <Box border={'1px solid #333333'}> */}
                                <FormControl >
                                    <FormLabel color={'text.300'}>Select your organaization</FormLabel>
                                    <Select textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('serviceType')}>
                                        <option value="bar">Bar</option>
                                        <option value="restaurant">Restaurant</option>
                                    </Select>
                                    <FormHelperText>
                                        Select the type of exclusive access you want to create
                                    </FormHelperText>
                                </FormControl>
                                {/* </Box> */}
                            </Stack>

                            <FormControl>
                                <FormLabel color={'text.300'}>Name</FormLabel>
                                <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Eg. Line skip service" {...methods.register('name')}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel color={'text.300'}>Address</FormLabel>
                                <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Eg. Line skip service" {...methods.register('address')}/>
                                <FormHelperText color={'text.200'}>
                                Please refresh the page if the address you selected is not being displayed in the field
                                </FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel color={'text.300'}>Contact Number</FormLabel>
                                <InputGroup size={'lg'}> 
                                <InputLeftAddon border={'inherit'} bg={'#222222'}>+1</InputLeftAddon>
                                <Input type='number' maxLength={3} textStyle={'secondary'} mr={'.5rem'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  borderRadius={'0'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                <Input type='number' maxLength={3} textStyle={'secondary'} color='text.300' mr={'.5rem'}  size='lg' borderColor={'#2c2c2c'} borderRadius={'0'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                <Input type='number' maxLength={4} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                </InputGroup>
                            </FormControl>

                            <Stack mt={'1rem'} >
                                <Heading color={'text.200'}  size={'md'}>Upload cover image</Heading>
                                {/* <Box border={'1px solid #333333'}> */}
                                <ImageUploader/>
                                {/* </Box> */} 
                            </Stack>
                        </Stack>
                    </form>
                </GridItem>
            </FormProvider>
        </Grid>
     </Layout>
    )
}

ExclusiveAccess



function ImageUploader(){
    // const {isUploading,uploadFile, secureUrl} = useCloudinary()

    const {register,setValue} = useFormContext()

    const [image, setImage] = useState('')
      
  
    const extractImage = async(e: any) => {
      //upload data here
      const file = e.target.files && e.target.files[0];
      console.log(file)
      setValue(`logoImageHash`,file)

      
  };
  
    return (
      <FormControl mb={'4rem'}> 
      <Stack spacing={4}> 
      <FormLabel htmlFor="logoImageHash">
      <Box cursor={'pointer'}>
        <Image width={'100%'} border={'1px dashed #333333'} height={'300px'}  borderRadius={'10px'}  src={'/swamp-boys.jpg'} alt="judge photo-icon"/>
      </Box>
      </FormLabel>
      <Box                    
         borderColor={'#464646'}  
         {...register(`logoImageHash`,{
            onChange: e=>extractImage(e)
         })}
         id="logoImageHash"
         as="input" 
         accept="image/x-png,image/gif,image/jpeg"
         display={'none'}
         color='text.300' 
         borderWidth='2px' 
         type='file'
         width={'100px'}
     />
     <FormHelperText>
        Please upload a PNG or JPEG that is 2400px x 1200px
     </FormHelperText>
     {/* { isUploading?<Spinner/>:null} */}
    </Stack>
     </FormControl>
    )
  }