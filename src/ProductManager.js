const fs= require("fs");

class ProductManager {
    constructor(path){
        this.path = path;
        this.products = [];
        this.init = false;
    }

    // Crea el archivo si no existe
    async initManager(){
        try {
            let products = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(products)
            this.init=true
        }catch (e){
            try {
                await fs.promises.writeFile(this.path, '[]');
                this.init = true;
            } catch (error) {
                throw error;
            }
        }
    } 

    // Create
    async addProduct(title, description, price, thumbnail, code, stock){
        try {
            if (!this.init) {
                await this.initManager()
            }

            // Error checking, see if there's missing data
            if (title && description && price && thumbnail && code && stock){
                // Code must be unique
                if (this.products.some(prod => prod.code === code)) {
                    console.log('código repetido')
                    return null
                }

                // Find maxID in file to set new ID as one higher
                let maxID = 0
                if (this.products.length>0) {
                    this.products.forEach((prod) => {
                        if (prod.id > maxID) {
                            maxID = prod.id
                        }
                    })
                }

                let product = {
                    'id': maxID + 1,
                    'title': title,
                    'description': description,
                    'price': price,
                    'thumbnail': thumbnail,
                    'code': code,
                    'stock': stock
                }

                // Save data in file and in array
                this.products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products))

                // Return product added
                return product
            }else{
                console.log("faltan datos")
                return null
            }
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getProducts(){
        try {
            if (!this.init) {
                await this.initManager()
            }

            console.log(this.products)
            return this.products
        }catch (error){
            throw error;
        }
    }

    // Read
    async getProductById(id){
        try {
            if (!this.init) {
                await this.initManager()
            }

            let product = this.products.find(prod => prod.id === id)
            if (product) {
                console.log(product)
                return product
            }

            console.log("No hay producto con tal ID")
            return null
        } catch (error) {
            throw error
        }
    } 

    // Update 
    async updateProduct(id, productNew){
        try {
            if (!this.init) {
                await this.initManager()
            }

            let productAct = await this.getProductById(id)
            if (productAct){
                // Set the new data for the product if it arrived on the Object. 
                // If not, leave the data it had already
                productAct.title = productNew?.title || productAct.title
                productAct.description = productNew?.description || productAct.description
                productAct.price = productNew?.price || productAct.price
                productAct.thumbnail = productNew?.thumbnail || productAct.thumbnail
                productAct.stock = productNew?.stock || productAct.stock

                // Uses map to change in the array the actual product with the updated product if the IDs match. 
                // All other products will be safe
                let products = this.products.map(prod => prod.id === id ? productAct : prod)
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                console.log(productAct)
            }else{
                console.log('producto no encontrado')
                return null
            }
        } catch (error) {
            throw error
        }
    }

    // Delete
    async deleteProduct(id) {
        try {
            if (!this.init) {
                await this.initManager()
            }

            let product = await this.getProductById(id)
            if (product) {
                // Uses filter to keep all products but the one where the id matches the parameter id
                let products = this.products.filter(prod => prod.id !== id)
                this.products = products

                // Overwrites updated product array onto the file 
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                return true
            } else {
                console.log('producto no encontrado')
                return false
            }
        } catch (error) {
            throw error
        }
    }
}

// Use folder above mine
const productManager = new ProductManager("./products.json");

//productManager.addProduct("Rosas", "Flores lindas", 30, "ubicacionImagen.txt", "rlr01", 15);
//productManager.addProduct("Claveles", "Flores", 30, "ubicacionImagen2.txt", "rlr02", 25);
//productManager.addProduct("Alfajores", "Rico", 30, "ubicacionImagen3.txt", "rlr03", 25);

//productManager.getProductById(2)
//productManager.getProductById(22)

//productManager.getProducts();

//productManager.updateProduct(3, {title:"Zapato", description:"Para caminar", price:40, thumbnail:"ubicacionArchivo.txt", stock:20});
//productManager.updateProduct(33, {title:"Zapato", description:"Para caminar", price:40, thumbnail:"ubicacionArchivo.txt", stock:20});

//productManager.deleteProduct(2);
//productManager.deleteProduct(23);