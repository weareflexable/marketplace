import { Box, Flex, FormControl, Text, FormHelperText,  Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, chakra, Popover, PopoverBody, PopoverContent, UnorderedList, PopoverTrigger, Portal, ListItem, Card, CardBody, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, IconButton } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext, useFieldArray} from 'react-hook-form'
import Layout from "../../components/shared/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePlacesAutocomplete, { getDetails, getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { asyncStore } from "../../utils/nftStorage";
import { useAuthContext } from "../../context/AuthContext";
import { PLACEHOLDER_HASH } from "../../constants";


type Community = {
    organizationId: string,
    title: string,
    price: number,
    serviceType: string,
    totalTickets: number,
    name: string,
    orgServiceId: string,
    artworkHash: string,
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

    const [createdCommunityId, setCreatedCommunityId] = useState('')
    
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = (data:any) => {
        setCreatedCommunityId(data.id)
        setActiveStep((prevStep) => prevStep + 1);
      };

      const handlePrevious = () => {
        setActiveStep((prevStep) => prevStep - 1);
      };

      const steps = [
        { 
         title: 'Basic Info',
         component: <BasicForm prev={handlePrevious} next={handleNext}/>
        },
        { title: 'Add Venues', 
        component: <VenueForm communityId={createdCommunityId}/>
    }
      ]
    

    return(
        <Layout>
        <Grid h='100%'  layerStyle={'base'} templateColumns={'repeat(6,1fr)'} mt={'1rem'}>
            {/* <GridItem colSpan={6}>

            </GridItem> */}
            <GridItem px={['1rem','1rem',0,0]} mb='2rem' mt={'3rem'} colStart={[1,1,2,2]} colEnd={[7,7,6,5]}>
              <Heading mx={'1rem'} color={'text.300'}>Create Community</Heading>
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

Community





  interface StepProps{
    prev: ()=>void,
    next: (data:any)=>void
  }
function BasicForm({prev,next}:StepProps){

    const [selectedLogoImage, setSelectedLogoImage] = useState<string|undefined>()

    const methods = useForm<Community>({
    })

    const watchOrgId = methods.watch('organizationId')

    const {paseto} = useAuthContext()

    console.log('watch org', watchOrgId)

    const router = useRouter()

    const toast = useToast()

    const userOrgsQuery = useQuery({
        queryKey:['user-organizations',paseto],
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/orgs?pageNumber=1&pageSize=30&status=1`,{
                headers:{
                    'Authorization': paseto 
                }
            }) 
            return res.data.data
        },
        enabled: paseto !== undefined || paseto !== null 
    })  

    const communityMutation = useMutation({
        mutationFn: async(payload:any)=>{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/community`,payload,{
                headers:{
                    'Authorization': paseto
                }
            })
            return res.data.data
        },
        onSuccess:(data)=>{
            const res = data[0] 
            console.log('res',res)
            toast({
                title: 'Successfully created community',
                status: 'success',
                duration: 6000,
                isClosable: true,
                position:'top-right'
            })
            next(res)
        },
        onError:(err)=>{ 
            toast({
                title: 'Error creating Community',
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

        const payload = {
            ...values,
            orgId: values.organizationId,
            price: String(values.price * 100), // convert to cents.
            name: `Key to: ${values.name}`,
            currency: 'USD'
        }

        delete payload.organizationId

        communityMutation.mutate(payload)

        console.log(values)
        // next()
    }

    function handleCoverImage(imageHash:string){
        // set image state
        setSelectedLogoImage(imageHash)
        // set value in form
        methods.setValue('logoImageHash',imageHash)
    }

    function handleImageSelect(imageHash:string){
        // set value in form
        methods.setValue('artworkHash',imageHash)
    }

    return(
        <form onSubmit={methods.handleSubmit(submitForm)}>
            <Stack w={'100%'} mt={'4rem'} spacing={8}>

            { userOrgsQuery.isLoading || userOrgsQuery.isRefetching
               ? <Spinner/>
               : userOrgsQuery.isError
               ?  <Flex p={8} justifyContent={'center'} direction={'column'} alignItems={'center'} border={'1px solid'}>
                    <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It appears we had a problem fetching your organizations, please try it again</Text>
                    <Button mt={3} variant={'link'} onClick={()=>userOrgsQuery.refetch()}>Try again</Button> 
                </Flex>
               : userOrgsQuery?.data?.length < 1
               ? <Text textAlign={'center'} textStyle={'body'} width={'70%'}>It seems like you do not have a registered organization neither are you a part of one. Please register an organization on flexable portal</Text>
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


                {watchOrgId !== undefined ?
                <>
                <Box>
                    <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Basic Info</Heading>
                    <Stack spacing={5} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                        <FormControl>
                            <FormLabel color={'text.300'}>Name</FormLabel>
                            <InputGroup size={'lg'}>
                                <InputLeftAddon border={'inherit'} bg={'#222222'} color={'text.200'}>
                                    Key to:
                                </InputLeftAddon>
                                <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('name',{required:true})}/>
                            </InputGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel color={'text.300'}>Description</FormLabel>
                            <Textarea rows={2}  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('description',{required:true})}/>
                        </FormControl>

                        <FormControl w={'50%'}>
                            <FormLabel color={'text.300'}>Price</FormLabel>
                            <InputGroup size={'lg'}>
                            <InputLeftAddon color={'text.300'} border={'inherit'} bg={'#121212'}>$</InputLeftAddon>
                            <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="332" {...methods.register('price',{valueAsNumber:true,required:true})}/>
                            </InputGroup> 
                        </FormControl>
                    
                    </Stack>
                </Box>

                <Box  >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Artwork Image</Heading>
                    {/* <Box border={'1px solid #333333'}> */}
                    {/* <ImageUploader name='artworkImage'/> */}
                    <AssetUploader onSelectImage={handleImageSelect}/>
                    {/* </Box> */} 
                </Box>

                <Box >
                    <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Image Upload</Heading>
                    <DirectImageUploader onHandleImage={handleCoverImage} name="logoImageHash"/>
                </Box>

                <Box>
                <ButtonGroup mt={'2rem'} mb={'4rem'} spacing={2}> 
                    <Button variant={'outline'} isDisabled={communityMutation.isLoading} colorScheme="brand" onClick={()=>router.back()}>Cancel</Button>
                    <Button colorScheme="brand" isDisabled={!methods.formState.isValid} isLoading={communityMutation.isLoading} type="submit">Create Community</Button>
                </ButtonGroup>
                </Box>
                </>: null}
            </Stack>
        </form>
    )
}

function VenueForm({communityId}:{communityId:string}){

    console.log(communityId)

    const { control, register, handleSubmit, setValue } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "venues", // unique name for your Field Array
    });

    const {paseto} = useAuthContext()
    const router = useRouter()
    const toast = useToast()

    const venuesMutation = useMutation({
        mutationFn: async(payload:any)=>{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/community-venues`,payload,{
                headers: {
                    'Authorization': paseto
                }
            })
            return res;
        },
        onSuccess:()=>{
            toast({
                title: 'Successfully created venues',
                status:'success',
                duration:4000,
                isClosable: true,
                position:'top-right'
            })
            router.replace('/')
        },
        onError:()=>{
            toast({
                title: 'Error creating venues',
                status:'error',
                duration:4000,
                isClosable: true,
                position:'top-right'
            })
        }
    })

    function submitForm(values:any){

        const transformedVenues = values.venues.map((venue:any)=>{
            const addressObj = {
                ...venue,
                marketValue: venue.marketValue * 100, // convert to cents
                contactNumber: `+1${venue.contactNumber}`,
                address: {...venue.address}
            }
            delete addressObj.location
            return addressObj
        })

        const payload = {
            communityId: communityId,
            venues: transformedVenues
        }

        venuesMutation.mutate(payload)

    }

    const newVenue = {
        name: '',
        promotion: '',
        marketValue: '',
        location: '',
        contactNumber: ''
    }

    function handleAddress(index:number,address:any){
        setValue(`venues.${index}.address`,address)   
    }
 

    return(
        <form onSubmit={handleSubmit(submitForm)}>
            {fields.map((field:any, index:number) => (
            <Stack key={field.id} mb={'1rem'} mt={'4rem'} p={['1.5rem']} spacing={5} borderRadius={[0,0,8]} w={'100%'} border={'1px solid #333333'}>
                <FormControl>
                    <FormLabel color={'text.300'}>Name</FormLabel>
                    <Input textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'}  variant={'outline'} {...register(`venues.${index}.name`,{required:true})} />
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
                        <Input textStyle={'secondary'} color='text.300' size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...register(`venues.${index}.marketValue`,{valueAsNumber:true,required:true})}/>
                    </InputGroup> 
                    <FormHelperText color={'text.200'}>
                        Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace
                    </FormHelperText>
                </FormControl>

                <Address onHandleAddress={handleAddress} index={index}/>

                 <FormControl hidden >
                    
                    <Input 
                        {...register(`venues.${index}.address`,{required:true})}
                        />
                </FormControl>

                <FormControl>
                    <FormLabel color={'text.300'}>Contact Number</FormLabel>
                    <InputGroup>
                        <InputLeftAddon border={'inherit'} bg={'#222222'}>+1</InputLeftAddon>
                        <Input type="tel" borderColor={'#2c2c2c'} color={'text.300'} variant={'outline'} placeholder="0" {...register(`venues.${index}.contactNumber`,{required:true})}/>
                    </InputGroup>
                    {/* <InputGroup size={'lg'}> 
                    <Input type='number' maxLength={3} textStyle={'secondary'} mr={'.5rem'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  borderRadius={'0'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.areaCode`)}/>
                    <Input type='number' maxLength={3} textStyle={'secondary'} color='text.300' mr={'.5rem'}  size='lg' borderColor={'#2c2c2c'} borderRadius={'0'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.midCode`)}/>
                    <Input type='number' maxLength={4} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...register(`venues.${index}.contactNumber.tailCode`)}/>
                    </InputGroup> */}
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
                    <Button isLoading={venuesMutation.isLoading} colorScheme="brand" type="submit">Create Venues</Button>
                </Box>
            </Box>
        </form>
    )
}



function Address({index, onHandleAddress}:{index:number, onHandleAddress:(index:number,address:any)=>void}){
    const {register,formState, setValue:setFormState} = useFormContext()

    

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        callbackName: "initMap",
        requestOptions: {
          /* Define search scope here */
          componentRestrictions:{
            country: 'us'
          },
          
        //   types: ['bakery','bar','restaraunt']
        },
        debounce: 300,
      });
      const ref = useOnclickOutside(() => {
        // When the user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
      });
    
      const handleInput = (e:any) => {
        // Update the keyword of the input element
        console.log(e.target.value)
        setValue(e.target.value);
      };
    
      const handleSelect =
        (suggestion:any) =>
        () => {

            console.log(suggestion)
            const {description,place_id} = suggestion

          // When the user selects a place, we can replace the keyword without request data from API
          // by setting the second parameter to "false"
          setValue(description, false);
          clearSuggestions();

          const parameter = {
            // Use the "place_id" of suggestion from the dropdown (object), here just taking the first suggestion for brevity
            placeId: place_id,
            // Specify the return data that you want (optional)
            fields: ['address_components','geometry','formatted_address','place_id'], 
          };
 
          getDetails(parameter)
            .then((details:any) => {
                console.log("Details: ", details);
                
                const fullAddress = extractFullAddress(details)
                
                const addressWithStreet={
                    ...fullAddress,
                    fullAddress: details?.formatted_address,
                    placeId: details?.place_id 
                }
                console.log(addressWithStreet)
                onHandleAddress(index,addressWithStreet)
                // setFormState(`venues.${index}.address`,addressWithStreet)
            })
            .catch((error:any) => {
                console.log("Error: ", error);
            });
        };
    
      const renderSuggestions = () =>
        data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
    
          return (
            <ListItem cursor={'pointer'} borderBottom={'1px solid #333333'} _last={{borderBottom:'0'}} _first={{mt:'.5rem'}} mb={'.5rem'} px='1rem' py={'.5rem'} key={place_id} listStyleType={'none'} onClick={handleSelect(suggestion)}>
             <HStack> <strong>{main_text}</strong> <Text color={'text.200'}>{secondary_text}</Text> </HStack>
            </ListItem>
          );
        });


    
      
    return(
    <FormControl ref={ref}>
        <FormLabel color={'text.300'}>Address</FormLabel>
        
        <Input 
            textStyle={'secondary'}
            color='text.300'  
            size='lg'  
            borderColor={'#2c2c2c'}  
            variant={'outline'} 
            value={value}
            placeholder="Enter your address" 
            {...register(`venues.${index}.location`,{
                onChange: handleInput
            })}
            />
            {status == 'OK' && 
                <UnorderedList border={'1px solid #333333'} borderRadius={8}  m='0' mt={'1rem'} color={'text.300'}>
                    {renderSuggestions()}
                </UnorderedList>
            }
    </FormControl>
    )
} 


function AssetUploader({onSelectImage}:{onSelectImage:(imageHash:string)=>void}){

    const {isOpen,onClose,onOpen,onToggle} = useDisclosure()
    const [imageSrc, setImageSrc] = useState('')

    function uploadToIpfs(){

    }

    function handleSelectImage(imageHash:string){

        console.log(imageHash)
        // set local state
        setImageSrc(imageHash)

        // pass imagehash to parent comp
        onSelectImage(imageHash)

        // close modal
        onClose()
    }

    function handleUploadedImage(imageHash:string){

        console.log(imageHash)
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

                <Image height={'100%'} w={'100%'} src={imageSrc.length>10?`https://nftstorage.link/ipfs/${imageSrc}`:`https://nftstorage.link/ipfs/${PLACEHOLDER_HASH}`}/>
                <IconButton position={'absolute'} onClick={onOpen} bottom={'-2'} right={'-3'} aria-label="upload button" isRound variant={'ghost'} colorScheme="brand" size={'md'} icon={<ArrowUpIcon/>}/>
            </Flex>
            <Modal isCentered size={'xl'} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'#252626'}>
                <ModalHeader color={'text.300'}>Choose Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={'1rem'} >
                    <ImageUploader onUploadImage={handleUploadedImage} name="artworkImageHash"/> 
                    <ArtworkPicker onClose={onClose} onHandleArtworkSelection={handleSelectImage}/>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}



function ImageUploader({name,onUploadImage}:{name: string, onUploadImage:(imageHash:string)=>void}){

    const {register,setValue} = useFormContext()

    const toast = useToast()

    const [isUploading, setIsUploading] = useState(false)
      
  
    const extractImage = async(e: any) => {
      //upload data here
      const file = e.target.files && e.target.files[0];
      setIsUploading(true)
      try{
        const res  = await asyncStore(file)
        onUploadImage(res)
        setIsUploading(false)
        console.log(res)
      }catch(err){
        toast({
            title: 'Error uploading image to IPFS',
            status:'error',
            duration:4000,
            isClosable: true,
            position:'top-right'
        })
        setIsUploading(false)
      }
    //   setValue(name,file)

      
  };
  
    return (
      <FormControl > 
      <Stack spacing={4}> 
      <FormLabel htmlFor={name}>
      <Flex bg={'#121212'} border={'1px dashed #666666'} borderRadius={8} direction={'column'} justifyContent={'center'} height={'150px'} alignItems={'center'} cursor={'pointer'}>
        {isUploading
        ?<Spinner/>
        :<>
            <Text mb={'.6rem'} color={'text.300'} textStyle={'buttonLabel'}>Click here to upload</Text>
            <Text width={'70%'} textAlign={'center'} color={'text.200'}>Or choose an image below.  Please upload a PNG or JPEG that is 2400px x 1200px</Text>
        </>
        }
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

function DirectImageUploader({name, onHandleImage}:{name: string, onHandleImage:(imageHash:string)=>void}){

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
        onHandleImage(res)
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
      
      
  };
  
    return (
      <FormControl > 
      <Stack spacing={4}> 
      <FormLabel htmlFor={name}>
        <Flex >
            <Image cursor={'pointer'} height={'350px'} borderRadius={'10px'} width={'100%'} border={'1px dashed #333333'} objectFit={'cover'}  src={image.length>10?`https://nftstorage.link/ipfs/${image}`:`https://nftstorage.link/ipfs/${PLACEHOLDER_HASH}`} alt="judge photo-icon"/>
            {isUploading?<Spinner/>:null}
        </Flex>
      </FormLabel>
      <Box                    
         borderColor={'#464646'}  
         {...register('logoImageHash',{
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

function ArtworkPicker({onHandleArtworkSelection, onClose}:{onHandleArtworkSelection:(imageHash:string)=>void, onClose:()=>void}){

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>()



    function selectImage(imageHash:string){
        onHandleArtworkSelection(imageHash)
        onClose()
    }
    return(
        <Box>
        <Heading color={'text.300'} my={'1rem'} size={'md'}>Select Artwork</Heading>
        <Box overflowX={'hidden'} overflowY={'auto'} height={'400px'}>
            {imageHashList.map((imageHash:string, index:number)=>(
                <Box key={index} cursor={'pointer'}  mb={'1rem'} borderRadius={8}>
                    <Image objectFit={'cover'} onClick={()=>selectImage(imageHash)} borderColor={selectedImageIndex == index?'brand.200':'none'} src={`https://nftstorage.link/ipfs/${imageHash}`} width={'100%'} height={'350px'} alt="Image"/>
                </Box>
            )
            )}
        </Box>
        </Box>
    )
}



const imageHashList = [
    'bafybeigsd6qwrclttmfq6zh72rldkcfyjc3xqmyuucu4rzavwfa3o3ndmm',
    'bafybeidz65dnck3frd76dhvgcrznirf6sxbfentxi5lm3mz7ch6hifgr3a',
    'bafybeicyq4jqhkvo6i7luzcnav5dazwo6xysfhxdqgmqat2wy46s2xdloe',
    'bafybeif67t7snc6umd5twrzqicq7jugtqo3dofnvncjvhtccuo7d34iy3q',
    'bafybeicq6jhmuf2g5cqp6tmv72h2rvc6nwds3nez4wpj6ysppv455lmazi',
    'bafybeiff2bdvjr2p2q2uimgfaoebik3yuu23bhdredz52j3ctrmbrabese',
    'bafybeigsghat6a2sbhyjmmchk6onztdstxjx45cxwzrdiub5hmiyf5kwqa',
    'bafybeihkfzmeegpiz67fxn2i3rmohdddjcoyk5y45rmvaqvv5sotrdxypm',
    'bafybeif66cmurjviz35rid5morzsnp277cs3qhjdgquvpe6n54ntuolnnu',
    'bafybeibbyfj22f3wdrgu4dzsnpfixtn7zfmrxn7i3efavfdhnczz2sqala'
    ]


    const extractFullAddress = (place:any)=>{
        const addressComponents = place.address_components 
            let addressObj = {
                state:'',
                country:'',
                city:'',
                street:'',
                placeId:'',
                fullAddress:'',
                latitude:String(place.geometry.location.lat()),
                longitude:String(place.geometry.location.lng())
            };
    
            addressComponents.forEach((address:any)=>{
                const type = address.types[0]
                if(type==='country') addressObj.country = address.long_name
                if(type==='route') addressObj.street = address.long_name
                if(type === 'locality') addressObj.state = address.short_name
                if(type === 'administrative_area_level_1') addressObj.city = address.short_name
            })
    
            return addressObj
    }