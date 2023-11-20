import db from "../config/db.connect";

export const obtenerUsuarios = async () => {
    const sql = `
    select 
        *
    from
        usuarios
    `;
    return db.manyOrNone(sql);
};


export const emailExiste = async (email) => {
    return db.task(async t => {
        const user = await t.one('select id, email, nombre, apellidos, telefono, password from usuarios where email = $1', email);
        return user;
    }).then(data => data)
        .catch(e => false);
}

export const telefonoExiste = async telefono => {
    return db.task(async t => {
        const user = await t.one('select id, telefono from usuarios where telefono = $1', telefono);
        return user;
    }).then(data => data)
        .catch(e => false);
}


export const userExisteWithEmpresa = async email => {
    return db.task(async t => {
        const user = await t.one(`
        select
            u.id,
            u.email,
            u.nombre,
            u.apellidos,
            u.imagen,
            u.telefono,
            u.password,
            u.saldo,
            u.session_token,
            u.notification_token,
            json_agg(
                json_build_object(
                    'id', r.id,
                    'nombre', r.nombre,
                    'imagen', r.imagen,
                    'route', r.route
                )
            ) as roles,
            json_build_object(
                'id', e.id,
                'id_user', e.id_user,
                'nombre', e.nombre,
                'imagen', e.imagen,
                'estado', e.estado,
                'telefono', e.telefono,
                'descripcion', e.descripcion,
                'email', e.email,
                'razon_social', e.razon_social
            ) as empresa
        from
            usuarios u
        inner join
            usuario_has_roles uhr
        on
            uhr.id_user = u.id
        inner join
            roles as r
        on
            r.id = uhr.id_rol
        left join
            empresa e
        on
            e.id_user = u.id
        where 
            u.email = $1
        group by 
            u.id, e.id
        `, email);
        return user;
    }).then(data => data)
        .catch(e => false);
}

export const updateToken = (user_id, token) => {
    const sql = `
    update
        usuarios
    set
        session_token = $2
    where
        id = $1
    `;
    return db.none(sql, [
        user_id,
        token,
    ]);
}