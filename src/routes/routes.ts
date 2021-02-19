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

    private postLocalidad = async (req: Request, res: Response) => {
        const { nombre, id_loc, comunidad, provincia , poblacion } = req.body
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
    
    misRutas(){
        this._router.get('/localidades', this.getLocalidades),
        this._router.get('/localidad/:id_loc', this.getLocalidad),
        this._router.post('/', this.postLocalidad)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router