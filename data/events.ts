

export type Event = {
    organiser: string,
    price: number,
    title: string,
    startDate: string,
    endDate: string,
    location: string,
    thumbnail: string,
    thumbnailAlt: string,
    category: string,
    eventId: string,
    totalTickets: number
}

export const events: Event[] = [{
    organiser:'Brains&Hammer',
    price: 65,
    title: 'Exclusive Materials Workshop',
    startDate:'',
    endDate: '',
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    category: 'Construction',
    eventId:'1',
    totalTickets:34
},
{
    organiser:'Microsoft',
    title: 'Typescipt Workshop',
    price: 15,
    startDate:'',
    endDate: '',
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg'  ,
    thumbnailAlt: 'Description about the image',
    category: 'Tech',
    eventId:'2',
    totalTickets:64
},
{
    organiser:'Avery Juice Bar',
    title: 'Health benefits to careers',
    price: 50,
    startDate:'',
    endDate: '',
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    category: 'Heath',
    eventId:'3',
    totalTickets:741
},
{
    organiser:'Coco Channel Perfumes',
    title: 'Perfumes for the fashion savvy',
    price: 43,
    startDate:'',
    endDate: '',
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    category: 'Fashion',
    eventId:'4',
    totalTickets:654
},
{
    organiser:'World Health Organisation (WHO)',
    title: 'Humanitarian Aid Facilities',
    price: 12,
    startDate:'',
    endDate: '',
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    category: 'Government',
    eventId:'5',
    totalTickets:134
}]


type Service={
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string
}
export type EventServices = {
    id?: string,
    bottleService: Array<Service>,
    lineSkip: Array<Service>
}

export const services: EventServices[] =[{
    id:'1',
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }]
},
{
    id:'2',
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }]
},
{
    id:'3',
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }]
},
{
    id:'4',
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }]
},
{
    id:'5',
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }]
}]