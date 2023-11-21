import express from "express";
import { 
    actualizarStatusOrden,
    crearOrder, 
    findOrdersByStatus, 
    findOrdersByStatusAndClientId,
    findOrdersByStatusAndDeliveryId,
    updateLatLngDelivery, 
} from "../models/Orden.js";
import { findDeliveryBoy } from "../models/User.js";

const { request, response } = express;


export const crearOrden = async (req = request, res = response) => {
    const orden = req.body;

    // console.log(req.body);
    // let total = 0;
    // console.log(orden);
    try {
        orden.status = 'PAGADO';
        // calcular el total a pagar
        // console.log(total);
        // orden.total = total;

        const data = await crearOrder(orden);

        if (!data) {
            return res.status(401).send({
                success: false, 
                msg: 'No se pudo crear la orden', 
                error: 'No se pudo crear la orden'
            });
        }
        // console.log(data);
        // for await(const producto of orden.productos) {
        //     await crearOrderWithProducts(data.id, producto.id, producto.quantity);
        // }

        return res.status(201).json({
            success: true, 
            msg: 'La orden se creo satisfactoriamente', 
            data: data.id
        })
       
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al crear la orden', 
            error: e
        });
    }
}

export const obtenerOrdenesCliente = async (req = request, res = response) => {
    const {status} = req.params;
    const {idCliente} = req.params;
    // console.log(status);
    // console.log(idCliente);
    // verificar si el id existe
    try {
        const orden = await findOrdersByStatusAndClientId(idCliente, status.toUpperCase());

        if (!orden) {
            return res.status(403).send({
                success: false, 
                msg: 'No se pudo crear la orden', 
                error: 'No se pudo crear la orden'
            });
        }
        // console.log(orden);
        return res.status(201).json({
            success: true, 
            msg: 'La(s) Orden(es) se obtuvieron satisfactoriamente', 
            data: orden
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al obtener la(s) Orden(es)', 
            error: e
        });
    }
}

export const obtenerOrdenes = async (req = request, res = response) => {
    const {status} = req.params;
    // verificar si el id existe
    // console.log(status);
    try {
        const orden = await findOrdersByStatus(status.toUpperCase());

        if (!orden) {
            return res.status(403).send({
                success: false, 
                msg: 'No se pudo crear la orden', 
                error: 'No se pudo crear la orden'
            });
        }
        // console.log(orden);
        return res.status(201).json({
            success: true, 
            msg: 'La(s) Orden(es) se obtuvieron satisfactoriamente', 
            data: orden
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al obtener la(s) Orden(es)', 
            error: e
        });
    }

}


export const obtenerRepartidores = async (req = request, res = response) => {
    try {
        const data = await findDeliveryBoy();

        // console.log(data);
        
        if (!data) {
            return res.status(401).send({
                success: false, 
                msg: 'No se pudo obtener los repartidores', 
                error: 'No se pudo obtener los repartidores'
            });
        }
        return res.status(201).json({
            success: true, 
            msg: 'Los(El) Repartidor(es) se obtuvieron satisfactoriamente', 
            data: data
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al obtener lo(s) Reparidor(es)', 
            error: e
        });
    }
}

export const actualizarOrdenADespachado = async (req = request, res = response) => {
    const orden = req.body;
    console.log(orden);
    try {
        orden.status = 'DESPACHADO'
        const response =  await actualizarStatusOrden(orden);
        if (!response) {
            return res.status(401).send({
                success: false, 
                msg: 'No se pudo actualizar la orden', 
                error: 'No se pudo actualizar la orden'
            });
        }
        return res.status(201).json({
            success: true, 
            msg: 'La orden se actualizo correctamente', 
            data: 'no data'
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al actualizar la orden', 
            error: e
        });
    }
}

export const actualizarOrdenAEnCamino = async (req = request, res = response) => {
    const orden = req.body;
    // console.log(orden);
    try {
        orden.status = 'EN CAMINO'
        // console.log(orden);
        const response =  await actualizarStatusOrden(orden);
        if (!response) {
            return res.status(401).send({
                success: false, 
                msg: 'No se pudo actualizar la orden', 
                error: 'No se pudo actualizar la orden'
            });
        }
        return res.status(201).json({
            success: true, 
            msg: 'La orden se actualizo correctamente', 
            data: 'no data'
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al actualizar la orden', 
            error: e
        });
    }
}


export const obtenerOrdenesDelivery = async (req = request, res = response) => {
    const {status} = req.params;
    const {idRecolector} = req.params;
    // console.log(status);
    // console.log(idDelivery);
    // verificar si el id existe
    try {
        // const existe = await userExiste(user_id);
        // if (!existe) {
        //     return res.status(401).send({success: false, msg: 'El usuario no existe', error: 'el id ingresado no existe'});
        // }
        const orden = await findOrdersByStatusAndDeliveryId(idRecolector, status.toUpperCase());
        // console.log(orden);
        return res.status(201).json({
            success: true, 
            msg: 'La(s) Orden(es) se obtuvieron satisfactoriamente', 
            data: orden
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al obtener la(s) Orden(es)', 
            error: e
        });
    }
}

export const actualizarLatLongDelivery = async (req = request, res = response) => {
    const orden = req.body;
    // console.log(orden);
    try {
        // console.log(orden);
        const response =  await updateLatLngDelivery(orden);
        // const response =  await updateLatLngDelivery(orden);
        if (!response) {
            return res.status(401).send({
                success: false, 
                msg: 'No se pudo actualizar la orden', 
                error: 'No se pudo actualizar la orden'
            });
        }
        return res.status(201).json({
            success: true, 
            msg: 'La orden se actualizo correctamente', 
            data: 'no data'
        })
    } catch (e) {
        console.log(e);
        res.status(501).send({
            success: false, 
            msg: 'Error al actualizar la orden', 
            error: e
        });
    }
}