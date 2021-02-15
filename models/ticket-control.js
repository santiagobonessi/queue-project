const path = require('path');
const fs = require('fs');

class Ticket {
  constructor(number, desk) {
    this.number = number;
    this.desk = desk;
  }
}

class TicketControl {
  constructor() {
    this.latest = 0;
    this.today = new Date().getDate();
    this.tickets = [];
    this.latestScreen = [];

    this.init()
  }

  get toJson() {
    return {
      latest: this.latest,
      today: this.today,
      tickets: this.tickets,
      latestScreen: this.latestScreen,
    }
  }

  init() {
    const { today, tickets, ultimo, latestScreen } = require('../db/data.json')
    if (today === this.today) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.latestScreen = latestScreen;
    } else {
      this.saveDB()
    }
  }

  saveDB() {
    const dbPath = path.join(__dirname, '../db/data.json');
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  next() {
    this.latest++;
    const ticket = new Ticket(this.latest, null);
    this.tickets.push(ticket);
    this.saveDB();
    return `Ticket ${ticket.number}`;
  }

  attendTicket(desk) {
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets.shift();
    ticket.desk = desk;
    this.latestScreen.unshift(ticket);
    if (this.latestScreen.length > 4) {
      this.latestScreen.splice(-1, 1);
    }
    this.saveDB();
    return ticket;
  }

}

module.exports = TicketControl;