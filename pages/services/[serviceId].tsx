import React,{useEffect,useState} from 'react'
import {Box,Flex, Heading,useDisclosure} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList/TicketList'
import TicketSearchBar from '../../components/ServicesPage/TicketSearchBar/TicketSearchBar'
import PaymentModal from '../../components/ServicesPage/ProcessOrderModal/ProcessOrderModal'



export default function ServicesPage(){
    
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
  
        const targetTicket = allServices.find(service=>service.id===id);
        targetTicket!.quantity = 1;
        const clonedCart = cart.slice();
        clonedCart.push(targetTicket);
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


    const createOrder = ()=>{
        // show confirmation modal
        // check if user is logged in
        // call stripe api
        // mint tokens on success
        showPaymentModal()
        clearCart()
    }

    const clearCart = ()=>{
        setCart([]);
    }

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='0.8' h='100%' p='2'>
                </Flex>
                <Flex h='100%' direction='column'  flex='2'>
                    <Heading as='h1' mb='2' size='lg'>Avery Juice Bar</Heading>
                    <TicketSearchBar/>
                    <TicketList onAddToCart={addToCartHandler} services={allServices}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <Cart onCreateOrder={createOrder} onIncrementCartItemQuantity={incrementCartItemQuantity} onRemoveCartItem={removeCartItemHandler} tickets={cart}/>
                </Flex>
            </Flex>
            <PaymentModal 
              onCloseModal={onClose} 
              isModalOpen={isOpen} 
              cart={cart}
              totalCost = {50}
              />
        </Box>
    )
}