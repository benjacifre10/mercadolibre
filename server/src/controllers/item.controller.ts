import { Request, Response } from 'express';
import api from './../config/connection';
const request = require('request');
import { Item } from './../models/item.interface';
import { Items } from './../models/items.inteface';
import itemRoutes from '../routes/item.routes';
//import { convertToJson } from './../helpers/converts';

class ItemController {

    public item_getAll(req: Request, res: Response) {
        try {
            let url = `${api.api.gets}?q=${req.query.q}`;
            request(url, function (error: any, response: any, body: any) {
              if (error) {
                return res.status(response.statusCode).json({
                    message: 'Error al intentar listar la búsqueda'
                });
              }
              const data = JSON.parse(body);
              const filters = data.filters;
              let items: Items = {
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
                              let categoryArray: Array<string> = [];
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
              let listItems: Array<any> = [];
              for(let res of dataResult) {
                  let precio = res.price.toString().split('.');
                  let item: Item = {
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
        } catch (error) {
            return res.status(400).json({
                message: 'Error Encontrado'
            });
        }
    }
    
    public item_get(req: Request, res: Response) {
        try {
            let url = `${api.api.get}/${req.params.id}`;
            request(url, function (error: any, response: any, body: any) {
                if (error) {
                    return res.status(response.statusCode).json({
                        message: 'Error al intentar acceder al objeto'
                    });
                }
                const data = JSON.parse(body);
                let precio = data.price.toString().split('.');
                let item: Item = {
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
                request(url, function (error: any, response: any, body: any) {
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
        } catch (error) {
            return res.status(400).json({
                message: 'Error Encontrado'
            });
        }
    }

}

export default new ItemController();