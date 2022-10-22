import React,{useEffect,useState} from 'react'
import {Box,Flex, Heading,useDisclosure,Image,SimpleGrid} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList/TicketList'
import TicketSearchBar from '../../components/ServicesPage/TicketSearchBar/TicketSearchBar'
import PaymentModal from '../../components/ServicesPage/ProcessOrderModal/ProcessOrderModal'
import BarHeader from '../../components/ServicesPage/BarHeader/BarHeader'
import {useQuery} from '@tanstack/react-query'
import { useCheckoutContext } from '../../context/CheckoutContext'


export default function ServicesPage(){

    const {query} = useRouter();
    const {setAmount} =  useCheckoutContext()

    const {isLoading,data,isError} = useQuery(['store-service',query.serviceId],async()=>{
        const res = await fetch(`https://platform.flexabledats.com/api/v1.0/services/public/${query.serviceId}?date=2022-Dec-03`) 
        const body = await res.json()
        console.log(body)
        return body
      })

    
    const { isOpen, onOpen:showPaymentModal, onClose } = useDisclosure()

    const [cart, setCart] = useState<Service[]>([]);

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
        let targetTicket = clonedServices.find(service=>service.id===id);

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


    const createOrder = (totalCost:number)=>{
        setAmount(totalCost);
        showPaymentModal()
    }


    return(
        <Box>
            <Header/>
            <SimpleGrid columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    <BarHeader/>
                    <TicketSearchBar/>
                    <TicketList onAddToCart={addToCartHandler} services={data && data.payload.serviceItems}/>
                </Flex> 
                <Flex flex='1' gridColumnStart={6} gridColumnEnd={8} h='100%' p='2'>
                    {cart.length>0?<Cart onCreateOrder={createOrder} onIncrementCartItemQuantity={incrementCartItemQuantity} onRemoveCartItem={removeCartItemHandler} tickets={cart}/>:null}
                </Flex>
            </SimpleGrid>
            <PaymentModal 
              onCloseModal={onClose} 
              isModalOpen={isOpen} 
              cart={cart}
              totalCost = {50}
              />
        </Box>
    )
}