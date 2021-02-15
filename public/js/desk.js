// HTML references

const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendings = document.querySelector('#lblPendings');

const searchParam = new URLSearchParams(window.location.search);

if (!searchParam.has('desk')) {
  window.location = 'index.html';
  throw new Error('Desk is mandatory field');
}

const desk = searchParam.get('desk');

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  btnAttend.disabled = false;
});

socket.on('disconnect', () => {
  btnAttend.disabled = true;
});

socket.on('pending-tickets', (pendientes) => {
  if (pendientes.length === 0) {
    lblPendings.style.display = 'none';
  } else {
    lblPendings.style.display = '';
    lblPendings.innerText = pendientes.length;
  }
});

btnAttend.addEventListener('click', () => {
  socket.emit('attend-ticket', { desk }, ({ ok, ticket }) => {
    if (!ok) {
      lblTicket.innerText = "Empty";
      return divAlert.style.display = '';
    }
    lblTicket.innerText = `Ticket ${ticket.number}`;
  });
});