export interface Service{
    productName: string,
    price: number,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string,
    quantity: number,
    id: string,
    description: string,
}
interface EventServices {
    id?: string,
    bottleService: Array<Service>,
    lineSkip: Array<Service>
}

export const allServices: Service[] = [
    {
        productName: 'Avery juice bar show line pro',
        price: 154.78,
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:40,
        serviceType:'lineSkip',
        quantity: 0,
        id:'1',
        description: 'Summer is around the corner and with the best way of knowing if it truly means something'
    },
    {
        productName: 'Tyler Perry bottle service',
        price: 13.51,
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:104,
        serviceType:'bottleService',
        quantity: 0,
        id:'2',
        
        description: 'Summer is around the corner and with the best way of knowing if it truly means something incredible things to come after a certain things'
    },
    
]

