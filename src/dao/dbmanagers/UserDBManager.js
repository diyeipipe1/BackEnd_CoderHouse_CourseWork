import {UserModel} from "../models/user.models.js";
import {getCurrentFormattedDate} from "../../utils.js"

export default class UserDBManager{
    // Register
    async registerUser(first_name, last_name, email, age, password, cid){
        try {
            let user = UserModel.create({
                first_name, 
                last_name, 
                email, 
                age, 
                password,
                cart: cid 
            })

            // Return user registered
            return user
        } catch (error) {
            throw error;
        }
    }

    // login
    async checkUser(email){
        try {
            let user = await UserModel.findOne({email});
            if (user) {
                console.log("user with email found")
                return true
            }

            return false
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // login
    async loginUser(email, password){
        try {
            let user = await UserModel.findOne({email, password});
            if (user) {
                return user
            }

            console.log("email or password invalid")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // Get
    async getUserByEmail(email){
        try {
            let user = await UserModel.findOne({email});
            if (user) {
                return user
            }

            console.log("email invalid")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    }

    // Read user
    async getUserById(id){
        try {
            let user = await UserModel.findById(id);
            if (user) {
                return user
            }

            console.log("no users with given ID")
            return null
        } catch (error) {
            if ((error.message).indexOf("Cast to ObjectId failed for value") !== -1){
                return null
            }else{
                throw error
            }
        }
    } 

    // Update 
    async updateUser(email, userNew){
        try {
            let userAct = await this.getUserByEmail(email)
            if (userAct){
                let result = await UserModel.updateOne({_id:userAct.id}, userNew);
                //console.log(result)
                
                if (result.modifiedCount >0){
                    let finalUser = await this.getUserByEmail(email)
                    return finalUser
                }else{
                    console.log('error updating user')
                    throw new Error("error updating user, data might be wrong type or same as current document")
                }
            }else{
                console.log('user to update not found')
                throw new Error("no user found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }

    // Update membership
    async updateMembership(uid){
        try {
            let user = await this.getUserById(uid)

            if (user){
                if (user.role == "user") {
                    user.role = "premium"
                }else if (user.role == "premium"){
                    user.role = "user"
                }  

                let result = await UserModel.updateOne({_id:user.id}, user);

                if (result.modifiedCount >0){
                    let finalUser = await this.getUserByEmail(user.email)
                    return finalUser
                }else{
                    console.log('error updating user')
                    throw new Error("error updating user, data might be wrong type or same as current document")
                }
            }

            throw new Error("no user found with given id")
        } catch (error) {
            throw error
        }
    }

    // Update last_connection
    async updateLastConnection(email){
        try {
            let user = await this.getUserByEmail(email)
            if (user){
                user.last_connection = getCurrentFormattedDate();
                
                let userUpdated = await this.updateUser(email, user)
                console.log(userUpdated.last_connection)
                return userUpdated
            }else{
                console.log('user to update not found')
                throw new Error("no user found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }

    // Update documents 
    async addDocuments(uid, docList){
        try {
            let user = await this.getUserById(uid)
            if (user){
                for (const doc of docList){
                    user.documents.push(doc)
                }
                
                let userUpdated = await this.updateUser(user.email, user)
                return userUpdated
            }else{
                console.log('user to update not found')
                throw new Error("no user found with id given to update")
            }
        } catch (error) {
            throw error
        }
    }
}