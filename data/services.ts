export interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string,
    id: string
}
interface EventServices {
    id?: string,
    bottleService: Array<Service>,
    lineSkip: Array<Service>
}

export const allServices: Service[] = [
    {
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:40,
        serviceType:'lineSkip',
        id:'1'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:45,
        serviceType:'bottleService',
        id:'2'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:51,
        serviceType:'lineSkip',
        id:'3'
    }
]

