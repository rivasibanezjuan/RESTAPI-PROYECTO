import {Request, Response, Router } from 'express'
import { Localidades, Tests } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    // Mostramos un test en concreto a través del identificador id_test

    private getTest = async (req: Request, res: Response) => {
        const { id_test } = req.params
        await db.conectarBD()
        const p = await Tests.find(
                { _id_test: id_test }
            )
             // concatenando con cadena muestra mensaje
        await db.desconectarBD()
        res.json(p)
    }

    // Mostramos una localidad en concreto a través del identificador id_loc

    private getLocalidad2 = async (req: Request, res: Response) => {
        const { id_loc } = req.params
        await db.conectarBD()
        const p = await Localidades.find(
                { _id_loc: id_loc }
            )
        await db.desconectarBD()
        res.json(p)
    }

// Obtenemos las localidades con los respectivos tests de la población local

    private getLocalidades = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Localidades.aggregate([
                {
                    $lookup: {
                        from: 'tests',
                        localField: '_nombre',
                        foreignField: '_localidad',
                        as: "_test_localidad"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    // Obtenemos los tests de una localidad en concreto usando el identificador id_loc

    private getLocalidad = async (req:Request, res: Response) => {
       const { id_loc } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Localidades.aggregate([
                {
                    $lookup: {
                        from: 'tests',
                        localField: '_nombre',
                        foreignField: '_localidad',
                        as: "_test_localidad"
                    }
                },{
                    $match: {
                        _id_loc:id_loc
                    }
                }
            ])
           res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    // Realizamos un post de una localidad

    private postLocalidad = async (req: Request, res: Response) => {
        const { nombre, id_loc, comunidad, provincia, poblacion } = req.body
        await db.conectarBD()
        const dSchema={
            _nombre: nombre,
            _id_loc: id_loc,
            _comunidad: comunidad,
            _provincia: provincia,
            _poblacion: poblacion,
        }
        const oSchema = new Localidades(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    // Realizamos un post de un test

    private postTest = async (req: Request, res: Response) => {
        const { id_test, nombre, dni, telefono, email, fecha_n, sintomas, sanidad, fecha_t, tipo_test, resultado, localidad, calle, ingreso, activo } = req.body
        await db.conectarBD()
        const dSchema={
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
        }
        const oSchema = new Tests(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    
    // Actualizamos una localidad en concreto, para ello nos servimos del identificador id_loc

    private actualizaLocalidad = async (req: Request, res: Response) => {
        const { id_loc } = req.params
        const { nombre, comunidad, provincia, poblacion } = req.body
        await db.conectarBD()
        await Localidades.findOneAndUpdate(
                { _id_loc: id_loc }, 
                {
                    _nombre: nombre,
                    _comunidad: comunidad,
                    _provincia: provincia,
                    _poblacion: poblacion,

                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (docu) => {
                    if (docu==null){
                        console.log('La localidad que desea modificar no existe')
                        res.json({"Error":"No existe: "+id_loc})
                    } else {
                        console.log('Modificada Correctamente: '+ docu) 
                        res.json(docu)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }

    // Actualizamos un test en concreto, para ello nos servimos del identificador id_test

    private actualizaTest = async (req: Request, res: Response) => {
        const { id_test } = req.params
        const { nombre, dni, telefono, email, fecha_n, sintomas, sanidad, fecha_t, tipo_test, resultado, localidad, calle, ingreso, activo } = req.body
        await db.conectarBD()
        await Tests.findOneAndUpdate(
                { _id_test: id_test }, 
                {
                    _nombre: nombre,
                    _dni: dni,
                    _telefono: telefono,
                    _email: email,
                    _fecha_n:fecha_n,
                    _sintomas: sintomas,
                    _sanidad: sanidad,
                    _fecha_t: fecha_t,
                    _tipo_test: tipo_test,
                    _resultado: resultado,
                    _localidad: localidad,
                    _calle: calle,
                    _ingreso: ingreso,
                    _activo: activo,
                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (docu) => {
                    if (docu==null){
                        console.log('La localidad que desea modificar no existe')
                        res.json({"Error":"No existe: "+id_test})
                    } else {
                        console.log('Modificada Correctamente: '+ docu) 
                        res.json(docu)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }

    // Obtenemos la media de poblacion de una comunidad autonoma

    private getPoblacion = async (req:Request, res: Response) => {
        const { comunidad } = req.params
         await db.conectarBD()
         .then( async ()=> {
             const query = await Localidades.aggregate([
                {
                    $match: 
                    { 
                        _comunidad: comunidad
                    }
                },
                {
                    $group: 
                    { 
                        _id: comunidad, 
                        _media_poblacion: 
                            {
                                $avg: "$_poblacion"
                            }
                    }
                }
             ])
            res.json(query)
         })
         .catch((mensaje) => {
             res.send(mensaje)
         })
         await db.desconectarBD()
     }
    
    misRutas(){
        this._router.get('/getTest/:id_loc', this.getTest)
        this._router.get('/getLocalidad/:id_test', this.getLocalidad2)
        this._router.get('/localidades', this.getLocalidades),
        this._router.get('/localidad/:id_loc', this.getLocalidad),
        this._router.post('/postlocalidad', this.postLocalidad)
        this._router.post('/posttest', this.postTest)
        this._router.post('/actualizaLocalidad/:id_loc', this.actualizaLocalidad)
        this._router.post('/actualizaTest/:id_test', this.actualizaTest)
        this._router.get('/poblacion/:comunidad', this.getPoblacion)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router