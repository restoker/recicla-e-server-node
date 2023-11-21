import db from "../config/db.connect.js";

export const crearAddress = (address) => {
    const sql = `
        insert into
        direcciones(
                id_user,
                direccion,
                barrio,
                especificacion,
                lat,
                lng,
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
                $8
            ) returning id
    `;

    return db.oneOrNone(sql, [
        address.id_user,
        address.direccion,
        address.barrio,
        address.especificacion,
        address.lat,
        address.lng,
        new Date(),
        new Date()
    ])
}


export const getAddresByUserId = async id => {
    return db.task(async t => {
        const address = await t.manyOrNone('select id, id_user, direccion, barrio, especificacion, lat, lng from direcciones where id_user = $1', id);
        // console.log(address);
        return address;
    }).then(data => data)
        .catch(e => false);
}