import express from "express";
import { 
    crearAddress, 
    getAddresByUserId, 
} from "../models/Address.js";
import { userExisteById } from "../models/User.js";

const { request, response } = express;

export const obtenerDirecciones = async (req = request, res = response) => {
    const {id} = req.params;
    // verificar si el id existe
    try {
        const existe = await userExisteById(id);
        if (!existe) {
            return res.status(401).send({success: false, msg: 'El usuario no existe', error: 'el id ingresado no existe'});
        }
        const direcciones = await getAddresByUserId(id);
        return res.status(201).json({
            success: true, 
            msg: 'La Direccione(s) se obtuvieron satisfactoriamente', 
            data: direcciones
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al obtener las direcciones', 
            error: e
        });
    }

}

export const crearDireccion = async (req = request, res = response) => {
    // console.log(req.body);
    try {
        const data = await crearAddress(req.body);
        if (!data) {
            return res.status(401).send({success: false, msg: 'Error al crear la direccion en la base de datos', error: 'No se pudo crear la direccion'});
        }
        return res.status(201).json({
            success: true, 
            msg: 'La Direccion se creo satisfactoriamente', 
            data: data.id
        })
       
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al crear la dirección', 
            error: e
        });
    }
}