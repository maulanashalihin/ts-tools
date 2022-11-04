"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inertia_1 = __importDefault(global[Symbol.for('ioc.use')]("EidelLev/Inertia"));
class Buzzer {
    async handle({ auth, response }, next) {
        const check = await auth.use("buzzer").check();
        if (check) {
            Inertia_1.default.share({
                errors: (ctx) => {
                    return ctx.session.flashMessages.get('errors');
                },
                user: () => auth.use("buzzer").user
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