"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Api {
    async handle({ auth, response }, next) {
        const check = await auth.use("api").check();
        if (check) {
            await next();
        }
        else {
            return response.abort("You're not authenticate", 401);
        }
    }
}
exports.default = Api;
//# sourceMappingURL=Api.js.map