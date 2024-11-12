"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class StratPlansController {
    async index({ inertia }) {
        const strats = await Database_1.default.from("strat_plans").orderBy("id", "desc").limit(20);
        return inertia.render("strat-plans", { strats });
    }
    async create({ inertia }) {
        return inertia.render("strat-plans-create");
    }
    async store({ request, response }) {
        let data = request.all();
        await Database_1.default.table("strat_plans").insert(data);
        return response.redirect("/strat-plan");
    }
    async show({}) { }
    async edit({ params, inertia }) {
        const Project = await Database_1.default.from("strat_plans").where("id", params.id).first();
        return inertia.render("strat-plans-create", { Project });
    }
    async update({}) { }
    async destroy({ params, response }) {
        await Database_1.default.from("strat_plans").where("id", params.id).delete();
        return response.redirect("/strat-plan", false, 303);
    }
}
exports.default = StratPlansController;
//# sourceMappingURL=StratPlansController.js.map