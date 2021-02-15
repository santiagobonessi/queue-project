const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    // Cuando un cliente se conecta
    socket.emit('last-ticket', ticketControl.latest);
    socket.emit('current-state', ticketControl.latestScreen);
    notifiyPendings(socket);

    socket.on('next-ticket', (payload, callback) => {
        const next = ticketControl.next();
        callback(next);

        notifiyPendings(socket);
    });

    socket.on('attend-ticket', ({ desk }, callback) => {
        if (!desk) {
            return callback({
                ok: false,
                message: 'Desk is mandatory field'
            });
        }
        const ticket = ticketControl.attendTicket(desk);

        // Notificar cambio en ultimos tickets pantalla
        socket.broadcast.emit('current-state', ticketControl.latestScreen);
        notifiyPendings(socket);

        if (!ticket) {
            callback({
                ok: false,
                message: 'There are not pending tickets'
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

function notifiyPendings(socket) {
    // Notificar tickets pendientes
    socket.emit('pending-tickets', ticketControl.tickets);
    socket.broadcast.emit('pending-tickets', ticketControl.tickets);
}

module.exports = {
    socketController
}
