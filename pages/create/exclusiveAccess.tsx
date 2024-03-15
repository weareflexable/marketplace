import { Box, Flex, FormControl, Text, FormHelperText,  Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, chakra, Popover, PopoverBody, PopoverContent, UnorderedList, PopoverTrigger, Portal, ListItem, Card, CardBody, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, IconButton, Link } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext, useFieldArray} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AddIcon, ArrowUpIcon, InfoOutlineIcon, MinusIcon } from "@chakra-ui/icons";
import { asyncStore } from "../../utils/nftStorage";
import { useAuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import { PLACEHOLDER_HASH } from "../../constants";
import useRole from "../../hooks/useRole";
import useRoleName from "../../hooks/useRoleName";


type IExclusiveAccess = {
    organizationId: string,
    title: string,
    price: number,
    name: string,
    totalTickets: number,
    ticketsPerDay: number,
    serviceType: string,
    orgServiceId: string,
    location: string,
    address: string,
    duration: number,
    venueName: string,
    validityStartDate: string,
    validityEndDate: string,
    contactNumber: string,
    logoImageHash?: string | null | any,
    artworkHash?:string,
    description: string,
    // serviceItemId: string
    serviceItemTypeId?: string | undefined | string[]
}


export default function ExclusiveAccess(){
    const methods = useForm<IExclusiveAccess>({
    })

    const router = useRouter() 
    const toast = useToast()

    const [createdItemId, setCreatedItemId] = useState('')
    
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = (data:any) => {
        console.log('getting from next fun',data)
        setCreatedItemId(data.id)
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
        { title: 'Custom Availability', 
        // description: 'Date & Time',
        component: <CustomAvailability serviceItemId = {createdItemId} />
    }
      ]
    

    return(
        <Layout>
        <Grid h='100%'  layerStyle={'base'} templateColumns={'repeat(6,1fr)'} mt={'1rem'}>
            {/* <GridItem colSpan={6}>

            </GridItem> */}
            <GridItem px={['1rem','1rem',0,0]} mb='2rem' mt={'3rem'} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>
              <Heading mx={'1rem'} color={'text.300'}>Create Exclusive Access</Heading>
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
                        <StepTitle><Text color={'text.300'}>{step.title}</Text></StepTitle>
                    </Box>
                    <StepSeparator />
                    </Step>
                ))}
                </Stepper>
                   {steps[activeStep].component}
                </GridItem> 
            </FormProvider>
        </Grid>
     </Layout>
    )
}




  interface StepProps{
    prev: ()=>void,
    next: (data:any)=>void
  }
function BasicForm({prev,next}:StepProps){

    const [selectedLogoImage, setSelectedLogoImage] = useState<string|undefined>()





    const methods = useForm<IExclusiveAccess>({
    })

    const {paseto} = useAuthContext()

    const router = useRouter()

    const toast = useToast()

    const watchOrg = methods.watch('organizationId')
    const watchServiceType = methods.watch('serviceType')
    const watchServiceItemTypeId = methods.watch('serviceItemTypeId')


    const parsedSelectedOrg = watchOrg && JSON.parse(watchOrg)
    const extractedOrgId =  parsedSelectedOrg && parsedSelectedOrg.orgId
    const isBankConnected = parsedSelectedOrg?.isBankConnected

 
    const roleName = useRoleName()
    

    const userOrgsQuery = useQuery({
        queryKey:['user-organizations',paseto],
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/orgs?pageNumber=1&pageSize=30&status=1`,{
                headers:{
                    'Authorization': paseto 
                }
            }) 
            return res.data.data
        },
        enabled: paseto !== undefined && paseto !== null && roleName !== ''
    })

    const orgServicesQuery = useQuery({
        queryKey:['orgs-service',paseto,watchOrg],
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/services?pageNumber=1&pageSize=50&orgId=${watchOrg}`,{
                headers:{
                    'Authorization': paseto
                }
            }) 
            return res.data.data
        },
        enabled: watchOrg !== undefined && paseto !== null && watchOrg !== ''  
    })

    const serviceTypeId = orgServicesQuery?.data?.find((service:any)=>service.id === watchServiceType)?.serviceTypeId


    

    const serviceItemTypesQuery = useQuery({
        queryKey:['service-item-types',paseto,serviceTypeId],
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/service-item-types?pageNumber=1&pageSize=50&serviceTypeId=${serviceTypeId}`,{
                headers:{
                    'Authorization': paseto 
                }
            }) 
            return res.data.data 
        },
        enabled: serviceTypeId !== undefined && paseto !== null 
    })


    const serviceItemTypeName  =   serviceItemTypesQuery?.data?.find((serviceType:any)=>serviceType.id === watchServiceItemTypeId)?.name



  

    const exclusiveAccessMutation = useMutation({
        mutationFn: async(payload:any)=>{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/service-items`,payload,{
                headers:{
                    'Authorization': paseto
                }
            })
            return res.data
        },
        onSuccess:(data)=>{
            console.log('results',data.data[0])
            toast({
                title: 'Successfully created service item',
                duration: 3000,
                isClosable: true,
                position:'top-right',
                status:'success'
            })
            next(data.data[0])
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

  

    function submitForm(values: any){
        const payload = {
            ...values, 
            validityStartDate: dayjs(values.validityStartDate).format(),
            validityEndDate: dayjs(values.validityEndDate).format(),
            status: isBankConnected? '1': '4',
            orgServiceId: values.serviceType,
            price: String(values.price * 100) // convert price to cents before sending to backend
        }
        delete payload.organizationId
        delete payload.serviceType

        exclusiveAccessMutation.mutate(payload)
    }

    function handleImageSelect(imageHash:string){
        // set image state
        setSelectedLogoImage(imageHash)
        // set value in form
        methods.setValue('logoImageHash',imageHash) 
    }


    return(
        <FormProvider {...methods}>    
        <form onSubmit={methods.handleSubmit(submitForm)}>
            <Stack w={'100%'} mt={'4rem'} spacing={8}>
 
               { userOrgsQuery.isLoading || userOrgsQuery.isRefetching
               ? <Spinner/>
               : userOrgsQuery.isError
               ?  <Flex p={8} justifyContent={'center'} direction={'column'} alignItems={'center'} border={'1px solid'}>
                    <Text textAlign={'center'} color={'text.300'} textStyle={'body'} width={'100%'}>It appears we had a problem fetching your organizations, please try it again</Text>
                    <Button mt={3} variant={'link'} onClick={()=>userOrgsQuery.refetch()}>Try again</Button> 
                </Flex>
               : userOrgsQuery?.data?.length < 1
               ? <Flex p={8} justifyContent={'center'} alignItems={'center'} border={'1px solid'}>
                    <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It seems like you are not a part of any organization. Get started creating one on <Link color={'brand.300'} target="_blank" textDecoration={'underline'} colorScheme="brand" href={`https://portal.dev.flexabledats.com`}>Flexable Portal</Link></Text> 
                </Flex>
               :<Box>
                    <FormControl mb={'1rem'} px={['1rem']} w={['90%','100%','70%']}>
                        <FormLabel ml={'.8rem'} color={'text.300'}>Organization</FormLabel>
                        <Select textStyle={'secondary'} color='text.300' placeholder="Select organization"  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('organizationId',{required:true})}>
                            {userOrgsQuery?.data?.map((userOrg:any)=>(
                                <option key={userOrg.orgId} value={userOrg.orgId}>{userOrg.name}</option> 
                            ))}
                            {/* <option value="principle">Principle organization</option>
                            <option value="Magerine">Magerine organization</option> */}
                        </Select>
                        <FormHelperText color={'text.200'}> 
                            Your exclusive access will be created under this organization
                        </FormHelperText>
                    </FormControl>
                </Box>
                }

                {
                watchOrg !== undefined  && watchOrg !== ''
                ?
                <>
                 { orgServicesQuery.isLoading || orgServicesQuery.isRefetching
                 ? <Spinner/> 
                 : orgServicesQuery.isError 
                 ?   <Flex p={8} justifyContent={'center'} direction={'column'} alignItems={'center'} border={'1px solid'}>
                        <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It appears we had a problem fetching your services, please try it again</Text>
                        <Button mt={3} variant={'link'} onClick={()=>orgServicesQuery.refetch()}>Try again</Button> 
                    </Flex> 
                 :orgServicesQuery?.data?.length < 1  
                 ? <Flex p={8} justifyContent={'center'} alignItems={'center'} border={'1px solid'}>
                        <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It seems like you do not have a service created under the selected organization. Try selecting a different organization or configure a new one on <Link color={'brand.300'} target="_blank" textDecoration={'underline'} colorScheme="brand" href={`https://portal.dev.flexabledats.com`}>Flexable Portal</Link></Text> 
                    </Flex>
                 : <Box>
                        {/* <Heading mb={'2rem'} ml={'1rem'} size={'md'}>Select your organization</Heading>  */}
                        <FormControl mb={'1rem'} px={['1rem']} w={['90%','100%','70%']}>
                            <FormLabel ml={'.8rem'} color={'text.300'}>Select service type</FormLabel>
                            <Select textStyle={'secondary'} color='text.300' placeholder="Select service"  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('serviceType',{required:true})}>
                                {
                                    orgServicesQuery?.data?.map((service:any)=>(
                                         <option key={service.id} value={service.id}>
                                           {service.name}
                                         </option>
                                        ))
                                }
                            </Select>
                            {/* <FormHelperText color={'text.200'}> 
                                Your exclusive access will be created under this organization
                            </FormHelperText> */}
                        </FormControl>
                    </Box>
                 }
                    
                 </>
                :
                null
                }

                {
                serviceTypeId !== undefined 
                ?
                <>
                 {serviceItemTypesQuery.isLoading
                 ?<Spinner/> 
                 : serviceItemTypesQuery?.data.length < 1  
                 ? <Flex p={8} justifyContent={'center'} alignItems={'center'} border={'1px solid'}> <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>Sorry it seems as though they are not exclusive access types available on the platform, please reach out to support team for assistance. Thank you</Text> </Flex>
                 : <Box>
                        {/* <Heading mb={'2rem'} ml={'1rem'} size={'md'}>Select your organization</Heading>  */}
                        <FormControl mb={'1rem'} px={['1rem']} w={['90%','100%','70%']}>
                            <FormLabel ml={'.8rem'} color={'text.300'}>Select exclusive access type</FormLabel>
                            <Select textStyle={'secondary'} color='text.300' placeholder="Select service item type"  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('serviceItemTypeId',{required:true})}>
                                {
                                    serviceItemTypesQuery?.data.map((type:any)=>(
                                         <option key={type.id} value={type.id}>
                                          {type.name}
                                         </option>
                                        ))
                                }

                            </Select>
                            {/* <FormHelperText color={'text.200'}> 
                                Your exclusive access will be created under this organization
                            </FormHelperText> */}
                        </FormControl>
                    </Box>
                 }
                    
                 </> 
                :
                null
                } 

                   {
                        watchOrg !== undefined && watchOrg !== ''  && !isBankConnected
                        ? 
                        <Box p='1rem' bgColor={'#281706'} border={'1px solid'} borderColor={'yellow.700'} borderRadius={5}>
                            <Flex mb={2} justifyContent={'space-between'}>
                                <HStack >
                                    <InfoOutlineIcon color={'yellow.300'} /> 
                                    <Heading color={'text.300'} size={'sm'}>Connect an account</Heading>
                                </HStack>
                                <Link color={'yellow.300'} target="_blank" textDecoration={'none'} colorScheme="brand" href={`https://portal.dev.flexabledats.com`}>Connect</Link>
                            </Flex>
                            <Text color={'text.300'}>Your events will not be listed on marketplace because you are still yet to add a bank account. Your events will be saved as drafts until an account is linked to your profile. However, free events can be created without an account connected </Text>
                        </Box>
                        :null
                    }    
 
                {watchServiceItemTypeId !== undefined && watchServiceType !== undefined && watchServiceType !== '' && watchServiceItemTypeId !== '' &&  orgServicesQuery?.data?.length > 0 ? 
                <>
                <Box>
                    {/* <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Basic Info</Heading> */}
                    <Stack spacing={8} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                        <FormControl>
                            <FormLabel color={'text.300'}>Title</FormLabel>
                            <InputGroup size={'lg'}>
                                <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('name',{required:true})}/>
                            </InputGroup> 
                        </FormControl>

                        <FormControl>
                            <FormLabel color={'text.300'}>Description</FormLabel>
                            <Textarea rows={2}  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('description',{required:true})}/>
                        </FormControl>

                        {/* price and tickets per day */}
                        <HStack>
                            <FormControl w={'50%'}>
                                <FormLabel color={'text.300'}>Price</FormLabel>
                                <InputGroup size={'lg'}>
                                <InputLeftAddon color={'text.200'} border={'inherit'} bg={'#222222'}>$</InputLeftAddon>
                                <Input type="number"  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...methods.register('price',{valueAsNumber:true, required:true})}/>
                                </InputGroup> 
                            </FormControl>

                            <FormControl w={'50%'}>
                                <FormLabel color={'text.300'}>Tickets Per Day</FormLabel>
                                <InputGroup  size={'lg'}>
                                    <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...methods.register('ticketsPerDay',{valueAsNumber:true, required:true})}/>
                                   <Box hideBelow={'md'}>
                                    <InputRightAddon  border={'inherit'} color={'text.200'} bg={'#222222'}>Tickets per day</InputRightAddon>
                                    </Box> 
                                </InputGroup>  
                            </FormControl>

                        </HStack>

                        {/* date and time */}
                        <HStack>

                            <FormControl w={['100%','70%','70%','50%']}>
                                <FormLabel color={'text.300'}>Validity Period</FormLabel>
                                <InputGroup  size={'lg'}> 
                                {/* <InputLeftAddon color={'text.200'} border={'inherit'} bg={'#222222'}>$</InputLeftAddon> */}
                                    <Input type="date" mr={'.2rem'} style={{borderTopLeftRadius:'6px', borderBottomLeftRadius:'6px'}} borderRadius={'0'} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('validityStartDate',{required:true})}/>
                                    <Input type="date" borderRadius={'0'}style={{borderTopRightRadius:'6px', borderBottomRightRadius:'6px'}} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...methods.register('validityEndDate',{required:true})}/>
                                </InputGroup> 
                            </FormControl>

                        </HStack>
                    
                    </Stack>
                </Box>

                <Box  >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Artwork Image</Heading>
                    {/* <Box border={'1px solid #333333'}> */}
                    {/* <ImageUploader name='artworkImage'/> */}
                    <AssetUploader serviceItemTypeName = {serviceItemTypeName} onSelectImage={handleImageSelect}/>
                    {/* </Box> */} 
                </Box>

                {/* <Box >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Image Upload</Heading>
                    <Box border={'1px solid #333333'}>
                    <DirectImageUploader onSelectLogoImage={handleLogoImage} name="logoImageHash"/>
                    </Box> 
                </Box> */}

                <Box>
                <ButtonGroup mt={'2rem'} mb={'4rem'} spacing={2}> 
                    <Button variant={'outline'} isDisabled={exclusiveAccessMutation.isLoading} colorScheme="brand" onClick={()=>router.back()}>Cancel</Button>
                    <Button size={'lg'} isLoading={exclusiveAccessMutation.isLoading} isDisabled={!methods.formState.isValid} colorScheme="brand" type="submit">{isBankConnected ?'Create Reservation':'Save as draft'}</Button>
                </ButtonGroup>
                </Box>
                </>: null}
            </Stack>
        </form>
        </FormProvider>
    ) 
}


function CustomAvailability({serviceItemId}:{serviceItemId:string}){

    const roleName = useRoleName()

    const {paseto} = useAuthContext()

    const { control, register, handleSubmit } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "availability", // unique name for your Field Array
    });

    const router = useRouter()
    const toast = useToast()

    const availabilityMutation = useMutation({
        mutationFn: async(payload:any)=>{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/service-items/availability`,payload,{
                headers:{
                    'Authorization': paseto
                }
            })
            return res.data
        },
        onSuccess:()=>{
            toast({
                title: 'Successfully create custom dates',
                duration: 3000,
                isClosable:true,
                position: 'top-right',
                status:'success'
            })
            router.replace('/')
        },
        onError:()=>{
            toast({
                title: 'Error creating custom dates',
                duration: 3000,
                isClosable:true,
                position: 'top-right',
                status:'error'
            })
        }  
    })

    function submitForm(values:any){
        const transformedAvailability = values.availability.map((availability:any)=>{
            return {
                ...availability,
                price: availability.price * 100,
                date: dayjs(availability.date).format()
            }
        })
        const payload = {
            serviceItemId: serviceItemId,
            availability: transformedAvailability
        }

        availabilityMutation.mutate(payload)
    }

    const newCustomDate = {
        name: '',
        ticketsPerDay: '',
        price: '',
        date: ''
    }

    return(
        <form onSubmit={handleSubmit(submitForm)}>
            {fields.map((field:any, index:number) => (
            <Stack key={field.id} mb={'1rem'} mt={'2rem'} p={['1.5rem']} spacing={5} borderRadius={[0,0,8]} w={'100%'} border={'1px solid #333333'}>
                <FormControl>
                    {/* <FormLabel color={'text.300'}>Name</FormLabel> */}
                    <Input textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'} placeholder="Chiristman eve"  variant={'outline'} {...register(`availability.${index}.name`)} />
                </FormControl>

                <HStack>
                    <FormControl w={'50%'}>
                        {/* <FormLabel color={'text.300'}>Price</FormLabel> */}
                        <InputGroup size={'lg'}>
                        <InputLeftAddon color={'text.200'} border={'inherit'} bg={'#222222'}>$</InputLeftAddon>
                        <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...register(`availability.${index}.price`,{valueAsNumber:true})}/>
                        </InputGroup> 
                    </FormControl>

                    <FormControl w={'50%'}>
                        {/* <FormLabel color={'text.300'}>Tickets Per Day</FormLabel> */}
                        <InputGroup size={'lg'}>
                            <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...register(`availability.${index}.ticketsPerDay`,{valueAsNumber:true})}/>
                            <InputRightAddon border={'inherit'} color={'text.200'} bg={'#222222'}>Tickets per day</InputRightAddon>
                        </InputGroup> 
                    </FormControl>

                 </HStack>

                 <FormControl w={'50%'}>
                        {/* <FormLabel color={'text.300'}>Tickets Per Day</FormLabel> */}
                        <InputGroup size={'lg'}>
                            <Input  textStyle={'secondary'} type='date' color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...register(`availability.${index}.date`)}/>
                        </InputGroup> 
                    </FormControl>

                <Button borderRadius={'50px'} w={'fit-content'} leftIcon={<MinusIcon/>} colorScheme="brand" variant={'outline'} onClick={()=>remove(index)}>Remove</Button>
            </Stack>
            ))}
            <Box px={['1.5rem',0,0,0]}>
                <Button
                borderRadius={'50px'} 
                onClick={() => append(newCustomDate)}
                variant={'outline'} 
                leftIcon={<AddIcon/>}
                colorScheme="brand"
                mt={8}>Add Custom Date
                </Button>
                
                <HStack spacing={3} my={'3rem'}>
                    <Button disabled={availabilityMutation.isLoading} onClick={()=>router.replace('/')} colorScheme="brand"  variant={"ghost"}>Skip for now</Button>
                    <Button isLoading={availabilityMutation.isLoading}  type="submit">Create Custom Dates</Button>
                </HStack>
            </Box>
        </form>
    )
}




function DirectImageUploader({name, onSelectLogoImage}:{name: string, onSelectLogoImage:(imageHash:string)=>void}){

    const {register,setValue} = useFormContext()

    const [image, setImage] = useState('')
    const [isUploading, setIsUploading] = useState(false)


    const toast = useToast()
      
  
    const extractImage = async(e: any) => {
      //upload data here
      const file = e.target.files && e.target.files[0];
      setIsUploading(true)
      try{
        const res = await asyncStore(file)
        setImage(res)
        onSelectLogoImage(res)
        setIsUploading(false)
      }catch(err){
        toast({
            title: 'Error uploading image to storage',
            status: 'error',
            position:'top-right',
            isClosable: true
        })
        setIsUploading(false)
      }
      
      setValue(name,file)

      
  };
  
    return (
      <FormControl > 
      <Stack spacing={4}> 
      <FormLabel htmlFor={name}>
        <Flex >
            <Image cursor={'pointer'} height={'200px'} borderRadius={'60px'} width={'200px'} border={'1px dashed #333333'} objectFit={'cover'}  src={image.length>10?`https://nftstorage.link/ipfs/${image}`:'/swamp-boys.jpg'} alt="judge photo-icon"/>
            {isUploading?<Spinner/>:null}
        </Flex>
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
     {/* { isUploading?<Spinner/>:null} */}
    </Stack>
     </FormControl>
    )
  }


function AssetUploader({onSelectImage, serviceItemTypeName}:{onSelectImage:(imageHash:string)=>void, serviceItemTypeName: string}){

    const {isOpen,onClose,onOpen,onToggle} = useDisclosure()
    const [imageSrc, setImageSrc] = useState('')

    function uploadToIpfs(){

    }

    function handleSelectImage(imageHash:string){

        // set local state
        setImageSrc(imageHash)

        // pass imagehash to parent comp
        onSelectImage(imageHash)

        // close modal
        onClose()
    }

    function handleUploadedImage(imageHash:string){

        // set local state
        setImageSrc(imageHash)

        // pass imagehash to parent comp
        onSelectImage(imageHash)

        // close modal
        onClose()
    }



    return(
        <Flex mt={6}> 
            <Flex justifyContent={'center'} objectFit={'contain'} position={'relative'} alignItems={'center'} borderRadius={6} width={'100%'} height={'350px'} border={'1px solid #333333'}>
                {/* <Button textDecoration={'none'} onClick={onOpen} variant={'link'} colorScheme="brand">Upload a asset for your NFT</Button> */}
                <Image height={'100%'} w={'100%'} src={imageSrc.length>10?`https://nftstorage.link/ipfs/${imageSrc}`:`https://nftstorage.link/ipfs/${PLACEHOLDER_HASH}`}/>
                <IconButton position={'absolute'} onClick={onOpen} bottom={'-2'} right={'-3'} aria-label="upload button" isRound variant={'ghost'} colorScheme="brand" size={'md'} icon={<ArrowUpIcon/>}/>
            </Flex>
            <Modal isCentered size={'xl'} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'#252626'}>
                <ModalHeader color={'text.300'}>Choose Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={'1rem'} >
                    <ImageUploader onUploadImage={handleUploadedImage} name="logoImageHash"/> 
                    <ArtworkPicker name = {serviceItemTypeName} onClose={onClose} onHandleArtworkSelection={handleSelectImage}/>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}



function ImageUploader({name,onUploadImage}:{name: string, onUploadImage:(imageHash:string)=>void}){

    const {register,setValue} = useFormContext()
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    const toast = useToast()
      
  
    const extractImage = async(e: any) => {
      //upload data here
      const file = e.target.files && e.target.files[0];
      setIsUploadingImage(true)
      try{
        const res  = await asyncStore(file)
        onUploadImage(res)
        setIsUploadingImage(false)
      }catch(err){
        toast({
            title: 'Error uploading image to IPFS',
            status:'error',
            duration:4000,
            isClosable: true,
            position:'top-right'
        })
        setIsUploadingImage(false)
      }
    //   setValue(name,file)

      
  };
  
    return (
      <FormControl > 
      <Stack spacing={4}> 
      <FormLabel htmlFor={name}>
      <Flex bg={'#121212'} border={'1px dashed #666666'} borderRadius={8} direction={'column'} justifyContent={'center'} height={'150px'} alignItems={'center'} cursor={'pointer'}>
        {/* <Image width={'100%'} border={'1px dashed #333333'} height={'300px'}  borderRadius={'10px'}  src={'/swamp-boys.jpg'} alt="judge photo-icon"/> */}
       { isUploadingImage
       ? <Spinner/>
       : <>
            <Text mb={'.6rem'} color={'text.300'} textStyle={'buttonLabel'}>Click here to upload</Text>
            <Text width={'70%'} textAlign={'center'} color={'text.200'}>Or choose an image below.  Please upload a PNG or JPEG that is 2400px x 1200px</Text>
        </>}
      </Flex>
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
     {/* { isUploading?<Spinner/>:null} */}
    </Stack>
     </FormControl>
    )
  }



function ArtworkPicker({onHandleArtworkSelection, name, onClose}:{onHandleArtworkSelection:(imageHash:string)=>void, name: string, onClose:()=>void}){

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>()

    const hashes = name === 'Reservation'? reservation: name === 'Line skip' ? lineSkip : bottleService

    function selectImage(imageHash:string){
        onHandleArtworkSelection(imageHash)
        onClose()
    }
    return(
        <Box>
        <Heading color={'text.300'} my={'1rem'} size={'md'}>Select Artwork</Heading>
        <Box overflowX={'hidden'} overflowY={'auto'} height={'400px'}>
            {hashes.map((imageHash:string, index:number)=>(
                <Box key={index} cursor={'pointer'}  mb={'1rem'} borderRadius={8}>
                    <Image  onClick={()=>selectImage(imageHash)} borderColor={selectedImageIndex == index?'brand.200':'none'} src={`https://nftstorage.link/ipfs/${imageHash}`} width={'100%'} height={'350px'} alt="Image"/>
                </Box> 
            )
            )}
        </Box>
        </Box>
    )
}



const imageHashList= [
    'bafkreicl6mxs4xifx6vef3lacxrfozbqzw2h7ccekkr2qsxe552jo3zzbm',
    'bafkreifuv3jjwm2tltcgpe36br3q4qrwyrd4aqj7dv4apqqi64kwc7ma6q',
    'bafkreicxz3njmsqovgifgdjwngoghbmaeieywgw5j2gzoy26dtecdqfc7e',
    'bafkreig4h3dhawjzqiieegze7ksbzj5i3no4duexaxzezgm5d272yp7gpq',
    'bafkreidm6lrgassu63uald57ocsbn2xkmzexq3n3c5mbkf23vhxcl4jxzm'
]


 const bottleService=[
    'bafkreih5kmywbykilkwduqdx7lttuuzin2puselw6swwnhi3hrnztuv6r4',
    'bafkreignk6ctyc3ngrklrmnpqnrbovij3e5x23ups5ynbwghe6rwwpnq4y',
    'bafkreibzyvawcyr3zjnvob6rfr7edzct7a63radq6ec5k5woa2v7belvs4',
    'bafkreidrgnhgak5zurcyud73kzgm347fkvruoy5mjm4stosetpfocyhem4',
    'bafkreigbbf73imovkwrsjrcvys6cggwff2jwb6ixi5weovlxftb73t54qe',
    'bafkreifll4nla7zdudxrlei3widcqtiz6phaa5zlbzyo5fdd76byytytgy',
    'bafkreiffhginn626rfdqsrn4lqpzhpsdfqbdeqxmofr3offdl6akp5qixy'
]

const reservation = [
    'bafkreidftkdvxbfqyot4a4ye6cmybkbuj4pqvrzp6o2uzr27264ba2zjgm',
    'bafkreiajyd5ogq4q6ledndv4fyd2tkxovxtc6xf73326i262lg4aio5dba',
    'bafkreiewtngckptrzm457vubintmg4nq2dpmentkkha7g4jwmhljmhbzya',
    'bafkreib43d4lfkf2g44bmjfke7nhccmfvto45ye6onnwznfuarh4b7vl3i',
    'bafkreigg636y3fh5robhm57fokgxnbnhclzjlw5lujzqw6b5lddper3xuu',
    'bafkreih5jcke4ymriq6apvm25xoyvtxrv44ouqn7sfh2je2zbkbxpanlsy',
    'bafkreiaz3477vw4dg6j355xqofjhrmjrwreha6jhyacjlznv5oaygupyni',
    'bafkreih734aianxaolqai32r7cqrbivue2226d4hgqc73kfo2hvppicomi',
    'bafkreid32byuipzwp6sam43nmbpickr6b2jejsuhxwqiv4mxrg547uok54',
    'bafkreibgzw5opyl7g6mhskmgjyjdqagavoyh53xe6r4x6ieeopkjysteoi',
    'bafkreid2wrsgpjfwzk3wagtodz55dmmukp2cw6wfcemsuo6smggwijcoyy',
    'bafkreihbecuafbkgdzogx3ihzivefvnol4iwvzfnd6piyzltzo4mes2tcm',
    'bafkreibr5dsleh6jqzp2eul24dom4ir5pvap3j37rupbrmfttsmqcwolme',
    'bafkreihuw2obzpj4qtmthpy7frky5e5r7autjtbkc4vse2gufpt4xua37q',
    'bafkreigsagycab37kiuv5ohywerw3ks3e5mkbpfzb4atdv3rfpfxtngwq4',
    'bafybeieagreig3jmjzcakenmdo3ekhbyhf42pkcsmwdc6wonhcorof4evi',
    'bafybeidjw44qhp44ahzhi2dyma6ln4tsaefay6etlyggbfed7lzcg54jou'
]


 const lineSkip = [
    'bafkreicl6mxs4xifx6vef3lacxrfozbqzw2h7ccekkr2qsxe552jo3zzbm',
    'bafkreifuv3jjwm2tltcgpe36br3q4qrwyrd4aqj7dv4apqqi64kwc7ma6q',
    'bafkreicxz3njmsqovgifgdjwngoghbmaeieywgw5j2gzoy26dtecdqfc7e',
    'bafkreig4h3dhawjzqiieegze7ksbzj5i3no4duexaxzezgm5d272yp7gpq',
    'bafkreidm6lrgassu63uald57ocsbn2xkmzexq3n3c5mbkf23vhxcl4jxzm'
]