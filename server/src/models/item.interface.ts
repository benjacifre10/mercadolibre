export interface Item {
    author?: {
        name: string,
        lastname: string
    },
    item: {
        id: number | string,
        title: string,
        price: {
            currency: string,
            amount: number,
            decimals: number
        },
        picture: string,
        condition: string,
        free_shipping: boolean,
        state: string,
        sold_quantity?: number,
        description?: string
    }
}