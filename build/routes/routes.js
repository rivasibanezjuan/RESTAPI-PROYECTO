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
        // Mostramos la colección 'tests'
        this.getTests = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const {} = req.params;
            yield database_1.db.conectarBD();
            const p = yield schemas_1.Tests.find();
            // concatenando con cadena muestra mensaje
            yield database_1.db.desconectarBD();
            res.json(p);
        });
        // Mostramos la colección 'localidades'
        this.getLocalidades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const {} = req.params;
            yield database_1.db.conectarBD();
            const p = yield schemas_1.Localidades.find();
            // concatenando con cadena muestra mensaje
            yield database_1.db.desconectarBD();
            res.json(p);
        });
        // Mostramos un test en concreto a través del identificador id_test
        this.getTest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_test } = req.params;
            yield database_1.db.conectarBD();
            const p = yield schemas_1.Tests.find({ _id_test: id_test });
            // concatenando con cadena muestra mensaje
            yield database_1.db.desconectarBD();
            res.json(p);
        });
        // Mostramos una localidad en concreto a través del identificador id_loc
        this.getLocalidad2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_loc } = req.params;
            yield database_1.db.conectarBD();
            const p = yield schemas_1.Localidades.find({ _id_loc: id_loc });
            yield database_1.db.desconectarBD();
            res.json(p);
        });
        // Obtenemos las localidades con los respectivos tests de la población local
        this.getTestsLocalidades = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        // Obtenemos los tests de una localidad en concreto usando el identificador id_loc
        this.getTestsLocalidad = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        // Realizamos un post de una localidad
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
        // Realizamos un post de un test
        this.postTest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_test, nombre, dni, telefono, email, fecha_n, sintomas, sanidad, fecha_t, tipo_test, resultado, localidad, calle, ingreso, activo } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _id_test: id_test,
                _nombre: nombre,
                _dni: dni,
                _telefono: telefono,
                _email: email,
                _fecha_n: new Date(fecha_n),
                _sintomas: sintomas,
                _sanidad: sanidad,
                _fecha_t: new Date(fecha_t),
                _tipo_test: tipo_test,
                _resultado: resultado,
                _localidad: localidad,
                _calle: calle,
                _ingreso: ingreso,
                _activo: activo,
            };
            const oSchema = new schemas_1.Tests(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        // Actualizamos una localidad en concreto, para ello nos servimos del identificador id_loc
        this.actualizaLocalidad = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_loc } = req.params;
            const { nombre, comunidad, provincia, poblacion } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Localidades.findOneAndUpdate({ _id_loc: id_loc }, {
                _nombre: nombre,
                _comunidad: comunidad,
                _provincia: provincia,
                _poblacion: poblacion,
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('La localidad que desea modificar no existe');
                    res.json({ "Error": "No existe: " + id_loc });
                }
                else {
                    console.log('Modificada Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        // Actualizamos un test en concreto, para ello nos servimos del identificador id_test
        this.actualizaTest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id_test } = req.params;
            const { nombre, dni, telefono, email, fecha_n, sintomas, sanidad, fecha_t, tipo_test, resultado, localidad, calle, ingreso, activo } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Tests.findOneAndUpdate({ _id_test: id_test }, {
                _nombre: nombre,
                _dni: dni,
                _telefono: telefono,
                _email: email,
                _fecha_n: fecha_n,
                _sintomas: sintomas,
                _sanidad: sanidad,
                _fecha_t: fecha_t,
                _tipo_test: tipo_test,
                _resultado: resultado,
                _localidad: localidad,
                _calle: calle,
                _ingreso: ingreso,
                _activo: activo,
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('La localidad que desea modificar no existe');
                    res.json({ "Error": "No existe: " + id_test });
                }
                else {
                    console.log('Modificada Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        // Obtenemos la media de poblacion de una comunidad autonoma
        this.getPoblacion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { comunidad } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Localidades.aggregate([
                    {
                        $match: {
                            _comunidad: comunidad
                        }
                    },
                    {
                        $group: {
                            _id: comunidad,
                            _media_poblacion: {
                                $avg: "$_poblacion"
                            }
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
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/getTests', this.getTests);
        this._router.get('/getLocalidades', this.getLocalidades);
        this._router.get('/getTest/:id_test', this.getTest);
        this._router.get('/getLocalidad/:id_loc', this.getLocalidad2);
        this._router.get('/testslocalidades', this.getTestsLocalidades),
            this._router.get('/testslocalidad/:id_loc', this.getTestsLocalidad),
            this._router.post('/postlocalidad', this.postLocalidad);
        this._router.post('/posttest', this.postTest);
        this._router.post('/actualizaLocalidad/:id_loc', this.actualizaLocalidad);
        this._router.post('/actualizaTest/:id_test', this.actualizaTest);
        this._router.get('/poblacion/:comunidad', this.getPoblacion);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
