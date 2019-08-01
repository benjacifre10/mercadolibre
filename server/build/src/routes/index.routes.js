"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_routes_1 = __importDefault(require("./item.routes"));
class IndexRoutes {
    constructor(index) {
        this.index = index;
        this.setRoutes();
    }
    setRoutes() {
        this.index.use(`/api/items`, item_routes_1.default);
    }
}
exports.default = IndexRoutes;
