import ProductDTO from "../dao/dto/ProductDTO.js"

// TODO: Move DBManager logic here?
export default class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }

    // Create
    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        try {
            const productDTO = new ProductDTO({title, description, price, thumbnail, code, stock, category, status})

            return await this.dao.addProduct(
                productDTO.title, 
                productDTO.description, 
                productDTO.price, 
                productDTO.thumbnail, 
                productDTO.code, 
                productDTO.stock, 
                productDTO.category, 
                productDTO.status
            )
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getProducts(limit, page, sort, query) {
        try {
            return await this.dao.getProducts(limit, page, sort, query)
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getProductById(id){
        try {
            return await this.dao.getProductById(id)
        } catch (error) {
            throw error;
        }
    }

    // Update 
    async updateProduct(id, productNew){
        try {
            const productDTO = new ProductDTO(productNew)

            return await this.dao.updateProduct(id, productDTO)
        } catch (error) {
            throw error;
        }
    }

    // Delete
    async deleteProduct(id) {
        try {
            return await this.dao.deleteProduct(id)
        } catch (error) {
            throw error;
        }
    }
}