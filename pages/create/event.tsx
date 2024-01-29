import { Box, Flex, FormControl, FormHelperText, Text, Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast, UnorderedList, ListItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Checkbox, Radio, RadioGroup, Link } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { asyncStore } from "../../utils/nftStorage";
import { ArrowUpIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import { PLACEHOLDER_HASH } from "../../constants";
import { timezones } from "../../data/timezones";
import useRoleName from "../../hooks/useRoleName";


type Event = {
    organizationId: string,
    name: string,
    timezone: string,
    price: number,
    serviceType: string, 
    totalTickets: number,
    orgServiceId: string,
    location: string,
    address: string,
    startTime: string,
    type: string,
    duration: number,
    eventLocation: string,
    eventLink?:string,
    locationName: string,
    contactNumber: string,
    logoImageHash?: string | null | any,
    artworkImageHash: string,
    coverImageHash: string,
    description: string,
    // serviceItemId: string
    serviceItemTypeId?: string | undefined | string[]
}


export default function Event(){
    const methods = useForm<Event>({
      defaultValues:{
        timezone: 'EST'
      }
    })

    const [isEventFree, setIsEventFree] = useState(false)

    const {paseto} = useAuthContext()
    const router = useRouter()
    const toast = useToast()
    const [isHashingImage, setIsHashingImage] = useState(false)

    const roleName = useRoleName()

    const userOrgsQuery = useQuery({
        queryKey:['user-organizations',paseto],
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/orgs?pageNumber=1&pageSize=300&status=1`,{
                headers:{
                    'Authorization': paseto 
                }
            }) 
            return res.data.data
        },
        enabled: paseto !== undefined && paseto !== null && roleName !== ''
    })

    
    const eventMutation = useMutation({
        mutationFn: async(payload:any)=>{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${roleName}/events`,payload,{
                headers:{
                    'Authorization': paseto
                }
            })
            return res
        },
        onSuccess:()=>{

            toast({
                title: 'Success creating event',
                status: 'success',
                duration: 6000,
                isClosable: true,
                position:'top-right'
            })

            router.replace('/')

        },
        onError:(err)=>{
            toast({
                title: 'Error creating event',
                status: 'error',
                duration: 6000,
                isClosable: true,
                position:'top-right'
            })
        }
    })

  

    const watchOrgId = methods.watch('organizationId')
    const eventLocationValue = methods.watch('eventLocation')

    const isEventVirtual = eventLocationValue === 'virtual'? true: false

    async function submitForm(values: any){

        setIsHashingImage(true)
        const imageHash = await asyncStore(values.logoImageHash[0])
        setIsHashingImage(false)


        const payload = {
            ...values,
            contactNumber: `+1${values.contactNumber}`,
            orgId: watchOrgId,
            address: isEventVirtual ? {}: values.address, 
            locationName: isEventVirtual? '': values.locationName,
            arworkImageHash: imageHash,  
            coverImageHash: imageHash,
            duration: String(values.duration * 60),
            startTime: dayjs(values.startTime).format(),
            price: String(values.price * 100) // convert to cents
        }
        delete payload.organizationId
        delete payload.location 
        delete payload.eventLocation
        delete payload.logoImageHash

        console.log(payload)
        eventMutation.mutate(payload)

    } 

    function handleCoverImage(imageHash:string){
        methods.setValue('coverImageHash',imageHash)
    }

    function handleArtworkImage(imageHash:string){
        methods.setValue('artworkImageHash',imageHash)
    }

    function makeEventFree(){
        methods.setValue('price',0)
        setIsEventFree(!isEventFree) 
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

                        { userOrgsQuery.isLoading || userOrgsQuery.isRefetching
                            ? <Spinner/>
                            : userOrgsQuery.isError
                            ?  <Flex p={8} justifyContent={'center'} direction={'column'} alignItems={'center'} border={'1px solid'}>
                                    <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It appears we had a problem fetching your organizations, please try it again</Text>
                                    <Button mt={3} variant={'link'} onClick={()=>userOrgsQuery.refetch()}>Try again</Button> 
                                </Flex>
                            : userOrgsQuery?.data?.length < 1
                            ? <Flex p={8} justifyContent={'center'} alignItems={'center'} border={'1px solid'}>
                            <Text textAlign={'center'} color={'text.200'} textStyle={'body'} width={'100%'}>It seems like you are not a part of any organization. Get started creating one on <Link color={'brand.300'} target="_blank" textDecoration={'underline'} colorScheme="brand" href={`https://portal.flexabledats.com`}>Flexable Portal</Link></Text> 
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


                           { watchOrgId !== undefined && watchOrgId !== '' 
                           ? <>
                            
                            <Box> 
                                <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Basic Info</Heading>
                                <Stack spacing={8} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                                    <FormControl>
                                        <FormLabel color={'text.300'}>Title</FormLabel>
                                        <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('name',{required:true})}/>
                                    </FormControl>
                                   

                                    <FormControl>
                                        <FormLabel color={'text.300'}>Description</FormLabel>
                                        <Textarea focusBorderColor="brand.200" rows={2}  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('description',{required:true})}/>
                                    </FormControl>

                                    <FormControl w={['100%','50%','50%']}> 
                                        <FormLabel color={'text.300'}>Price</FormLabel>
                                        <InputGroup size={'lg'}>
                                        <InputLeftAddon color={'text.300'}  borderColor={'#2c2c2c'} bg={'#121212'}>$</InputLeftAddon>
                                        <Input isDisabled={isEventFree} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="332" {...methods.register('price',{required:true})}/>
                                        <Checkbox color={'text.300'} onChange={makeEventFree} colorScheme="brand" ml={'2rem'}>Free</Checkbox>
                                        </InputGroup> 
                                    </FormControl>
                                

                                    <FormControl >
                                        <FormLabel color={'text.300'}>Available DATs</FormLabel>
                                        <InputGroup w={['70%','40%','40%']} size={'lg'}>
                                        <Input  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('totalTickets',{required:true})}/>
                                        </InputGroup> 
                                        <FormHelperText color={'text.200'}>
                                            This specifies the total number of DATs available for sale
                                        </FormHelperText>
                                    </FormControl>
                                    
                                    <FormControl w={['100%','70%','70%']}>
                                        <FormLabel color={'text.300'}>Start Time</FormLabel>
                                        <InputGroup size={'lg'}>
                                        <Input type="datetime-local" borderTopRightRadius={0} borderBottomRightRadius={0}  textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="332" {...methods.register('startTime',{required:true})}/>
                                        <Select width={'70%'} color={'text.300'} borderTopLeftRadius={0} borderBottomLeftRadius={0} {...methods.register('timezone',{required:true})}>
                                            {
                                                timezones.map((timezone:string)=>(
                                                    <option key={timezone} value={timezone}>{timezone}</option>
                                                ))
                                            }
                                        </Select>
                                        </InputGroup>  
                                    </FormControl>
 
                                   
                                </Stack>
                            </Box>
                            
                            <Box>
                                <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Privacy</Heading>
                                <Box  p={'1rem'} border={'1px solid #333333'} >
                                <FormControl> 
                                    {/* <FormLabel color={'text.300'}>Privacy</FormLabel> */}
                                    <RadioGroup defaultValue="public"  size={'lg'} colorScheme="brand">
                                        <HStack mb={'.5rem'} color={'text.300'} spacing={6}> 
                                            <Radio {...methods.register('type')} value='public'>Public</Radio>
                                            <Radio {...methods.register('type')} value='private'>Private</Radio> 
                                        </HStack>
                                    </RadioGroup>
                                    <FormHelperText color={'text.200'}>
                                        Determine whether or not your event gets listed on marketplace or shared privately from the portal
                                    </FormHelperText>
                                </FormControl>
                                </Box>
                            </Box>

                            <Box >
                                 <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Location Info</Heading>

                                 <FormControl ml={'.4rem'} mb={'1rem'}> 
                                    {/* <FormLabel color={'text.300'}>Privacy</FormLabel> */}
                                    <RadioGroup defaultValue="physical"  size={'lg'} colorScheme="brand">
                                        <HStack mb={'.5rem'} color={'text.300'} spacing={6}> 
                                            <Radio {...methods.register('eventLocation')} value='physical'>Physical</Radio>
                                            <Radio {...methods.register('eventLocation')} value='virtual'>Virtual</Radio> 
                                        </HStack>
                                    </RadioGroup>
                                    <FormHelperText color={'text.200'}>
                                        Decide if your event is physical or virtual
                                    </FormHelperText>
                                </FormControl>

                                {/* event link form=== */}
                                <Stack spacing={5} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>
                                {
                                    isEventVirtual
                                    ? <FormControl>
                                        <FormLabel color={'text.300'}>Event Link</FormLabel>
                                        <Input type='url' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="Your event link here" {...methods.register('eventLink',{required:true})}/>
                                    </FormControl>
                                    :
                                    <>
                                    <FormControl>
                                        <FormLabel color={'text.300'}>Venue Name</FormLabel>
                                        <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="" {...methods.register('locationName',{required:true})}/>
                                    </FormControl>

                                    <Address/>
                                    </>
                                }

                               
                                </Stack>
                            </Box>

                            
                            {/* contact info */}

                            <Box >
                                 <Heading ml='.6rem' mt={'3rem'}  mb={'2rem'} color={'text.300'} size={'md'}>Contact Info</Heading>
                                 <Stack spacing={5} p={'1rem'} border={'1px solid #333333'} borderRadius={5}>

                                <FormControl>
                                    <FormLabel color={'text.300'}>Contact Number</FormLabel>
                                    <InputGroup width={['100%','80%','50%','50%']} size={'lg'}> 
                                        <InputLeftAddon borderColor={'#2c2c2c'} color={'text.200'} bg={'#121212'}>+1</InputLeftAddon>
                                        <Input color={'text.300'} type="tel" borderColor={'#2c2c2c'}  borderRadius={'0'} borderTopRightRadius={8} borderBottomRadius={8}  variant={'outline'}  {...methods.register('contactNumber',{required:true})} />
                                    </InputGroup>
                                    {/* <InputGroup size={'lg'}> 
                                        <Input type='number' maxLength={3} textStyle={'secondary'} mr={'.5rem'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  borderRadius={'0'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                        <Input type='number' maxLength={3} textStyle={'secondary'} color='text.300' mr={'.5rem'}  size='lg' borderColor={'#2c2c2c'} borderRadius={'0'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                        <Input type='number' maxLength={4} textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'}  {...methods.register('contactNumber')}/>
                                    </InputGroup> */}
                                </FormControl>

                                    <FormControl w={['70%','30%','20%']}>
                                        <FormLabel color={'text.300'}>Duration</FormLabel>
                                        <InputGroup size={'lg'}>
                                        <Input type="number" textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="0" {...methods.register('duration',{required:true})}/>
                                        <InputRightAddon borderColor={'#2c2c2c'} color={'text.200'} bg={'#121212'}>Hrs</InputRightAddon>
                                        </InputGroup> 
                                    </FormControl>
                                 </Stack>
                            </Box>

                            <Box >
                                <Heading color={'text.300'} mb={'2rem'} mt={'2rem'}  size={'md'}>Upload Cover Image</Heading>
                                <DirectImageUploader name="logoImageHash" onSelectLogoImage={handleCoverImage}/>
                            </Box>

                            {/* <Box mb={'5rem'} >
                                <Heading color={'text.300'} mb={'1rem'} mt={'2rem'}  size={'md'}>Upload Artwork Image</Heading>
                                <AssetUploader onSelectImage={handleArtworkImage}/>
                            </Box> */} 
                            <ButtonGroup mb={'3rem'} mt={'2rem'} spacing={2}>
                                <Button size={'lg'} disabled={eventMutation.isLoading} variant={'outline'} onClick={()=>router.back()}>Cancel</Button>
                                <Button size={'lg'} isLoading={eventMutation.isLoading || isHashingImage} isDisabled={!methods.formState.isValid} colorScheme="brand" type="submit">Create Event</Button>
                            </ButtonGroup>
                            </>
                            :null}
                        </Stack>
                    </form>
                </GridItem> 
            </FormProvider>
        </Grid>
     </Layout>
    )
}




  function Address(){

    const {register,formState,setValue:setFormState} = useFormContext()


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
                setFormState('address',addressWithStreet)
                // console.log(addressWithStreet)
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
            {...register(`location`,{
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
      
    //   setValue(name,file)

      
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


function AssetUploader({onSelectImage}:{onSelectImage:(imageHash:string)=>void}){

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
                    <ImageUploader onUploadImage={handleUploadedImage} name="artworkImageHash"/> 
                    <ArtworkPicker onClose={onClose} onHandleArtworkSelection={handleSelectImage}/>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}



function ImageUploader({name,onUploadImage}:{name: string, onUploadImage:(imageHash:string)=>void}){

    const {register} = useFormContext()
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
      <Flex bg={'#121212'} borderRadius={8} direction={'column'} justifyContent={'center'} height={'150px'} alignItems={'center'} cursor={'pointer'}>
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



function ArtworkPicker({onHandleArtworkSelection, onClose}:{onHandleArtworkSelection:(imageHash:string)=>void, onClose:()=>void}){

    const [selectedImageIndex, setSelectedImageIndex] = useState<number>()



    function selectImage(imageHash:string){
        onHandleArtworkSelection(imageHash)
        onClose()
        // setSelectedImageIndex(index)
    }
    return(
        <Box>
        <Heading color={'text.300'} my={'1rem'} size={'md'}>Midjourney Artworks</Heading>
        <Box overflowX={'hidden'} overflowY={'auto'} height={'400px'}>
            {imageHashList.map((imageHash:string, index:number)=>(
                <Box key={index} cursor={'pointer'}  mb={'1rem'} borderRadius={8}>
                    <Image objectFit={'cover'} onClick={()=>selectImage(imageHash)} borderColor={selectedImageIndex == index?'brand.200':'none'} src={`https://nftstorage.link/ipfs/${imageHash}`} width={'100%'} height={'150px'} alt="Image"/>
                </Box>
            )
            )}
        </Box>
        </Box>
    )
}



const imageHashList= [
    'bafkreih5kmywbykilkwduqdx7lttuuzin2puselw6swwnhi3hrnztuv6r4',
    'bafkreignk6ctyc3ngrklrmnpqnrbovij3e5x23ups5ynbwghe6rwwpnq4y',
    'bafkreibzyvawcyr3zjnvob6rfr7edzct7a63radq6ec5k5woa2v7belvs4',
    'bafkreidrgnhgak5zurcyud73kzgm347fkvruoy5mjm4stosetpfocyhem4',
    'bafkreigbbf73imovkwrsjrcvys6cggwff2jwb6ixi5weovlxftb73t54qe',
    'bafkreifll4nla7zdudxrlei3widcqtiz6phaa5zlbzyo5fdd76byytytgy',
    'bafkreiffhginn626rfdqsrn4lqpzhpsdfqbdeqxmofr3offdl6akp5qixy'
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