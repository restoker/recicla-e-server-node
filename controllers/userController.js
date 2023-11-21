import express from "express";
import {
    emailExiste,
    telefonoExiste,
    updateToken,
    userExisteWithEmpresa
} from "../models/User.js";
import jwt from 'jsonwebtoken';
import { getCategoriasEmpresa } from "../models/Empresa.js";
import bcrypt from 'bcryptjs';
import storageFile from '../utils/cloud_storage.js';

const { request, response } = express;

export const registrarUsuario = async (req = request, res = response) => {
    // console.log(req.body);
    const usuario = JSON.parse(req.body.user);
    const { email, password, telefono } = usuario;
    const files = req.files;
    // console.log(files);
    // console.log(req.body.user);
    try {
        // verificar si el correo ya esta registrado
        const haveEmail = await emailExiste(email);

        if (haveEmail) {
            return res.status(401).send({
                success: false,
                error: 'Email ya existe',
                msg: 'El correo ya esta registrado, pruebe con otro',
                data: 'No data'
            });
        }

        // verificar si el teléfono ya esta registrado
        const havePhone = await telefonoExiste(telefono);

        if (havePhone) {
            return res.status(401).send({
                success: false,
                error: 'El teléfono ya existe',
                msg: 'El teléfono ya esta registrado, pruebe con otro',
                data: 'No data'
            });
        }

        if (files.length > 0) {
            const pathName = `image_${Date.now()}`;
            // const pathName = `avatar/image_${Date.now()}`;
            const url = await storageFile(files[0], pathName);
            if (!url) {
                return res.status(401).send({
                    success: false,
                    msg: 'No se pudo generar la imagen',
                    error: 'error en el servidor',
                    data: 'No data'
                });
            }
            if (url !== undefined && url !== null) {
                usuario.imagen = url;
            }
        }

        // generar el salt para la encryptacion
        const salt = await bcrypt.genSalt(10);

        const encrypPassword = await bcrypt.hash(password, salt);

        usuario.password = encrypPassword;

        // const usuario = await crearUsuarioAndAsignarRol(req.body);
        const nuevoUsuario = await crearUsuarioBD(usuario);
        // console.log(usuario);
        if (!nuevoUsuario) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo crear el usuarios',
                error: 'Ocurrio un error con al base de datos',
                data: 'No data'
            });
        }

        // creando el token de sesion
        const token = jwt.sign(
            { id: nuevoUsuario.id, email },
            process.env.SECRETA,
            { expiresIn: '7d' }
        );

        // asignar rol al usuario creado
        await asignarRol(nuevoUsuario.id, 1);

        // actualizar el session token
        await updateToken(nuevoUsuario.id, token);

        // await updateNotificationToken(nuevoUsuario.id, notification_token);

        const data = {
            id: nuevoUsuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            imagen: usuario.imagen,
            saldo: 0,
            // password: req.body.password,
            roles: [{ id: 1, nombre: "CLIENTE", imagen: 'https://img.freepik.com/vector-gratis/joven-hombre-negocios-fue-admirado-cualquier-persona-concepto-exitoso-negocio-personaje-dibujos-animados-ilustracion-vectorial_1150-56247.jpg', route: 'cliente/home' }],
            session_token: `JWT ${token}`,
            empresa: null,
        }

        return res.status(201).send({
            success: true,
            msg: 'Su registro fue correcto, Bienvenido 😸',
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

export const loginUser = async (req = request, res = response) => {
    const { email, password } = req.body;
    // console.log(email);
    // console.log(password);
    try {
        // verificar si el email existe
        const user = await userExisteWithEmpresa(email);
        const { estado } = user;
        // const {id} = user.empresa;
        // log de userMail => { email: 'juan@gmail.com'}
        // console.log(user);
        // console.log(id);
        if (!user) {
            return res.status(401).send({
                success: false,
                msg: 'El correo no existe',
                error: 'El correo ingresado no esta registrado en la base de datos',
                data: 'No data'
            });
        }
        // validar el password ingresado
        const passwordValido = await bcrypt.compare(password, user.password);
        // console.log(passwordValido);
        if (!passwordValido) {
            return res.status(401).send({
                success: false,
                msg: 'Password o correo no validos',
                error: 'Password o correo incorrecto',
                data: 'No data'
            });
        }
        // creando el token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRETA,
            { expiresIn: '7d' }
        );

        if (estado === 'APROBADO') {
            const categoriasEmpresa = await getCategoriasEmpresa(user.empresa.id);
            // console.log(categoriasEmpresa);
            user.categoria = categoriasEmpresa.categoria;
        } else {
            user.categoria = [];
        }

        const data = {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidos: user.apellidos,
            telefono: user.telefono,
            imagen: user.imagen,
            // password: user.password,
            roles: user.roles,
            saldo: Number(user.saldo),
            session_token: `JWT ${token}`,
            empresa: user.empresa,
            categoria: user.categoria
        }

        // console.log(data);
        // actualizar token
        await updateToken(user.id, `JWT ${token}`);

        // console.log(data);
        return res.status(201).send({
            success: true,
            msg: 'Registro correcto',
            data
        })


    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            msg: 'Error de login en el servidor',
            error: e
        });
    }
}

export const obtenerUsuariosNoDelivery = async (req = request, res = response) => {
    try {
        // const {id} = req.params;
        const data = await getUserQueNoSonDelivery();

        if (!data) {
            return res.status(401).send({
                success: false,
                msg: 'No se pudo obtener los usuarios',
                error: 'no hay usuarios'
            });
        }

        // console.log(data);

        return res.status(201).json({
            success: true,
            msg: 'El usuario se obtubo correctamente',
            data: data
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            msg: 'Error de actualización en el servidor',
            error: e
        });
    }
}


export const asignarRolDelivery = async (req = request, res = response) => {

}

export const obtenerUsuarioPorId = async (req = request, res = response) => {

}