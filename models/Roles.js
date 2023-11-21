import db from "../config/db.connect.js";

export const asignarRol = async (user_id, id_rol) => {
    const sql = `
        insert into usuario_has_roles(
            id_user,
            id_rol,
            created_at,
            updated_at
        ) values (
            $1, 
            $2, 
            $3, 
            $4
        )
    `;
    
    return db.none(sql, [
        user_id,
        id_rol,
        new Date(),
        new Date()
    ]);
}

export const crearRolDelivery = async (idUser) => {
    const sql = `
        insert into usuario_has_roles(
            id_user,
            id_rol,
            created_at,
            updated_at
        ) values (
            $1, 
            $2, 
            $3, 
            $4
        )
    `;
    
    return db.none(sql, [
        idUser,
        3,
        new Date(),
        new Date()
    ]).then(dat => true).catch(e => false);
}
