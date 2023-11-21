import express from 'express';
import passport from 'passport';
import { crearDireccion, obtenerDirecciones } from '../controllers/addressController.js';

const {Router} = express;

const router = Router();

router
    .get('/:id', 
        passport.authenticate('jwt', {session: false}),
        obtenerDirecciones
    )
    .post('/nueva', 
        passport.authenticate('jwt', {session: false}), 
        crearDireccion
    )

export default router;