import db from "../config/db.connect.js";

export const categoriaExistePorId = async id => {
    return db.task(async t => {
        const categoria = await t.one('select id, nombre from categoria where id = $1', id);
        return categoria;
    }).then(data => data)
        .catch(e => false);
}
