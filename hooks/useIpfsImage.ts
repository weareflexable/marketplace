import {useState,useEffect} from 'react'



const useIpfsImage=(imageHash:string)=>{

    const [isFetchingImage, setIsFetchingImage] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [isError, setIsError] = useState(false)

    useEffect(() => {

        async function fetchImage(ipfsUrl:string){
            const url = ipfsToHttps(ipfsUrl)
            setIsFetchingImage(true)
            const fetchRes = await fetch(url);
            try {
                const body = await fetchRes.json();
                setImageSrc(body)
                setIsFetchingImage(false)
                
            } catch (error) {
                console.log(error)
                setIsFetchingImage(false)
                setIsError(true)
                setImageSrc('')
            }
        }

        fetchImage(imageHash)

    }, [])


    return {isFetchingImage, isError, imageSrc}

}

// helper function to transform uri with this format: ipfs://

 function ipfsToHttps(ipfsUrl: string) {
    const ipfsPrefix = "https://nftstorage.link/ipfs/";
    const url = ipfsUrl.replace("ipfs://", ipfsPrefix);
    return url
}

export default useIpfsImage