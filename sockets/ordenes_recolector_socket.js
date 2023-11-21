

const socketOrden = (io) => {
    const nspOrden = io.of('/ordenes/recolector');
    nspOrden.on('connection', (socket) => {
        // console.log(socket);
        console.log('un usuario se conecto');

        socket.on('posicion', (data) => {
            // console.log(JSON.stringify(data));
            nspOrden.emit(`posicion/${data.id_order}`, {lat: data.lat, lng: data.lng});
        });

        socket.on('despachado', (data) => {
            nspOrden.emit(`despachado/${data.id_order}`, {id_order: data.id_order});
        });

        socket.on('despacharRecolector', (data) => {
            console.log(`se despacho: ${data}`);
            nspOrden.emit(`ordenRecolector/${data.id_order}`, {id_recolector: data.id_recolector});
        });

        socket.on('disconnect', (data) => {
            console.log('usuario desconectado');
        });

    });
}

export default socketOrden;