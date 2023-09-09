import { Box, Flex, FormControl, Text, FormHelperText,  Image, FormLabel, Grid, GridItem, HStack, Heading, Input, Select, Stack, Spinner, InputLeftAddon, InputGroup, Textarea, InputRightAddon, ButtonGroup, Button, useToast, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, chakra, Popover, PopoverBody, PopoverContent, UnorderedList, PopoverTrigger, Portal, ListItem, Card, CardBody, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, IconButton } from "@chakra-ui/react";
import  {useForm, FormProvider, useFormContext, useFieldArray} from 'react-hook-form'
import Header from "../../components/shared/Header/Header";
import Layout from "../../components/shared/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { usePlacesWidget } from "react-google-autocomplete";
import usePlacesAutocomplete, { getDetails, getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { ArrowUpIcon } from "@chakra-ui/icons";


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
    next: ()=>void
  }
function BasicForm({prev,next}:StepProps){

    const [selectedLogoImage, setSelectedLogoImage] = useState<string|undefined>()

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

    function handleImageSelect(imageHash:string){
        // set image state
        setSelectedLogoImage(imageHash)
        // set value in form
        // methods.setValue('logoImageHash',imageHash)
    }

    return(
        <form onSubmit={methods.handleSubmit(submitForm)}>
            <Stack w={'100%'} mt={'4rem'} spacing={8}>
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
                    {/* <ImageUploader name='artworkImage'/> */}
                    <AssetUploader onSelectImage={handleImageSelect}/>
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
            <Stack key={field.id} mb={'1rem'} mt={'4rem'} p={['1.5rem']} spacing={5} borderRadius={[0,0,8]} w={'100%'} border={'1px solid #333333'}>
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

                <Address index={index}/>

                {/* <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#2c2c2c'}  variant={'outline'} placeholder="North Bridge Carolina, USA" {...register(`venues.${index}.address`)}/>
                </FormControl> */}

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



function Address({index}:{index:number}){
    const {register,formState} = useFormContext()

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
            fields: ["name", "rating","formatted_address"], 
          };
 
          getDetails(parameter)
            .then((details:any) => {
                console.log("Details: ", details);
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
            {...register(`venues.${index}.address`,{
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

    return(
        <Flex mt={6}> 
            <Flex justifyContent={'center'} objectFit={'contain'} position={'relative'} alignItems={'center'} borderRadius={6} width={'100%'} height={'200px'} border={'1px solid #333333'}>
                {/* <Button textDecoration={'none'} onClick={onOpen} variant={'link'} colorScheme="brand">Upload a asset for your NFT</Button> */}
                <Image height={'100%'} w={'100%'} src={imageSrc.length>10?`https://nftstorage.link/ipfs/${imageSrc}`:`https://nftstorage.link/ipfs/${imageHashList[0]}`}/>
                <IconButton position={'absolute'} onClick={onOpen} bottom={'-2'} right={'-3'} aria-label="upload button" isRound variant={'ghost'} colorScheme="brand" size={'md'} icon={<ArrowUpIcon/>}/>
            </Flex>
            <Modal isCentered size={'xl'} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={'#252626'}>
                <ModalHeader color={'text.300'}>Choose Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={'1rem'} >
                    <ImageUploader name="logoImageHash"/> 
                    <ArtworkPicker onClose={onClose} onHandleArtworkSelection={handleSelectImage}/>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}



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
      <Flex bg={'#121212'} borderRadius={8} direction={'column'} justifyContent={'center'} height={'150px'} alignItems={'center'} cursor={'pointer'}>
        {/* <Image width={'100%'} border={'1px dashed #333333'} height={'300px'}  borderRadius={'10px'}  src={'/swamp-boys.jpg'} alt="judge photo-icon"/> */}
        <Text mb={'.6rem'} color={'text.300'} textStyle={'buttonLabel'}>Click here to upload</Text>
        <Text width={'70%'} textAlign={'center'} color={'text.200'}>Or choose an image below.  Please upload a PNG or JPEG that is 2400px x 1200px</Text>
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

function DirectImageUploader({name}:{name: string}){

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
      <Flex bg={'#252525'} direction={'column'} justifyContent={'center'} height={'150px'} alignItems={'center'} cursor={'pointer'}>
        {/* <Image width={'100%'} border={'1px dashed #333333'} height={'300px'}  borderRadius={'10px'}  src={'/swamp-boys.jpg'} alt="judge photo-icon"/> */}
        <Text mb={'.8rem'} color={'text.300'} textStyle={'buttonLabel'}>Click here to upload</Text>
        <Text width={'60%'} textAlign={'center'} color={'text.200'}>Or choose an image below.  Please upload a PNG or JPEG that is 2400px x 1200px</Text>
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
                <Box cursor={'pointer'}  mb={'1rem'} borderRadius={8}>
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
