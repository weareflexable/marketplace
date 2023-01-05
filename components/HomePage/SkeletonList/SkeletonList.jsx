
import {Wrap, WrapItem,SkeletonText, SkeletonCircle, Flex, Avatar, Skeleton} from '@chakra-ui/react'

export default function SkeletonList(){
    return(
        <Wrap w='100%' padding={[3,5]} spacing={5} alignItems='center' justifyContent='center'> 
                      {Array(5)
                        .fill('')
                        .map((_, i) => (
                        <WrapItem flexGrow={'1'} flexBasis={['100%','22%']} maxWidth={['100%','24%']} key={i}>
                               <Flex width={'100%'}  direction={'column'}>
                                    <Skeleton height='250px' borderRadius='6px' width={'100%'}/>
                                    <Flex px='2' mt={[3,3,4]} width={'100%'} alignItems={'center'}>
                                        <SkeletonCircle>
                                        <Avatar size='sm'/>
                                        </SkeletonCircle>
                                        {/* <Flex ml={[3,3,4]} width='100%' direction='column'> */}
                                            <SkeletonText ml={'2'} width='100%' noOfLines={2} spacing='2' skeletonHeight='2'/>
                                        {/* </Flex> */}
                                    </Flex>
                                </Flex>
                        </WrapItem> 
                    ))}
        </Wrap>
    )
}