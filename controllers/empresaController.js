import express from "express";
import { 
    crearEmpresa, 
    emailEmpresaExiste, 
    empresaExiste,
    ExisteEmpresaById,
    getAllBussinessAproved,
    getAllBussinessNoAproved,
    getEmpresasByCategoria,
    nombreEmpresaExiste,
    updateStateBusiness,
 } from "../models/Empresa.js";
import { asignarCategoria } from "../models/EmpresaHasCategorias.js.js";
import { asignarRol } from "../models/Roles.js";
import { emailExiste, isAdmin } from "../models/User.js";
import storageFile from '../utils/cloud_storage.js';

const { request, response } = express;

export const registrarEmpresa = async (req = request, res = response) => {

    // const {id_user, nombre, email} = req.body;
    const empresa = JSON.parse(req.body.empresa);
    console.log(empresa);
    const {id_user, nombre, email} = empresa;
    const files = req.files;
    // console.log(files);
    try {
        // verificar si el usuario ya tiene una empresa registrada
        const empresaRegistrada = await empresaExiste(id_user);
        // console.log(empresaRegistrada);
        if (empresaRegistrada) {
            return res.status(401).send({
                success: false,
                msg: 'Ya tiene una empresa registrada',
                error: 'No se registro la empresa,',
                data: 'No data'
            });
        }

        const nombreEmpresaRegistrada = await nombreEmpresaExiste(nombre);
        // console.log(empresaRegistrada);
        if (nombreEmpresaRegistrada) {
            return res.status(401).send({
                success: false,
                msg: 'Ya tiene una empresa registrada con ese Nombre',
                error: 'No se registro la empresa,',
                data: 'No data'
            });
        }

        const emailEmpresaRegistrada = await emailEmpresaExiste(email);
        // console.log(empresaRegistrada);
        if (emailEmpresaRegistrada) {
            return res.status(401).send({
                success: false,
                msg: 'Ya tiene una empresa registrada con ese email',
                error: 'No se registro la empresa,',
                data: 'No data'
            });
        }

        if (files.length > 0) {
            const pathName = `image_${Date.now()}`;
            const url = await storageFile(files[0], pathName);
            if (!url) {
                return res.status(401).send({success: false, msg: 'No se pudo generar la imagen', error: 'error en el servidor'});
            }
            if (url !== undefined && url !== null) {
                empresa.imagen = url;
            }
        }

        // crear empresa
        const nuevaEmpresa = await crearEmpresa(empresa);
        // console.log(nuevaEmpresa);
        if (!nuevaEmpresa) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo crear la empresa',
                error: 'Ocurrio un error con al base de datos', 
                data: 'No data'
            });
        }

        // asignar categorias a al empresa
        for await(const categoria of empresa.categorias) {
            if (categoria.toLowerCase() === 'plasticos') {
                await asignarCategoria(nuevaEmpresa.id, 1);
            } else if (categoria.toLowerCase() === 'metales') {
                await asignarCategoria(nuevaEmpresa.id, 2);
            } else if (categoria.toLowerCase() === 'vidrios') {
                await asignarCategoria(nuevaEmpresa.id, 3);
            } else if (categoria.toLowerCase() === 'organicos') {
                await asignarCategoria(nuevaEmpresa.id, 4);
            } else if (categoria.toLowerCase() === 'papel') {
                await asignarCategoria(nuevaEmpresa.id, 5);
            }
        }

        return res.status(201).send({
            success: true,
            msg: 'Datos correctos', 
            data: nuevaEmpresa
        });

    } catch (e) {
        console.log(e);
        return res.status(503).send({
            success: false,
            msg: 'Error en el servidor', 
            data: 'No data'
        });
    }
}


export const obtenerEmpresasNoAprobadas = async (req = request, res = response) => {
    const {idUser} = req.params;
    // console.log(idUser);
    try {
        // verificar que el usuario sea administrado
        const admin = await isAdmin(idUser);
        // console.log(admin);
        if (!admin || admin?.length === 0) {
            return res.status(401).send({
                success: false,
                msg: 'No tienen permiso para realizar esta operacion',
                error: 'No tiene permiso', 
                data: 'No data'
            });
        }

        const data = await getAllBussinessNoAproved();
        if (!data) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo obtener las empresas',
                error: 'Ocurrio un error con al base de datos', 
                data: 'No data'
            });
        }
        return res.status(201).send({
            success: true,
            msg: 'Datos correctos', 
            data: data
        });
    } catch (e) {
        console.log(e);
        return res.status(503).send({
            success: false,
            msg: 'Error en el servidor', 
            data: 'No data'
        });
    }
}

export const obtenerEmpresasAprobadas = async (req = request, res = response) => {
    const {idUser} = req.params;
    // console.log(idUser);
    try {
        // verificar que el usuario sea administrado
        const admin = await isAdmin(idUser);
        // console.log(admin);
        if (!admin || admin?.length === 0) {
            return res.status(401).send({
                success: false,
                msg: 'No tienen permiso para realizar esta operacion',
                error: 'No tiene permiso', 
                data: 'No data'
            });
        }

        const data = await getAllBussinessAproved();
        
        if (!data) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo obtener las empresas',
                error: 'Ocurrio un error con al base de datos', 
                data: 'No data'
            });
        }

        return res.status(201).send({
            success: true,
            msg: 'Datos correctos', 
            data: data
        });

    } catch (e) {
        console.log(e);
        return res.status(503).send({
            success: false,
            msg: 'Error en el servidor', 
            data: 'No data'
        });
    }
}

export const aprobarEmpresa = async (req = request, res = response) => {
    const {id_user, id_empresa} = req.body;
    try {

        // verificar que el usuario sea administrado
        const admin = await isAdmin(id_user);
        // console.log(admin);
        if (!admin || admin?.length === 0) {
            return res.status(401).send({
                success: false,
                msg: 'No tienen permiso para realizar esta operacion',
                error: 'No tiene permiso', 
                data: 'No data'
            });
        }

        const dataEmpresa = await ExisteEmpresaById(id_empresa);

        if (!dataEmpresa) {
            return res.status(401).send({
                success: false,
                msg: 'La empresa no existe',
                error: 'Ocurrio un error con al base de datos', 
                data: 'No data'
            });
        }

        const data = await updateStateBusiness(id_empresa);

        if (!data) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo actualizar el estado de la empresa',
                error: 'Ocurrio un error con al base de datos', 
                data: 'No data'
            });
        }
        
        // asignar rol de recicladora

        await asignarRol(dataEmpresa.id_user, 2);

        return res.status(201).send({
            success: true,
            msg: 'Datos correctos', 
            data: data
        });
        
    } catch (e) {
        console.log(e);
        return res.status(503).send({
            success: false,
            msg: 'Error en el servidor', 
            data: 'No data'
        });
    }
}

export const buscarEmpresasPorCategoria = async (req = request, res = response) => {
    const {categoria} = req.params;
    // console.log(categoria);
    try {
        const data = await getEmpresasByCategoria(categoria);

        if (!data) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudieron obtener las empresas',
                error: 'No se pudo consultar la bd', 
                data: 'No data'
            });
        }

        // console.log(empresas);

        return res.status(200).send({
            success: true,
            msg: 'Datos correctos', 
            data: data
        });
    } catch (e) {
        console.log(e);
        return res.status(503).send({
            success: false,
            msg: 'Error en el servidor', 
            data: 'No data'
        });
    }
}