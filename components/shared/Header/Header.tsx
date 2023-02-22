import React from 'react'
import {Flex,HStack,Box, MenuDivider,Avatar,Menu, MenuButton, MenuList, MenuItem, Button,Text,Image} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../utils/localStorage'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export default function Header(){

    const {isAuthenticated,setIsAuthenticated, paseto,logout} = useAuthContext()
    const {push, asPath, basePath} = useRouter()

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

    return(
        <Flex bg='#121212' w='100%'  boxShadow='0px 1px 1px 0px #2b2b2b' alignItems='center' justifyContent='space-between' py='.2rem'  px='1rem' h='100%' minH='3vh'>
            <Link href='/'>
               <a> <Image src='/new_logo.svg' w={['150','200']} height={'70px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    isAuthenticated?
                        <Menu>                            
                            <MenuButton>
                                <Avatar  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${profilePicHash}`}/>
                            </MenuButton>
                             <MenuList borderColor="#2b2b2b" bg='#121212'>
                                <MenuItem bg='#121212'>
                                    <Text textStyle={'secondary'} onClick={()=>push('/profile')} color='text.300'>My Profile</Text>
                                </MenuItem>
                                <MenuItem bg='#121212'>
                                    <Text aria-label='button' textStyle={'secondary'} onClick={()=>push('/dats')} color='text.300'>My Dats</Text>
                                </MenuItem>
                                <MenuDivider/>
                                <MenuItem bg='#121212'>
                                    <Text textStyle={'secondary'} color='state.danger' onClick={logout}>Logout</Text>
                                </MenuItem>
                             </MenuList>
                        </Menu>
                    : <Button colorScheme={'brand'} variant={'solid'} onClick={login}>Login</Button>
                }
                
            </Flex>
        </Flex>
    )
}


{/* <HStack spacing={3}>
                     <Link href='/dats'>
                        <a><Text fontWeight='medium'>My Dats</Text></a>
                    </Link>
                    <Button variant='link' onClick={logout}>Logout</Button>
                    </HStack> */}