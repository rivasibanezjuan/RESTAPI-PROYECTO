"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tests = exports.Localidades = void 0;
const mongoose_1 = require("mongoose");
// Esquema de nuestra colección 'localidades'
const LocalidadSchema = new mongoose_1.Schema({
    _nombre: String,
    _id_loc: String,
    _comunidad: String,
    _provincia: String,
    _poblacion: Number,
}, {
    collection: 'localidades'
});
// Esquema de nuestra colección 'tests'
const TestSchema = new mongoose_1.Schema({
    _id_test: String,
    _nombre: String,
    _dni: String,
    _telefono: Number,
    _email: String,
    _fecha_n: Date,
    _sintomas: Array,
    _sanidad: String,
    _fecha_t: Date,
    _tipo_test: String,
    _resultado: String,
    _localidad: String,
    _calle: String,
    _ingreso: Boolean,
    _activo: Boolean,
}, {
    collection: 'tests'
});
// Realizamos los exports de ambas colecciones
exports.Localidades = mongoose_1.model('localidades', LocalidadSchema);
exports.Tests = mongoose_1.model('tests', TestSchema);
