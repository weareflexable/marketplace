import { Box, Flex, FormControl, FormHelperText,  Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext, useFieldArray} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


type Community = {
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


export default function Community(){
    const methods = useForm<Community>({
    })

    const router = useRouter()
    const toast = useToast()

    const watchSelectedOrg = methods.watch('organizationId')
    
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
      };

      const handlePrevious = () => {
        setActiveStep((prevStep) => prevStep - 1);
      };

      const steps = [
        { title: 'Basic Info',
        //  description: 'Contact Info',
         component: <BasicForm prev={handlePrevious} next={handleNext}/>
        },
        { title: 'Add Venues', 
        // description: 'Date & Time',
        component: <VenueForm/>
    }
      ]

    

    return(
        <Layout>
        <Grid h='100%'  layerStyle={'base'} templateColumns={'repeat(6,1fr)'} mt={'1rem'}>
            {/* <GridItem colSpan={6}>

            </GridItem> */}
            <GridItem px={['1rem','1rem',0,0]} mb='2rem' mt={'3rem'} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>
              <Heading color={'text.300'}>Create New Community</Heading>
            </GridItem>
            <FormProvider {...methods}>
                <GridItem px={['0','1rem','1rem',0,0]} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>

                <Stepper size={'sm'}  mx={['1rem']} index={activeStep}>
                {steps.map((step, index) => (
                    <Step key={index}> 
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        {/* <StepDescription>{step.description}</StepDescription> */}
                    </Box>

                    <StepSeparator />
                    </Step>
                ))}
                </Stepper>
                   {/* <BasicForm/> */}
                   <VenueForm/>
                </GridItem>
            </FormProvider>
        </Grid>
     </Layout>
    )
}

Community



function ImageUploader({name}:{name: string}){

    const {register,setValue} = useFormContext()
      
  
    const extractImage = async(e: any) => {
      //upload data here
      const file = e.target.files && e.target.files[0];
      console.log(file)
      setValue(name,file)

      
  };
  
    return (
      <FormControl > 
      <Stack spacing={4}> 
      <FormLabel htmlFor={name}>
      <Box cursor={'pointer'}>
        <Image width={'100%'} border={'1px dashed #333333'} height={'300px'}  borderRadius={'10px'}  src={'/swamp-boys.jpg'} alt="judge photo-icon"/>
      </Box>
      </FormLabel>
      <Box                    
         borderColor={'#464646'}  
         {...register(name,{
            onChange: e=>extractImage(e)
         })}
         id={name}
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

  interface StepProps{
    prev: ()=>void,
    next: ()=>void
  }
function BasicForm({prev,next}:StepProps){

    const methods = useForm<Community>({
    })

    const router = useRouter()

    const toast = useToast()

    const communityMutation = useMutation({
        mutationFn: async()=>{
            const res = await axios.post('')
            return res
        },
        onSuccess:()=>{

        },
        onError:(err)=>{
            toast({
                title: 'Error creating Communitys',
                status: 'error',
                duration: 6000,
                isClosable: true,
                position:'top-right'
            })
        }
    })

    const communityQuery = useQuery({
        queryFn:async()=>{
            const res = await axios.get('')
            return res.data
        },
        enabled: false
    })


    function submitForm(values: any){
        console.log(values)
        next()
    }
    return(
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
                            <FormLabel color={'text.300'}>Name</FormLabel>
                            <InputGroup size={'lg'}>
                                <InputLeftAddon border={'inherit'} bg={'#222222'} color={'text.200'}>
                                    Key to:
                                </InputLeftAddon>
                                <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Eg. Line skip service" {...methods.register('title')}/>
                            </InputGroup>
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
                    
                    </Stack>
                </Box>
                


                <Box  >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Artwork Image</Heading>
                    {/* <Box border={'1px solid #333333'}> */}
                    <ImageUploader name='artworkImage'/>
                    {/* </Box> */} 
                </Box>

                <Box >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Image Upload</Heading>
                    {/* <Box border={'1px solid #333333'}> */}
                    <ImageUploader name="logoImageHash"/>
                    {/* </Box> */} 
                </Box>

            <Box>
            <ButtonGroup mt={'2rem'} mb={'4rem'} spacing={2}> 
                <Button variant={'outline'} colorScheme="brand" onClick={()=>router.back()}>Cancel</Button>
                <Button colorScheme="brand" type="submit">Create Community</Button>
            </ButtonGroup>
            </Box>

            </Stack>
        </form>
    )
}

function VenueForm(){

    const { control, register, handleSubmit } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "venues", // unique name for your Field Array
    });

    function submitForm(values:any){
        console.log(values)
    }

    const newVenue = {
        name: '',
        promotion: '',
        marketValue: '',
        address: '',
        contactNumber: ''
    }

    return(
        <form onSubmit={handleSubmit(submitForm)}>
            {fields.map((field:any, index:number) => (
            <Stack key={field.id} mb={'1rem'} p={['1.5rem']} spacing={5} borderRadius={[0,0,8]} w={'100%'} border={'1px solid #333333'}>
                <FormControl>
                    <FormLabel color={'text.300'}>Name</FormLabel>
                    <Input textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...register(`venues.${index}.name`)} />
                </FormControl>

                <FormControl>
                 <FormLabel color={'text.300'}>Promotion</FormLabel>
                    <Textarea
                        rows={2}
                        textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'}  variant={'outline'}
                        placeholder="Buy 3 get 1 free"
                         // important to include key with field's id
                        {...register(`venues.${index}.promotion`)} 
                        />
                </FormControl>

                <FormControl >
                    <FormLabel color={'text.300'}>MarketValue</FormLabel>
                    <InputGroup w={'300px'} size={'lg'}>
                        <InputLeftAddon border={'inherit'} bg={'#222222'}>$</InputLeftAddon>
                        <Input textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...register(`venues.${index}.marketValue`)}/>
                    </InputGroup> 
                    <FormHelperText color={'text.200'}>
                        Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace
                    </FormHelperText>
                </FormControl>

                <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="North Bridge Carolina, USA" {...register(`venues.${index}.address`)}/>
                </FormControl>

                <FormControl>
                    <FormLabel color={'text.300'}>Contact Number</FormLabel>
                    <InputGroup size={'lg'}> 
                    <InputLeftAddon border={'inherit'} bg={'#222222'}>+1</InputLeftAddon>
                    <Input type='number' maxLength={3} textStyle={'secondary'} mr={'.5rem'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  borderRadius={'0'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.areaCode`)}/>
                    <Input type='number' maxLength={3} textStyle={'secondary'} color='text.300' mr={'.5rem'}  size='lg' borderColor={'#2c2c2c'} borderRadius={'0'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.midCode`)}/>
                    <Input type='number' maxLength={4} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.tailCode`)}/>
                    </InputGroup>
                </FormControl>

                <Button borderRadius={'50px'} w={'fit-content'} colorScheme="brand" variant={'outline'} onClick={()=>remove(index)}>Remove</Button>
            </Stack>
            ))}
            <Box px={['1.5rem',0,0,0]}>
                <Button
                borderRadius={'50px'} 
                onClick={() => append(newVenue)}
                variant={'outline'} 
                colorScheme="brand"
                mt={8}>Add Venue
                </Button>
                
                <Box my={'2rem'}>
                    <Button  type="submit">Create Venues</Button>
                </Box>
            </Box>
        </form>
    )
}

