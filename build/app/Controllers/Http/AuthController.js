"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
class AuthController {
    async login({ auth, request, response }) {
        const email = request.input('email');
        const password = request.input('password');
        try {
        }
        catch (error) {
        }
        try {
            const user = await Database_1.default.from("users").where('email', email).first();
            if (user) {
                if (await Hash_1.default.verify(user.password, password)) {
                    await auth.use("web").login(user);
                    response.redirect('/home');
                }
            }
        }
        catch (error) {
            console.log(error);
            return response.badRequest('Invalid credentials');
        }
    }
    async logout({ auth, response }) {
        const check = await auth.use("web").check();
        if (check) {
            await auth.use('web').logout();
            return response.redirect("/login");
        }
        else {
            return response.redirect("/login");
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map