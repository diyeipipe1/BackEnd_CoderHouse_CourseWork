import {TicketModel} from "../models/ticket.models.js"

export default class TicketDBManager{
    // Read
    async getTickets(){
        try {
            // find gets you all the documents in a collection
            let tickets = await TicketModel.find();

            return tickets
        } catch (error) {
            throw error;
        }
    }

    // Create
    async addTicket(ticketCreat){
        try {
            let ticket = await TicketModel.create(ticketCreat);

            // Return ticket added
            return ticket;
        } catch (error) {
            throw error;
        }
    }
}