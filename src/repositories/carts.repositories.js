export default class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    // Create
    async addCart(){
        try {
            return await this.dao.addCart()
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getCartByIdPopulate(id){
        try {
            return await this.dao.getCartByIdPopulate(id)
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getCartById(id){
        try {
            return await this.dao.getCartById(id)
        } catch (error) {
            throw error;
        }
    }

    // Add stock for product
    async addProductForCart(cid, pid){
        try {
            return await this.dao.addProductForCart(cid, pid)
        } catch (error) {
            throw error;
        }
    }

    // Update product list for cart
    async updateCart(cid, prodsNew){
        try {
            return await this.dao.updateCart(cid, prodsNew)
        } catch (error) {
            throw error;
        }
    }

    // Update product quantity for cart
    async updateCartProduct(cid, pid, quantity){
        try {
            return await this.dao.updateCartProduct(cid, pid, quantity)
        } catch (error) {
            throw error;
        }
    }

    // Delete product list for cart
    async deleteCart(cid){
        try {
            return await this.dao.deleteCart(cid)
        } catch (error) {
            throw error;
        }
    }

    // Delete product for cart
    async deleteProductForCart(cid, pid){
        try {
            return await this.dao.deleteProductForCart(cid, pid)
        } catch (error) {
            throw error;
        }
    }
}