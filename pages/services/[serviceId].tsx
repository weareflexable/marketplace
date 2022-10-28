import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, Heading,useDisclosure,Image,SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList/TicketList'
import TicketSearchBar from '../../components/ServicesPage/TicketSearchBar/TicketSearchBar'
import PaymentModal from '../../components/ServicesPage/ProcessOrderModal/ProcessOrderModal'
import {useQuery} from '@tanstack/react-query'
import { useCheckoutContext } from '../../context/CheckoutContext'
import StoreHeader from '../../components/ServicesPage/StoreHeader/StoreHeader'
import dayjs from 'dayjs'
import { setStorage } from '../../utils/localStorage'
import { MdAddShoppingCart } from 'react-icons/md'
import MobileCart from '../../components/ServicesPage/Cart/MobileCart/MobileCart'


export default function ServicesPage(){

    const {query,push} = useRouter();
    const {setAmount,setCart:setCartItems} =  useCheckoutContext()
    const [cart, setCart] = useState<Service[]>([]);
    const [serviceDate, setServiceDate] = useState(dayjs().format('MMM-D-YYYY'))
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
    
    const formatedDate = dayjs(serviceDate).format('YYYY-MMM-DD')

    const {isLoading,data,isError} = useQuery(['store-service',query.serviceId,formatedDate],async()=>{
        const res = await fetch(`https://platform.flexabledats.com/api/v1.0/services/public/${query.serviceId}?date=${formatedDate}`) 
        const body = await res.json()
        console.log(body)
        return body
      },)

    
    const { isOpen, onOpen:showPaymentModal, onClose } = useDisclosure()


    const changeServiceDate =(date:string)=>{
        setServiceDate(date)
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
  
        let clonedServices = data.payload.serviceItems.slice() 
        let targetTicket = clonedServices.find((service:any)=>service.id===id);

        // add quantity field to service
        const serviceWithQuantity = {
            ...targetTicket,
            quantity:1
        }

        const clonedCart = cart.slice();
        clonedCart.push(serviceWithQuantity);
        console.log(clonedCart)
        setCart(clonedCart);

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
        console.log(targetItem);
        setCart(clonedCart);
    }
    const decrementCartItemQuantity = (id: string)=>{
        const clonedCart = cart.slice();
        const targetItem = clonedCart.find(cartItem=>cartItem.id === id);
        targetItem!.quantity--
        console.log(targetItem);
        setCart(clonedCart);
    }


    const createOrder = (totalCost:number)=>{
        setAmount(totalCost);
        showPaymentModal()
    }


    const loginBeforePayment = (totalCost:number)=>{
        // this is to tell browser that payment was initiated before login
            // setStorage('paymentStatus','pending')
            setAmount(totalCost)
            setCartItems(cart)
            push('/landing')
        
    }

    useEffect(() => {
        // if(cart.length<1){
        //     setIsCartDrawerOpen(false)
        // }
      return () => {
        if(cart.length>0){
           setStorage('paymentStatus','pending')
        }
      };
    }, [cart])

        
        return(
    <DarkMode>
        <Box position={'relative'} minH='100vh' h='100%' layerStyle={'base'}>
            <Header/>
            <SimpleGrid mt='2' columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    <Skeleton w='100%' isLoaded={!isLoading}>
                        <StoreHeader
                         coverImageHash={data && data.payload.coverImageHash}
                         storeName={data && data.payload.name}
                         lat = {data && data.payload.lat}
                         lon = {data && data.payload.lon}
                         city = { data &&data.payload.city}
                         state = {data && data.payload.state}
                         />
                    </Skeleton>

                    <Skeleton my='1' isLoaded={!isLoading}>
                        <TicketSearchBar
                            date={serviceDate}
                            onChangeDate = {changeServiceDate}
                            />
                    </Skeleton>

                        <Skeleton height='200px' isLoaded={!isLoading}>
                            <TicketList onAddToCart={addToCartHandler} services={data && data.payload.serviceItems}/>
                        </Skeleton>

                </Flex> 

                    {/* Dont render web cart on mobile */}
                <Flex display={['none','none','flex']} gridColumnStart={6} gridColumnEnd={8} h='100%'>
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
                <Flex display={['flex','flex','none']} width={'100%'}>
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
                width='50px'
                height='55px' 
                position='absolute'
                bottom ='3%'
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

            <PaymentModal 
              onCloseModal={onClose} 
              isModalOpen={isOpen} 
              cart={cart}
              totalCost = {50}
              />
        </Box>
    </DarkMode>
    )
}