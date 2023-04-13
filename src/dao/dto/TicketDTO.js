export default class TicketDTO{
    constructor(ticketRaw){
        this.code = this.generateCode()
        this.amount = ticketRaw.amount ? ticketRaw.amount : 1
        this.purchaser = ticketRaw.purchaser ? ticketRaw.purchaser : "No purchaser selected" 
    }

    generateCode(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }
}