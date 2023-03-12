"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UnblocksController {
    async index({ inertia }) {
        const unblocks = await Database_1.default.from("request_unblocks").where("status", "pending").orderBy("id", "desc");
        return inertia.render("request-unblock-admin", { unblocks });
    }
    async create({ inertia }) {
        return inertia.render("request-unblock");
    }
    async store({ request, inertia }) {
        let data = request.all();
        data.created_at = Date.now();
        data.updated_at = Date.now();
        await Database_1.default.table("request_unblocks").insert(data);
        const msg = {
            tg_id: data.tg_id,
            text: `Terima kasih. kami akan segera mereview akun anda. tunggu kabar dari kami selanjutnya.`
        };
        await Redis_1.default.sadd("queue:riayah", JSON.stringify(msg));
        return inertia.render("request-unblock-success");
    }
    async show({ inertia }) {
        return inertia.render("request-unblock-success");
    }
    async edit({}) { }
    async update({ params, request }) {
        if (request.input("status") == 'approved') {
            const msg = {
                tg_id: request.input("tg_id"),
                text: `Alhamdulillah. akun anda telah dipulihkan kembali.`
            };
            await Database_1.default.from("troops").where("tg_id", request.input("tg_id")).update({
                blocked: false,
                pin_hash: null
            });
            await Redis_1.default.sadd("queue:riayah", JSON.stringify(msg));
        }
        else if (request.input("status") == 'rejected') {
            const msg = {
                tg_id: request.input("tg_id"),
                text: `Maaf. Pengajuan Cabut Blokir ditolak.
        
        Alasan : ${request.input("rejected_reason")}`
            };
            await Redis_1.default.sadd("queue:riayah", JSON.stringify(msg));
        }
        await Database_1.default.from("request_unblocks").where("id", params.id).update({
            status: request.input("status"),
            rejected_reason: request.input("rejected_reason")
        });
    }
    async destroy({}) { }
}
exports.default = UnblocksController;
//# sourceMappingURL=UnblocksController.js.map