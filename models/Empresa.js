import db from "../config/db.connect.js";

// verificar si el usuario ya tiene una empresa registrada
export const empresaExiste = async (idUser) => {
    return db.task(async t => {
        const empresa = await t.one('select id, nombre, telefono, email from empresa where id_user = $1', idUser);
        return empresa;
    }).then(data => data)
        .catch(e => false);
}

// verificar si el usuario ya tiene una empresa registrada
export const ExisteEmpresaById = async (idEmpresa) => {
    return db.task(async t => {
        const empresa = await t.one('select id, id_user, nombre, telefono, email from empresa where id = $1', idEmpresa);
        return empresa;
    }).then(data => data)
        .catch(e => false);
}

// verificar si el nombre de la empresa esta registrada
export const nombreEmpresaExiste = async (nombre) => {
    return db.task(async t => {
        const empresa = await t.one('select id, nombre, telefono, email from empresa where nombre = $1', nombre);
        return empresa;
    }).then(data => data)
        .catch(e => false);
}

// verificar si el email de la empresa esta registrada
export const emailEmpresaExiste = async (email) => {
    return db.task(async t => {
        const empresa = await t.one('select id, nombre, telefono, email from empresa where email = $1', email);
        return empresa;
    }).then(data => data)
        .catch(e => false);
}


export const crearEmpresa = async (empresa) => {
    const sql = `
    insert into empresa(
        id_user,
	    estado,
	    nombre,
	    razon_social,
	    telefono,
	    direccion,
	    email,
	    descripcion,
        imagen,
	    created_at,
	    updated_at
    )values(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
    ) returning id
    `;
    return db.oneOrNone(sql, [
        empresa.id_user,
        'PREAPROBADO',
        empresa.nombre,
        empresa.razon_social,
        empresa.telefono,
        empresa.direccion,
        empresa.email,
        empresa.descripcion,
        empresa.imagen,
        new Date(),
        new Date()
    ])
}

export const getAllBussinessNoAproved = async () => {
    const sql = `
        SELECT
            id,
            id_user,
            nombre,
            razon_social,
            telefono,
            direccion,
            email,
            estado,
            imagen,
            descripcion
        FROM
            empresa
        WHERE
            estado = $1
    `;
    return db.manyOrNone(sql, ['PREAPROBADO']);

}

export const getAllBussinessAproved = async () => {
    const sql = `
        SELECT
            id,
            id_user,
            nombre,
            razon_social,
            telefono,
            direccion,
            email,
            estado,
            imagen,
            descripcion
        FROM
            empresa
        WHERE
            estado = $1
    `;
    return db.manyOrNone(sql, ['APROBADO']);

}


export const updateStateBusiness = async (idEmpresa) => {
    const sql = `
    update
        empresa
    set
        estado = 'APROBADO'
    where
        id = $1
    `;

    return db.none(sql, [
        idEmpresa,
        new Date
    ]).then(dat => true)
        .catch(e => false)
}


export const getCategoriasEmpresa = async (idEmpresa) => {
    const sql = `
    select
        e.direccion,
        e.descripcion,
        e.email,
        e.estado,
        json_agg(
        c.nombre
    ) as categoria
    from 
        empresa e
    inner join
        empresa_has_categoria ehc
    on
        e.id = ehc.id_empresa
    inner join
        categoria c
    on
        c.id = ehc.id_categoria
    where 
        e.id = $1
    GROUP BY
        e.id
    `;
    return db.manyOrNone(sql, [idEmpresa]);
}


export const getEmpresasByCategoria = async (categoria) => {
    const sql = `
    SELECT
        e.id,
        e.email,
        e.imagen,
        e.nombre,
        e.razon_social,
        e.telefono,
        e.direccion,
        e.descripcion
    FROM
        empresa e
    INNER JOIN
        empresa_has_categoria ehc
    ON
        ehc.id_empresa = e.id
    INNER join
        categoria c
    on
        c.id = ehc.id_categoria
    WHERE
        c.nombre = $1 and e.estado = 'APROBADO'
    `;
    return db.manyOrNone(sql, [categoria])
}