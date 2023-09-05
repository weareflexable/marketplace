import React from 'react'
import {Flex,HStack,Box, Skeleton, MenuDivider,Avatar,Menu, MenuButton, MenuList, MenuItem, Button,Text,Image} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../utils/localStorage'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { IMAGE_PLACEHOLDER_HASH } from '../../../constants'
import { AddIcon } from '@chakra-ui/icons'



export default function Header(){

    const {isAuthenticated,setIsAuthenticated, paseto,logout} = useAuthContext()
    const {push, asPath, replace, basePath} = useRouter()

    async function fetchUserDetails(){
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`,{
          headers:{
            "Authorization": paseto
          }
        })
        return res.data.data
      }

     const userQuery = useQuery({
        queryKey:['user'],  
        queryFn: fetchUserDetails,
        cacheTime: Infinity,
        staleTime:Infinity,
        enabled:paseto!=='' ,
        retry: (failureCount, error) =>{
          if(failureCount >2) return false
          return true  
        },
        // onSettled:(res)=>{
        //     console.log(res)
        // },
        onSuccess:(res)=>{
            const statusCode = res.status
            if(statusCode === 401){
                //@ts-ignore
                setIsAuthenticated(false)
                // clear all caches
                localStorage.clear()
            } 
        },
        onError:(error:any)=>{
            const statusCode = error.status
            if(statusCode === 401){
                //@ts-ignore
                setIsAuthenticated(false)
                // clear all caches
                localStorage.clear()
            }
        }
    })



    const profilePicHash = userQuery.data && userQuery.data.length > 0 ? userQuery.data[0].profilePic: IMAGE_PLACEHOLDER_HASH


    const login =()=>{
        const currentPath = `${asPath}${basePath}`
        localStorage.setItem('lastVisitedPage',currentPath)
        location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
        // location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
    }

 



    return(
        <Flex bg='#121212' w='100%'  boxShadow='0px 1px 1px 0px #2b2b2b' alignItems='center' justifyContent='space-between' py='.2rem'  px='1.2rem'>
            <Link href='/'>
               <a> <Image src='/new_logo.svg' w={['150','200']} height={'60px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    !isAuthenticated 
                    ? <Button colorScheme={'brand'} variant={'solid'} onClick={login}>Login</Button>
                    :  userQuery.isFetched && !isAuthenticated
                    ? <Skeleton mx='1rem'  startColor='#2b2b2b' endColor="#464646" width={'3rem'} height={'1.5rem'}/>
                    :
                    <HStack spacing={3}>   
                    <CreateOptions/> 
                    <Menu>                            
                        <MenuButton>
                            <Avatar size={'sm'}  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${profilePicHash?profilePicHash:IMAGE_PLACEHOLDER_HASH}`}/>
                        </MenuButton>
                            <MenuList zIndex='6' borderColor="#2b2b2b" bg='#121212'>
                            <MenuItem onClick={()=>push('/dats')}  bg='#121212'>
                                <Text textStyle={'secondary'}  color='text.300'>My DATs</Text>
                            </MenuItem>
                            <MenuDivider/>
                            <MenuItem onClick={()=>push('/profile')} bg='#121212'>
                                <Text textStyle={'secondary'}  color='text.300'>My Profile</Text>
                            </MenuItem>
                            <MenuDivider/>
                            <MenuItem bg='#121212'>
                                <Text textStyle={'secondary'} color='state.danger' onClick={logout}>Logout</Text>
                            </MenuItem>
                            </MenuList>
                    </Menu>
                    
                    </HStack>
                    
                }
                
            </Flex>
        </Flex>
    )
}



function LoadingHeader(){
    return(
        <Flex bg='#121212' w='100%'  boxShadow='0px 1px 1px 0px #2b2b2b' alignItems='center' justifyContent='space-between' py='.2rem'  px='1rem' h='100%' minH='3vh'>
            <Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" width={'3re'} height={'1rem'}/>
            <Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'1rem'}/>
        </Flex>
    )
}


function CreateOptions(){
    const router = useRouter()
    return(
        <Menu>                            
        <MenuButton>
            <Button size={'sm'} variant={'outline'} colorScheme='brand' leftIcon={<AddIcon/>}>Create</Button> 
        </MenuButton>
            <MenuList zIndex='6' borderColor="#2b2b2b" bg='#121212'>
            <MenuItem onClick={()=>router.push('/create/exclusiveAccess')}  bg='#121212'>
                <Text textStyle={'secondary'}  color='text.300'>New Exclusive Access</Text>
            </MenuItem>
            <MenuItem onClick={()=>router.push('/create/event')} bg='#121212'>
                <Text textStyle={'secondary'}  color='text.300'>New Event</Text>
            </MenuItem>
            <MenuItem onClick={()=>router.push('/create/community')} bg='#121212'>
                <Text textStyle={'secondary'}  color='text.300'>New Community</Text>
            </MenuItem>
            </MenuList>
    </Menu>
    )
}