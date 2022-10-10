

export type Event = {
    location: string,
    thumbnail: string,
    thumbnailAlt: string,
    serviceId: string,
    totalServices: number,
    juiceBar: string
}

export const events: Event[] = [{
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    serviceId:'1',
    totalServices:2,
    juiceBar: 'Mujeex Bar'
},
{
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    serviceId:'2',
    totalServices:2,
    juiceBar: 'Mujeex Bar'
},
{
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    serviceId:'3',
    totalServices:2,
    juiceBar: 'Mujeex Bar'
},
{
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    serviceId:'4',
    totalServices:2,
    juiceBar: 'Mujeex Bar'
},
{
    location:'No 16 West south paw',
    thumbnail:'/assets/placeholder.jpeg',
    thumbnailAlt: 'Description about the image',
    serviceId:'5',
    totalServices:2,
    juiceBar: 'Mujeex Bar'
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