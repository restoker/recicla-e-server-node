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