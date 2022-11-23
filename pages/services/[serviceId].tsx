import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, Heading,useDisclosure,Image,SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList/TicketList'
import TicketSearchBar from '../../components/ServicesPage/TicketSearchBar/TicketSearchBar'
import CartSummary from '../../components/ServicesPage/CartSummary/CartSummary'
import {useQuery} from '@tanstack/react-query'
import { useCheckoutContext } from '../../context/CheckoutContext'
import StoreHeader from '../../components/ServicesPage/StoreHeader/StoreHeader'
import { deleteStorage, getStorage, setStorage } from '../../utils/localStorage'
import { MdAddShoppingCart } from 'react-icons/md'
import MobileCart from '../../components/ServicesPage/Cart/MobileCart/MobileCart'
import MobileCartSummary from '../../components/ServicesPage/CartSummary/MobileCartSummary/MobileCartSummary'
import moment from 'moment-timezone'
import useLocalStorage from '../../hooks/useLocalStorage'
import useDrawerState from '../../hooks/useDrawerState'
import Head from 'next/head'


export default function ServicesPage(){

    const {query,push,asPath,basePath} = useRouter();
    const {setAmount,setCart:setCartItems} =  useCheckoutContext()
    const {state:cart, setState:setCart} = useLocalStorage([]);

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<any>({})
    const [serviceDate, setServiceDate] = useState(()=>Date())

    // TODO: mark state to show that it interacts with local storage

    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
    const [isProcessDrawerOpen, setIsProcessDrawerOpen] = useState(false)

    const [isLargerThan62] = useMediaQuery('(min-width: 62em)')

    // Format date to format understood by API
    // const formatedDate = moment(serviceDate))
    // Extract service ID from query params to be used for data fetching
    // const pageQueryParam = query.serviceId
    const pageQueryParam = asPath+basePath
    // console.log(asPath,basePath)
    const serviceId = query.serviceId;

    
    // const {isLoading,data,isError} = useQuery(['store-service',{pageQueryParam,serviceDate}],async()=>{
        
    //     console.log(serviceId, date)
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/public/${serviceId}?date=${date}`) 
    //     const body = await res.json()
    //     console.log(body)
    //     return body
    // })

    useEffect(() => {
      async function getService(){
        setIsLoading(true)
        // console.log(serviceId, date)
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/public/${serviceId}?date=${serviceDate}`) 
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/public/${serviceId}?date=${moment(serviceDate).format('YYYY-MMM-DD')}`) 
        const body = await res.json()
        if(body.status === 200){
            setIsLoading(false)
            setData(body)
            console.log(body)
        }
      }
      getService()
    }, [serviceId,serviceDate])

    const { isOpen, onOpen:showPaymentModal, onClose } = useDisclosure()

    // effect to check if mobile cart was open before user got redirect to login page
    useEffect(()=>{
        const isCartOpenBeforeLogin = getStorage('isCartOpenBeforeLogin');
        if(isCartOpenBeforeLogin === 'true'){
            // Open cart drawer back up
            setIsCartDrawerOpen(true)
            // Then immediately clear storage
            deleteStorage('isCartOpenBeforeLogin')
        } 
    },[])


    // Update service date state in order to trigger a refresh with newly set date.
    const changeServiceDate =(date:string)=>{
        console.log('from service',moment(date).format('YYYY-MMM-DD'))
        const formatedDate = moment(date).format('YYYY-MMM-DD')
        setStorage('selectedDate', formatedDate)
    }

    // TODO: rename to cartItemExist
    const checkCartItemExist = (id:string)=>{
        const clonedCart = cart.slice()
        return clonedCart.filter(cartItem=>cartItem.id === id).length>0 ? true: false;
    } 


    const addToCartHandler = (id:string)=>{

        // dont duplicate items in cart
        // TODO: find better name for this
        const isDuplicateCartItem = checkCartItemExist(id)
        if(isDuplicateCartItem) return
  
        let clonedServices = data && data.payload.serviceItems.slice() 
        let targetTicket = clonedServices.find((service:any)=>service.id===id);

        // add quantity field to service
        const serviceWithQuantity = {
            ...targetTicket,
            venue: data.payload.name ,
            quantity:1
        }

        const clonedCart = cart.slice();
        clonedCart.push(serviceWithQuantity);
        console.log(clonedCart)
        setCart(clonedCart);
        setCartItems(clonedCart)
        // always clear instant purchase whenever user adds to cart
        deleteStorage('instantBuy')

    }

    const removeCartItemHandler = (id:string)=>{
        const clonedCart = cart.slice();
        const targetIndex = clonedCart.findIndex(cartItem=>cartItem.id === id)
        clonedCart[targetIndex].quantity = 0;
        const updatedBookings = clonedCart.filter(cartItem=>cartItem.id !== id);
        setCart(updatedBookings);
    }

    const incrementCartItemQuantity = (id: string)=>{
        const clonedCart = cart.slice();
        const targetItem = clonedCart.find(cartItem=>cartItem.id === id);
        targetItem!.quantity++
        setCart(clonedCart);
    }
    const decrementCartItemQuantity = (id: string)=>{
        const clonedCart = cart.slice();
        const targetItem = clonedCart.find(cartItem=>cartItem.id === id);
        targetItem!.quantity--
        setCart(clonedCart);
    }


    const createOrder = (totalCost:number)=>{
       setAmount(totalCost); // remove this
       isLargerThan62? showPaymentModal(): setIsProcessDrawerOpen(true)
    }


    const loginBeforePayment = (totalCost:number)=>{
        // this is to tell browser that payment was initiated before login
            setAmount(totalCost)
            setCartItems(cart)
            // set current path
            const currentPath = `${asPath}${basePath!==''? basePath:'/'}`
            setStorage('lastVisitedPage',currentPath)

            // store that login was clicked from here
            setStorage('isCartOpenBeforeLogin', 'true')

            push('/landing')
        
    }

        
        return(
    <DarkMode>
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
      </Head>
        <Box position={'relative'} minH='100vh' h='100%' layerStyle={'base'}>
            <Header/>
            <SimpleGrid mt='2' columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    <Skeleton w='100%' isLoaded={!isLoading}>
                        <StoreHeader 
                         coverImageHash={data && data.payload && data.payload.coverImageHash || ''}
                         storeName={data && data.payload && data.payload.name}
                         lat = {data && data.payload && data.payload.lat}
                         lon = {data && data.payload && data.payload.lon}
                         city = { data && data.payload && data.payload.city}
                         state = {data && data.payload && data.payload.state}
                         />
                    </Skeleton>

                    <Skeleton my='1' isLoaded={!isLoading}>
                        <TicketSearchBar
                            date={serviceDate}
                            onChangeDate = {changeServiceDate}
                            />
                    </Skeleton>

                        <Skeleton height='200px' isLoaded={!isLoading}>
                            <TicketList 
                                date={serviceDate}
                                onAddToCart={addToCartHandler} 
                                services={data && data.payload && data.payload.serviceItems}
                            />
                        </Skeleton>

                </Flex> 

                    {/* Dont render web cart on mobile */}
                <Flex display={['none','none','none','flex']} gridColumnStart={6} gridColumnEnd={8} h='100%'>
                    {cart.length>0?
                        <Cart 
                            onCreateOrder={createOrder} 
                            onIncrementCartItemQuantity={incrementCartItemQuantity} 
                            onDecrementCartItemQuantity={decrementCartItemQuantity} 
                            onRemoveCartItem={removeCartItemHandler} 
                            loginBeforePayment = {loginBeforePayment}
                            tickets={cart}
                        />
                    :null}
                </Flex>

                {/* Dont render mobile cart on large screen */}
                <Flex display={['flex','flex','flex','none']} width={'100%'}>
                    <MobileCart
                        onCreateOrder={createOrder} 
                        onIncrementCartItemQuantity={incrementCartItemQuantity} 
                        onDecrementCartItemQuantity={decrementCartItemQuantity} 
                        onRemoveCartItem={removeCartItemHandler} 
                        loginBeforePayment = {loginBeforePayment}
                        tickets={cart}
                        isDrawerOpen={isCartDrawerOpen}
                        onCloseDrawer={()=>setIsCartDrawerOpen(false)}
                    />
                </Flex>

            </SimpleGrid>
            {/* cart button to only display on mobile */}
            {cart.length>0?
                <Box
                display={['block','block','block','none']}
                width='50px'
                height='55px' 
                position='absolute'
                bottom ='8%'
                right='10%'
                >
                    <Center zIndex={2} position='absolute' borderRadius={'50%'} w='20px' h='20px' bg='tomato' color='white'>
                        <Text fontSize='12px' fontWeight='bold'>{cart.length}</Text>
                    </Center>

                     <IconButton 
                        isRound
                        onClick={()=>setIsCartDrawerOpen(true)}
                        colorScheme='teal'
                        aria-label='Open cart'
                        size='lg'
                        icon={<MdAddShoppingCart color='cyan.300'/>}
                      />
                </Box>
            :null}

            <CartSummary 
              onCloseModal={onClose} 
              isModalOpen={isOpen} 
              cart={cart}
              totalCost = {50}
              />

              <MobileCartSummary
                onCloseDrawer={()=>setIsProcessDrawerOpen(false)} 
                isDrawerOpen={isProcessDrawerOpen} 
                cart={cart}
                totalCost = {50}
              />
        </Box>
    </DarkMode>
    )
}