import { Item } from "./item.interface";

export interface Items {
    author?: {
        name: string,
        lastname: string
    },
    categories?: Array<string>,
    items: Array<Item>
}