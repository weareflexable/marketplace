import { Box, Flex, FormControl, FormHelperText, Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


type Event = {
    organizationId: string,
    title: string,
    price: number,
    serviceType: string,
    totalTickets: number,
    orgServiceId: string,
    location: string,
    address: string,
    duration: number,
    venueName: string,
    contactNumber: string,
    logoImageHash?: string | null | any,
    description: string,
    // serviceItemId: string
    serviceItemTypeId?: string | undefined | string[]
}


export default function Event(){
    const methods = useForm<Event>({
    })

    const router = useRouter()
    const toast = useToast()

    const watchSelectedOrg = methods.watch('organizationId')
    
    const eventMutation = useMutation({
        mutationFn: async()=>{
            const res = await axios.post('')
            return res
        },
        onSuccess:()=>{

        },
        onError:(err)=>{
            toast({
                title: 'Error creating events',
                status: 'error',
                duration: 6000,
                isClosable: true,
                position:'top-right'
            })
        }
    })

    const eventQuery = useQuery({
        queryFn:async()=>{
            const res = await axios.get('')
            return res.data
        },
        enabled: false
    })


    function submitForm(values: any){
        console.log(values)
    }

    return(
        <Layout>
        <Grid h='100%'  layerStyle={'base'} templateColumns={'repeat(6,1fr)'} mt={'1rem'}>
            {/* <GridItem colSpan={6}>

            </GridItem> */}
            <GridItem px={['1rem','1rem',0,0]} mb='2rem' mt={'3rem'} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>
              <Heading color={'text.300'}>Create New Event</Heading>
            </GridItem>
            <FormProvider {...methods}>
                <GridItem px={['1rem','1rem',0,0]} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>
                    <form onSubmit={methods.handleSubmit(submitForm)}>
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

                            <Box>
                                <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Basic Info</Heading>
                                <Stack spacing={5} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                                    <FormControl>
                                        <FormLabel color={'text.300'}>Title</FormLabel>
                                        <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Eg. Line skip service" {...methods.register('title')}/>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel color={'text.300'}>Description</FormLabel>
                                        <Textarea rows={2}  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Eg. Line skip service" {...methods.register('description')}/>
                                    </FormControl>

                                    <FormControl w={'50%'}>
                                        <FormLabel color={'text.300'}>Price</FormLabel>
                                        <InputGroup size={'lg'}>
                                        <InputLeftAddon border={'inherit'} bg={'#222222'}>$</InputLeftAddon>
                                        <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="332" {...methods.register('price')}/>
                                        </InputGroup> 
                                    </FormControl>
                                

                                    <FormControl w={'50%'}>
                                        <FormLabel color={'text.300'}>Available DATs</FormLabel>
                                        <InputGroup size={'lg'}>
                                        <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="332" {...methods.register('totalTickets')}/>
                                        </InputGroup> 
                                    </FormControl>
                                </Stack>
                            </Box>
                            

                            <Box >
                                 <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Location Info</Heading>
                                <Stack spacing={5} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                                <FormControl>
                                    <FormLabel color={'text.300'}>Venue Name</FormLabel>
                                    <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('venueName')}/>
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={'text.300'}>Location</FormLabel>
                                    <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('location')}/>
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

                                <FormControl w={'50%'}>
                                    <FormLabel color={'text.300'}>Duration</FormLabel>
                                    <InputGroup size={'lg'}>
                                    <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="2" {...methods.register('duration')}/>
                                    <InputRightAddon border={'inherit'} bg={'#222222'}>Hrs</InputRightAddon>
                                    </InputGroup> 
                                </FormControl>
                                </Stack>
                            </Box>

                            <Box mb={'5rem'} >
                                <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Upload cover image</Heading>
                                {/* <Box border={'1px solid #333333'}> */}
                                <ImageUploader/>
                                {/* </Box> */} 
                            </Box>
                        </Stack>
                        <ButtonGroup spacing={2}>
                            <Button onClick={()=>router.back()}>Cancel</Button>
                            <Button type="submit">Create Event</Button>
                        </ButtonGroup>
                    </form>
                </GridItem>
            </FormProvider>
        </Grid>
     </Layout>
    )
}

Event



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
     <FormHelperText color={'text.200'}>
        Please upload a PNG or JPEG that is 2400px x 1200px
     </FormHelperText>
     {/* { isUploading?<Spinner/>:null} */}
    </Stack>
     </FormControl>
    )
  }