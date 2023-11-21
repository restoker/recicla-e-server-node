import db from "../config/db.connect.js";

export const crearMaterial = async (producto) => {
    console.log(producto);
    const sql = `
    insert into materiales_reciclaje(
            nombre,
            descripcion,
            precio,
            imagen1,
            imagen2,
            imagen3,
            id_categoria,
            id_empresa,
            created_at,
            updated_at
        ) values (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        ) returning id
    `;
    return db.oneOrNone(sql, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.imagen1,
        producto.imagen2,
        producto.imagen3,
        producto.id_categoria,
        producto.id_empresa,
        new Date(),
        new Date()
    ]);
} 

export const updateMaterial = async (campo, producto) => {
    const sql = `
        update
            materiales_reciclaje
        set
            nombre = $2,
            descripcion = $3,
            price = $4,
            image1 = $5,
            image2 = $6,
            image3 = $7,
            id_category = $8,
            updated_at =$9
        where
            id = $1
    `;

    return db.none(sql, [
        producto.id,
        producto.name,
        producto.description,
        producto.precio,
        producto.image1,
        producto.imageFile2,
        producto.imageFile3,
        producto.idCategory,
        new Date()
    ]);
}



export const getproductosEmpresa = async (idEmpresa) => {
    const sql = `
    SELECT 
        nombre,
        precio,
        imagen1,
        imagen2,
        imagen3,
        descripcion,
        id_categoria,
        id_empresa
    FROM
        materiales_reciclaje
    WHERE
        id_empresa = $1
    `;
    return db.manyOrNone(sql, [idEmpresa]);
}