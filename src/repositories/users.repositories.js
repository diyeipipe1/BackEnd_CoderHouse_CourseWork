import UserDTO from "../dao/dto/UserDTO.js"

// A shell class that calls the methods from the dao (we know which methods the dao has) after
// going by a DTO arquitecture to check correct data. This case is a little unnecesary as 
// bussiness has data checking logic, but that could be simplified by moving some verifs to this class
export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    // Use session user and DTO to return on sensible data
    getUserCurrent(userSession) {
        // To have a correct flow of data, instance the DTO
        const userDTO = new UserDTO(userSession)

        return {
            first_name: userDTO.first_name,
            last_name: userDTO.last_name,
            email: userDTO.email,
            age: userDTO.age,
            role: userDTO.role,
            cart: userDTO.cart,
        } 
    }

    // Register
    async registerUser(first_name, last_name, email, age, password, cid){
        try {
            const userDTO = new UserDTO({first_name, last_name, email, age, password, cid})

            return await this.dao.registerUser(
                userDTO.first_name, 
                userDTO.last_name, 
                userDTO.email, 
                userDTO.age, 
                userDTO.password, 
                userDTO.cid
            )
        } catch (error) {
            throw error;
        }
    } 

    // login
    async checkUser(email){
        try {
            return await this.dao.checkUser(email)
        } catch (error) {
            throw error;
        }
    } 

    // login
    async loginUser(email, password){
        try {
            return await this.dao.loginUser(email, password)
        } catch (error) {
            throw error;
        }
    }

    // Get
    async getUserByEmail(email){
        try {
            return await this.dao.getUserByEmail(email)
        } catch (error) {
            throw error;
        }
    }

    // Read user
    async getUserById(id){
        try {
            return await this.dao.getUserById(id)
        } catch (error) {
            throw error;
        }
    }

    // Update user
    async updateUser(email, userNew){
        try {
            return await this.dao.updateUser(email, userNew)
        } catch (error) {
            throw error;
        }
    }

    // Update user membership
    async updateMembership(uid){
        try {
            return await this.dao.updateMembership(uid)
        } catch (error) {
            throw error;
        }
    }

    // Update last_connection
    async updateLastConnection(email){
        try {
            return await this.dao.updateLastConnection(email)
        } catch (error) {
            throw error;
        }
    }
    }