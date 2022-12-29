import React from 'react'
import {Flex,HStack,Box, MenuDivider,Avatar,Menu, MenuButton, MenuList, MenuItem, Button,Text,Image} from '@chakra-ui/react'
import Link from 'next/link'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../utils/localStorage'

export default function Header(){

    const {isAuthenticated,setIsAuthenticated,logout} = useAuthContext()
    const {push, asPath, basePath} = useRouter()

    const login =()=>{
        const currentPath = `${asPath}${basePath}`
        setStorage('lastVisitedPage',currentPath)
        location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
        // location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
    }

    return(
        <Flex bg='#121212' w='100%'  boxShadow='0px 1px 1px 0px #2b2b2b' alignItems='center' justifyContent='space-between' py='1rem'  px='1rem' h='100%' minH='5vh'>
            <Link href='/'>
               <a> <Image src='/logoSmall.png' w={['150px','200px']} height={'15px'} alt='Logo of flexable app'/></a>
            </Link>
            <Flex as='nav'>
                {
                    isAuthenticated?
                        <Menu>                            
                            <MenuButton>
                                <Avatar src='/avatar.png'/>
                            </MenuButton>
                             <MenuList borderColor="#2b2b2b" bg='#121212'>
                                <MenuItem bg='#121212'>
                                    <Text textStyle={'secondary'} color='text.300'>My Profile</Text>
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
                    : <Button variant={'solid'} onClick={login}>Login</Button>
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