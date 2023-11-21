import db from "../config/db.connect.js";

export const asignarCategoria = async (idEmpresa, idCategoria) => {
    const sql = `
        insert into empresa_has_categoria(
            id_empresa,
            id_categoria,
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
        idEmpresa,
        idCategoria,
        new Date(),
        new Date()
    ]);
} 