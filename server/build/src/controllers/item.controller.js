"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./../config/connection"));
const request = require('request');
//import { convertToJson } from './../helpers/converts';
class ItemController {
    item_getAll(req, res) {
        try {
            let url = `${connection_1.default.api.gets}?q=${req.query.q}`;
            request(url, function (error, response, body) {
                if (error) {
                    return res.status(response.statusCode).json({
                        message: 'Error al intentar listar la búsqueda'
                    });
                }
                const data = JSON.parse(body);
                const filters = data.filters;
                let items = {
                    author: {
                        name: 'Benjamín',
                        lastname: 'Cifre'
                    },
                    items: [],
                    categories: []
                };
                for (let filter of filters) {
                    if (filter.id === 'category') {
                        const values = filter.values;
                        for (let value of values) {
                            if (value.path_from_root) {
                                const categories = value.path_from_root;
                                let categoryArray = [];
                                for (let category of categories) {
                                    categoryArray.push(category.name);
                                }
                                items.categories = categoryArray;
                                break;
                            }
                        }
                        break;
                    }
                }
                const dataResult = data.results.slice(0, 4);
                let listItems = [];
                for (let res of dataResult) {
                    let precio = res.price.toString().split('.');
                    let item = {
                        item: {
                            id: res.id,
                            title: res.title,
                            price: {
                                currency: (res.currency_id = 'ARS' ? '$' : 'U$S'),
                                amount: precio[0],
                                decimals: precio[1] ? parseInt(precio[1]) : 0
                            },
                            picture: res.thumbnail,
                            condition: res.condition,
                            free_shipping: res.shipping.free_shipping,
                            state: res.seller_address.state.name
                        }
                    };
                    listItems.push(item.item);
                }
                items.items = listItems;
                return res.status(response.statusCode).json({
                    message: 'Items encontrados',
                    value: items
                });
            });
        }
        catch (error) {
            return res.status(400).json({
                message: 'Error Encontrado'
            });
        }
    }
    item_get(req, res) {
        try {
            let url = `${connection_1.default.api.get}/${req.params.id}`;
            request(url, function (error, response, body) {
                if (error) {
                    return res.status(response.statusCode).json({
                        message: 'Error al intentar acceder al objeto'
                    });
                }
                const data = JSON.parse(body);
                let precio = data.price.toString().split('.');
                let item = {
                    author: {
                        name: 'Benjamín',
                        lastname: 'Cifre'
                    },
                    item: {
                        id: data.id,
                        title: data.title,
                        price: {
                            currency: (data.currency_id = 'ARS' ? '$' : 'U$S'),
                            amount: precio[0],
                            decimals: precio[1] ? parseInt(precio[1]) : 0
                        },
                        picture: data.thumbnail,
                        condition: data.condition,
                        free_shipping: data.shipping.free_shipping,
                        state: data.seller_address.state.name,
                        sold_quantity: data.sold_quantity,
                        description: ''
                    }
                };
                url = `${url}/description`;
                request(url, function (error, response, body) {
                    if (error) {
                        return res.status(response.statusCode).json({
                            message: 'Error al intentar acceder a la descripción del objeto'
                        });
                    }
                    const data2 = JSON.parse(body);
                    item.item.description = data2.plain_text;
                    return res.status(response.statusCode).json({
                        message: 'Items encontrado',
                        value: item
                    });
                });
            });
        }
        catch (error) {
            return res.status(400).json({
                message: 'Error Encontrado'
            });
        }
    }
}
exports.default = new ItemController();
