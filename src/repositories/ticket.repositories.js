import TicketDTO from "../dao/dto/TicketDTO.js"

export default class TicketRepository{
    constructor(dao){
        this.dao = dao;
    }

    // Create
    async addTicket(ticket){
        try {
            const ticketDTO = new TicketDTO(ticket)
            return await this.dao.addTicket(ticketDTO)
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getTickets(){
        try {
            return await this.dao.getTickets()
        } catch (error) {
            throw error;
        }
    }
}