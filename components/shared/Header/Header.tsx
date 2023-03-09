import React from 'react'
import {Flex,HStack,Box, Skeleton, MenuDivider,Avatar,Menu, MenuButton, MenuList, MenuItem, Button,Text,Image} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../utils/localStorage'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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
        enabled:paseto!=='' ,
        staleTime: Infinity
    })


    const profilePicHash = userQuery.data && userQuery.data[0].profilePic


    const login =()=>{
        const currentPath = `${asPath}${basePath}`
        setStorage('lastVisitedPage',currentPath)
        location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
        // location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
    }

    function navigate(route:string){
        console.log(route)
    }



    return(
        <Flex bg='#121212' w='100%'  boxShadow='0px 1px 1px 0px #2b2b2b' alignItems='center' justifyContent='space-between' py='.2rem'  px='1rem' h='100%' minH='3vh'>
            <Link href='/'>
               <a> <Image src='/new_logo.svg' w={['150','200']} height={'70px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    !isAuthenticated
                    ? <Button colorScheme={'brand'} variant={'solid'} onClick={login}>Login</Button>
                    :  userQuery.isFetched && !isAuthenticated
                    ? <Skeleton mx='1rem'  startColor='#2b2b2b' endColor="#464646" width={'3rem'} height={'1.5rem'}/>
                    :   <Menu>                            
                            <MenuButton>
                                <Avatar  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${profilePicHash}`}/>
                            </MenuButton>
                             <MenuList zIndex='3' borderColor="#2b2b2b" bg='#121212'>
                                <MenuItem onClick={()=>push('/profile')} bg='#121212'>
                                    <Text textStyle={'secondary'}  color='text.300'>My Profile</Text>
                                </MenuItem>
                                <MenuItem onClick={()=>push('/dats')}  bg='#121212'>
                                    <Text textStyle={'secondary'}  color='text.300'>My Dats</Text>
                                </MenuItem>
                                <MenuDivider/>
                                <MenuItem bg='#121212'>
                                    <Text textStyle={'secondary'} color='state.danger' onClick={logout}>Logout</Text>
                                </MenuItem>
                             </MenuList>
                        </Menu>
                    
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