"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inertia_1 = __importDefault(global[Symbol.for('ioc.use')]("EidelLev/Inertia"));
const dayjs_1 = __importDefault(require("dayjs"));
class Buzzer {
    async handle({ auth, response, request }, next) {
        const check = await auth.use("buzzer").check();
        if (check) {
            const user = await auth.use("buzzer").user;
            delete user?.pin_hash;
            if (request.url() != '/pin') {
                if (user?.pin_set == false) {
                    return response.redirect("/pin");
                }
                if ((0, dayjs_1.default)(user.last_active).add(1, 'day').isBefore(Date.now())) {
                    return response.redirect("/pin");
                }
            }
            Inertia_1.default.share({
                errors: (ctx) => {
                    return ctx.session.flashMessages.get('errors');
                },
                user: () => user
            }).version(() => Inertia_1.default.manifestFile('public/assets/manifest.json'));
            await next();
        }
        else {
            return response.redirect("/ts-login");
        }
    }
}
exports.default = Buzzer;
//# sourceMappingURL=Buzzer.js.map