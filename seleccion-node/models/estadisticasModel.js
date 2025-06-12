var pool = require('./bd');

async function getEstadisticas() {
    var query = 'SELECT * FROM estadisticas ORDER BY id';
    var rows = await pool.query(query);
    return rows;
}
 
async function deleteEstadisticaById(id) {
    var query = 'DELETE FROM estadisticas WHERE id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
    }

    async function insertEstadistica(obj) {
        try {
            var query = 'INSERT INTO estadisticas SET ?';
            var rows = await pool.query(query, [obj]);
            return rows;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async function getEstadisticaById(id) {
    var query = 'SELECT * FROM estadisticas WHERE id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarEstadisticaById(obj,id) {
    try {
        var query = 'UPDATE estadisticas SET ? WHERE id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
       throw error;
    }
}

module.exports = { getEstadisticas, deleteEstadisticaById, insertEstadistica, getEstadisticaById, modificarEstadisticaById }