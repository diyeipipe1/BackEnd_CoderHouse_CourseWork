import nodemailer from 'nodemailer';

class MailerServiceClass{
    constructor(){
        this.transport= nodemailer.createTransport({
            service:"gmail",
            port:587,
            auth:{
                user: "diazrochajuanfe@gmail.com",
                pass: "fmuaccvehbnmrakl"
            }
        })
    }

    sendRecoveryMail= async({from, to, subject, html, attachments=[]})=>{
        try {
            let result = await this.transport.sendMail({
                from,
                to,
                subject,
                html,
                attachments
            })
            //console.log(result);
            return result
        } catch (error) {
            throw error
        }
    }
}

const MailerService = new MailerServiceClass();
export default MailerService;