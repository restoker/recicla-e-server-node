import express from 'express';
import passport from 'passport';
import { 
    actualizarLatLongDelivery,
    actualizarOrdenADespachado,
    actualizarOrdenAEnCamino,
    crearOrden, 
    obtenerOrdenes, 
    obtenerOrdenesCliente,
    obtenerOrdenesDelivery,
    obtenerRepartidores, 
} from '../controllers/ordenController.js';

const {Router} = express;

const router = Router();

router
    .post(
        '/nueva', 
        passport.authenticate('jwt', {session: false}), 
        crearOrden
    )
    .get(
        '/findClienteOrdernes/:idCliente/:status', 
        passport.authenticate('jwt', {session: false}), 
        obtenerOrdenesCliente
    )
    .get(
        '/findOrdenes/:status', 
        passport.authenticate('jwt', {session: false}), 
        obtenerOrdenes
    )
    .get(
        '/findRepartidores', 
        passport.authenticate('jwt', {session: false}), 
        obtenerRepartidores
    )
    .put('/actualizarADespachado', 
        passport.authenticate('jwt', {session: false}), 
        actualizarOrdenADespachado
    )
    .put('/actualizarAEnCamino', 
        passport.authenticate('jwt', {session: false}), 
        actualizarOrdenAEnCamino
    )
    .put('/updateLatLngDelivery', 
        passport.authenticate('jwt', {session: false}), actualizarLatLongDelivery
    )
    .get('/findDeliveryOrdernes/:idRecolector/:status', 
        passport.authenticate('jwt', {session: false}), 
        obtenerOrdenesDelivery
    )

export default router;