import { Router } from 'express';
import itemController from './../controllers/item.controller';

class ItemsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router
            .get('/', itemController.item_getAll)
            .get('/:id', itemController.item_get);
    }
}

export default new ItemsRoutes().router;