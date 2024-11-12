"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class UsersController {
    async index({ inertia }) {
        const users = await Database_1.default.from("users").select(['id', 'name', 'email']);
        return inertia.render("users", { users });
    }
    async create({ inertia }) {
        return inertia.render("user-create");
    }
    async store({ request, response }) {
        await User_1.default.create({
            name: request.input("name"),
            email: request.input("email"),
            password: request.input("password")
        });
        return response.redirect('/users');
    }
    async show({}) { }
    async edit({ inertia, params }) {
        const users = await Database_1.default.from("users").where("id", params.id).select(['id', 'name', 'email']);
        return inertia.render("user-create", { users });
    }
    async update({ params, request, response }) {
        const user = await User_1.default.query().where("id", params.id).first();
        if (user) {
            if (request.input("name")) {
                user.name = request.input("name");
            }
            if (request.input("email")) {
                user.email = request.input("email");
            }
            if (request.input("password")) {
                user.password = request.input("password");
            }
        }
        return response.redirect('/users', false, 303);
    }
    async destroy({ params, response }) {
        await Database_1.default.from("users").where("id", params.id).delete();
        return response.status(204);
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map