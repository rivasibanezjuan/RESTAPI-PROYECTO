"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getLocalidades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Localidades.aggregate([
                    {
                        $lookup: {
                            from: 'tests',
                            localField: '_nombre',
                            foreignField: '_localidad',
                            as: "_test_localidad"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getLocalidad = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_loc } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Localidades.aggregate([
                    {
                        $lookup: {
                            from: 'tests',
                            localField: '_nombre',
                            foreignField: '_localidad',
                            as: "_test_localidad"
                        }
                    }, {
                        $match: {
                            _id_loc: id_loc
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postLocalidad = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, id_loc, comunidad, provincia, poblacion } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _nombre: nombre,
                _id_loc: id_loc,
                _comunidad: comunidad,
                _provincia: provincia,
                _poblacion: poblacion,
            };
            const oSchema = new schemas_1.Localidades(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/localidades', this.getLocalidades),
            this._router.get('/localidad/:id_loc', this.getLocalidad),
            this._router.post('/', this.postLocalidad);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
