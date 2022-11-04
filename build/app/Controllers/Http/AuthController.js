"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthController {
    async login({ auth, request, response }) {
        const email = request.input('email');
        const password = request.input('password');
        try {
            await auth.use('web').attempt(email, password);
            response.redirect('/home');
        }
        catch {
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