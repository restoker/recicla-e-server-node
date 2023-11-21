import express from 'express';
import multer from 'multer';
import passport from 'passport';
import { 
    crearMaterialesAlt, 
    obtenerProductosEmpresa, 
} from '../controllers/materialesController.js';

const upload = multer({
    storage: multer.memoryStorage(),
});

const {Router} = express;

const router = Router();

router
    .post('/nuevo', 
        passport.authenticate('jwt', {session: false}), 
        upload.array('image', 3), 
        crearMaterialesAlt
    )
    .get(
        '/getProductos/:id',
        passport.authenticate('jwt', {session: false}), 
        obtenerProductosEmpresa
    )


export default router;
