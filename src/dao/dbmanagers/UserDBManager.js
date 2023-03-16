import {UserModel} from "../models/user.models.js";

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
}