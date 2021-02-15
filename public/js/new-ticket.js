// HTML references
const lblNewTicket = document.querySelector('#lblNewTicket');
const btnCreate = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
  btnCreate.disabled = false;
});

socket.on('disconnect', () => {
  btnCreate.disabled = true;
});

socket.on('last-ticket', (latest) => {
  lblNewTicket.innerText = `Ticket ${latest}`;
});

btnCreate.addEventListener('click', () => {
  socket.emit('next-ticket', null, (ticket) => {
    lblNewTicket.innerText = ticket;
  });
});