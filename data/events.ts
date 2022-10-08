

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
    serviceID: number,
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
    serviceID:1,
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
    serviceID:2,
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
    serviceID:3,
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
    serviceID:4,
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
    serviceID:5,
    totalTickets:134
}]

export const services=[{
    id:1,
    bottleService:[{
        productName: 'Coca Cola',
        price: '54',
        thumbnail: 'image string'
    },
    {
        productName: 'Sprite',
        price: '23',
        thumbnail: 'image string'   
    }],
    lineSkip:[{
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string'
    }]
}]