import {MessagesModel} from "../models/messages.models.js";

export default class MessagesDBManager{
    // Read
    async getMessages(){
        try {
            // find gets you all the documents in a collection, this case the collection in the product model
            let messages = await MessagesModel.find();

            return messages
        } catch (error) {
            throw error;
        }
    }

    // Create
    async addMessage(user, msg){
        try {
            let message = await MessagesModel.create({
                user: user, 
                message: msg
            })

            // Return message added
            return message
        } catch (error) {
            throw error;
        }
    }
}