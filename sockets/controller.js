const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    // Cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimosPantalla);
    notificarPendientes(socket);

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        notificarPendientes(socket);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                message: 'El escritorio es obligatorio.'
            });
        }
        const ticket = ticketControl.atenderTicket(escritorio);

        // Notificar cambio en ultimos tickets pantalla
        socket.broadcast.emit('estado-actual', ticketControl.ultimosPantalla);
        notificarPendientes(socket);

        if (!ticket) {
            callback({
                ok: false,
                message: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
        callback(ticket);
    });
}

function notificarPendientes(socket) {
    // Notificar tickets pendientes
    socket.emit('tickets-pendientes', ticketControl.tickets);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets);
}

module.exports = {
    socketController
}
