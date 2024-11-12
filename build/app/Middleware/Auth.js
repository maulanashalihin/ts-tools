"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/auth/build/standalone");
const Inertia_1 = __importDefault(global[Symbol.for('ioc.use')]("EidelLev/Inertia"));
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    async authenticate(auth, guards) {
        let guardLastAttempted;
        for (let guard of guards) {
            guardLastAttempted = guard;
            if (await auth.use(guard).check()) {
                auth.defaultGuard = guard;
                return true;
            }
        }
        throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guardLastAttempted, this.redirectTo);
    }
    async handle({ auth }, next, customGuards) {
        const guards = customGuards.length ? customGuards : [auth.name];
        await this.authenticate(auth, guards);
        Inertia_1.default.share({
            errors: (ctx) => {
                return ctx.session.flashMessages.get('errors');
            },
            user: () => auth.user
        }).version(() => Inertia_1.default.manifestFile('public/assets/manifest.json'));
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map