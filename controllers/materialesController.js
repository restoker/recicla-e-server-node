import express from "express";
import { categoriaExistePorId } from "../models/Categoria.js";
import { ExisteEmpresaById } from "../models/Empresa.js";
import { crearMaterial, getproductosEmpresa } from "../models/Materiales.js";
import storageFile from '../utils/cloud_storage.js';

const { request, response } = express;

export const crearMaterialesAlt = async (req = request, res = response) => {
    const producto = JSON.parse(req.body.producto);
    const files = req.files;
    // console.log(producto);
    // console.log(files);
    try {
        // verificar si el nombre del producto existe
        const existe = await categoriaExistePorId(producto.id_categoria);
        // console.log(existe);
        if (!existe) {
            return res.status(403).send({
                success: false, 
                msg: 'La categoria no existe', 
                error: 'La categoria no existe',
                data: 'No data'
            });
        }
        if (files.length > 0 && files.length <= 3) {
            
            let imagenes = [];

            for await(const file of files) {
                const pathImage = `image_${Date.now()}`;
                const url = await storageFile(file, pathImage);
                if (!url) {
                    return res.status(403).send({
                        success: false, 
                        msg: 'No se pudo generar la imagen', 
                        error: 'error en el servidor',
                        data: 'No data'
                    });
                }
                imagenes = [...imagenes, url];
            }
            
            producto.imagen1 = imagenes[0];
            producto.imagen2 = imagenes[1];
            producto.imagen3 = imagenes[2];

            // console.log(producto);
    
            const data = await crearMaterial(producto); //crear el producto
            // console.log(data);
            if (!data) {
                return res.status(403).send({
                    success: false, 
                    msg: 'no se pudo crear el producto', 
                    error: 'error al crear el producto',
                    data: 'No data'
                });
            }
    
            // console.log(producto);
            return res.status(201).json({
                success: true, 
                msg: 'El producto se creo correctamente',
                data: data
            });
    
        } else {
            return res.status(501).json({
                success: false, 
                msg: 'Error al registrar el producto, no envio ninguna imagen', 
                error: 'No se pudo crear el producto',
                data: 'No data'
            });
        }
    } catch (e) {
        return res.status(501).json({
            success: false, 
            msg: 'Error al registrar el producto', 
            error: 'No se pudo crear el producto',
            data: 'No data'
        });
    }
}

export const obtenerProductosEmpresa = async (req = request, res = response) => {
    const {id} = req.params;
    try {

        // verificar si el id de la empresa ingresada existe
        const existe = await ExisteEmpresaById(id);

        if (!existe) {
            return res.status(403).send({
                success: false, 
                msg: 'El id de la empresa es incorrecto', 
                error: 'error el id de la empresa es incorrecto',
                data: 'No data'
            });
        }

        const data = await getproductosEmpresa(id);
        // console.log(data);
        if (!data) {
            return res.status(403).send({
                success: false, 
                msg: 'no se pudo obtener los materiales', 
                error: 'error al obtener los materiales',
                data: 'No data'
            });
        }

        if (data.length === 0) {
            return res.status(403).send({
                success: false, 
                msg: 'no tienen ningun producto registrado', 
                error: 'error no tiene productos registrados',
                data: 'No data'
            });
        }
        
        return res.status(201).json({
            success: true, 
            msg: 'Los productos se obtubieron de forma satisfactoria',
            data: data
        });

    } catch (e) {
        return res.status(501).json({
            success: false, 
            msg: 'Error al obtener los(el) producto(s)', 
            error: 'No se pudo obtener los(el) producto(s)',
            data: 'No data'
        });
    }
}