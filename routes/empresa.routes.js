import express from 'express';
import { 
    aprobarEmpresa,
    buscarEmpresasPorCategoria,
    obtenerEmpresasAprobadas,
    obtenerEmpresasNoAprobadas,
    registrarEmpresa, 
} from '../controllers/empresaController.js';
import multer from 'multer';
import passport from 'passport';

const upload = multer({
    storage: multer.memoryStorage(),
})

const {Router} = express;

const router = Router();

router
    .post('/nueva', 
        passport.authenticate('jwt', {session: false}), 
        upload.array('image', 1), 
        registrarEmpresa
    )
    .get('/getAllNoAproved/:idUser', 
        passport.authenticate('jwt', {session: false}), obtenerEmpresasNoAprobadas
    )
    .get('/getAllAproved/:idUser', 
        passport.authenticate('jwt', {session: false}), obtenerEmpresasAprobadas
    )
    .get('/findEmpresasPorCategoria/:categoria', 
        passport.authenticate('jwt', {session: false}), buscarEmpresasPorCategoria
    )
    .put('/actualizarEstado', 
        passport.authenticate('jwt', {session: false}), 
        aprobarEmpresa
    )
    // .get('/getAllNoAproved', obtenerEmpresasNoAprobadas)

export default router;