export type Event = {
    id: string,
    name: string,
    price: number,
    isVirtual?:boolean,
    coverImageHash: string,
    date: string,
    startTime: string,
    duration: string,
    timeZone: string
    status: string,
    address: {
        street: string,
        country: string,
        city: string,
        state: string,
    }
    description: string,
    createdBy: string
    updatedBy: string
    createdAt: string
}