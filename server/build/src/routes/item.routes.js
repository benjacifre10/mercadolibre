"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = __importDefault(require("./../controllers/item.controller"));
class ItemsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router
            .get('/', item_controller_1.default.item_getAll)
            .get('/:id', item_controller_1.default.item_get);
    }
}
exports.default = new ItemsRoutes().router;
