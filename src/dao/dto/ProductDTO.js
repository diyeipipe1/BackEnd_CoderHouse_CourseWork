export default class ProductDTO{
    constructor(productRaw){
        this.title = productRaw.title ? productRaw.title : "defaultTitle" 
        this.description = productRaw.description ? productRaw.description : "No description" 
        this.price = productRaw.price ? productRaw.price : 1 
        this.thumbnail = productRaw.thumbnail ? productRaw.thumbnail : "defaultThumbnail" 
        this.code = productRaw.code 
        this.stock = productRaw.stock ? productRaw.stock : 1 
        this.category = productRaw.category ? productRaw.category : "CategoryDefault" 
        this.status = productRaw.status ? productRaw.status : true
    }
}