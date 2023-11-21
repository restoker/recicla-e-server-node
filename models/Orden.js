import db from "../config/db.connect.js";

export const crearOrder = (orden) => {
    const sql = `
        insert into
            ordenes(
                id_user,
                id_direccion,
                id_empresa,
                status,
                lat,
                lng,
                timestamp,
                created_at,
                updated_at
            ) values(
                $1, 
                $2, 
                $3, 
                $4, 
                $5, 
                $6,
                $7,
                $8,
                $9
            ) returning id
    `;

    return db.oneOrNone(sql, [
        orden.id_user,
        orden.id_direccion,
        orden.id_empresa,
        orden.status,
        orden.lat,
        orden.lng,
        Date.now(),
        new Date(),
        new Date()
    ]);
}

export const findOrdersByStatusAndClientId = (idCliente, status) => {
    const sql = `
        SELECT
            o.id,
            o.id_user,
            o.id_direccion,
            o.id_recolector,
            o.id_empresa,
            o.status,
            o.timestamp,
            o.lat,
            o.lng,
            o.total,
        JSON_BUILD_OBJECT(
                'id', u.id,
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'imagen', u.imagen,
                'email', u.email,
                'telefono', u.telefono,
                'notification_token', u.notification_token,
                'saldo', u.saldo
            ) as cliente,
        JSON_BUILD_OBJECT(
                'id', d.id,
                'id_user', d.id_user,
                'direccion', d.direccion,
                'barrio', d.barrio,
                'especificacion', d.especificacion,
                'lat', d.lat,
                'lng', d.lng
            ) as direccion,
        JSON_BUILD_OBJECT(
                'id', u2.id,
                'nombre', u2.nombre,
                'email', u2.email,
                'apellidos', u2.apellidos,
                'telefono', u2.telefono,
                'imagen', u2.imagen
            ) as recolector
        FROM
            ordenes o
        INNER JOIN
            usuarios as u
        ON
            o.id_user = u.id
        LEFT join
            usuarios u2
        ON
            o.id_user = u2.id
        INNER JOIN
            direcciones d
        ON
            d.id = o.id_direccion
        WHERE
            o.status = $1 and o.id_user = $2
        GROUP BY
            o.id, u.id, d.id, u2.id
    `;

    return db.manyOrNone(sql, [status, idCliente]);
}

export const findOrdersByStatus = (status) => {
    const sql = `
        SELECT
            o.id,
            o.id_user,
            o.id_direccion,
            o.id_recolector,
            o.id_empresa,
            o.status,
            o.timestamp,
            o.lat,
            o.lng,
            o.total,
            JSON_BUILD_OBJECT(
                'id', u.id,
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'imagen', u.imagen,
                'email', u.email,
                'telefono', u.telefono,
                'notification_token', u.notification_token,
                'saldo', u.saldo
            ) as cliente,
        JSON_BUILD_OBJECT(
                'id', d.id,
                'id_user', d.id_user,
                'direccion', d.direccion,
                'barrio', d.barrio,
                'especificacion', d.especificacion,
                'lat', d.lat,
                'lng', d.lng
            ) as direccion,
        JSON_BUILD_OBJECT(
                'id', u2.id,
                'nombre', u2.nombre,
                'email', u2.email,
                'apellidos', u2.apellidos,
                'telefono', u2.telefono,
                'imagen', u2.imagen
            ) as recolector
        FROM
            ordenes as o
        INNER JOIN
            usuarios u
        ON
            o.id_user = u.id
        LEFT join
            usuarios u2
        ON
            o.id_user = u2.id
        INNER JOIN
            direcciones d
        ON
            d.id = o.id_direccion
        WHERE
            o.status = $1
        GROUP BY
            o.id, u.id, d.id, u2.id
    `;

    return db.manyOrNone(sql, status);
}

export const actualizarStatusOrden = async (orden) => {
    const sql = `
        update
            ordenes
        set
            id_recolector = $2,
            status = $3,
            updated_at = $4
        where
            id = $1
    `;

    return db.none(sql, [
        orden.id,
        orden.id_recolector,
        orden.status,
        new Date
    ]).then(dat => true)
        .catch(e => false)
}

export const findOrdersByStatusAndDeliveryId = (idRecolector, status) => {
    const sql = `
        SELECT
            o.id,
            o.id_user,
            o.id_direccion,
            o.id_recolector,
            o.id_empresa,
            o.status,
            o.timestamp,
            o.lat,
            o.lng,
            o.total,
            JSON_BUILD_OBJECT(
                'id', u.id,
                'nombre', u.nombre,
                'apellidos', u.apellidos,
                'imagen', u.imagen,
                'email', u.email,
                'telefono', u.telefono,
                'notification_token', u.notification_token,
                'saldo', u.saldo
            ) as cliente,
        JSON_BUILD_OBJECT(
                'id', d.id,
                'id_user', d.id_user,
                'direccion', d.direccion,
                'barrio', d.barrio,
                'especificacion', d.especificacion,
                'lat', d.lat,
                'lng', d.lng
            ) as direccion,
        JSON_BUILD_OBJECT(
                'id', u2.id,
                'nombre', u2.nombre,
                'email', u2.email,
                'apellidos', u2.apellidos,
                'telefono', u2.telefono,
                'imagen', u2.imagen
            ) as recolector
        FROM
            ordenes o
        INNER JOIN
            usuarios u
        ON
            o.id_user = u.id
        LEFT join
            usuarios u2
        ON
            o.id_user = u2.id
        INNER JOIN
            direcciones d
        ON
            d.id = o.id_direccion
        WHERE
            o.status = $1 and o.id_recolector = $2
        GROUP BY
            o.id, u.id, d.id, u2.id
    `;

    return db.manyOrNone(sql, [status, idRecolector]);
}

export const updateLatLngDelivery = async (orden) => {
    const sql = `
        update
            ordenes
        set
            lat = $2,
            lng = $3
        where
            id = $1
    `;

    return db.none(sql, [
        orden.id,
        orden.lat,
        orden.lng,
        new Date
    ]).then(dat => true)
        .catch(e => false)
}