import express from "express";
import { updateToken, userExisteWithEmpresa } from "../models/User";
import jwt from 'jsonwebtoken';

const { request, response } = express;

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
            msg: 'Login success',
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
