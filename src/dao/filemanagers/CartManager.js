import fs from "fs"

export default class CartManager{
    constructor(path){
        this.path = path;
        this.carts = [];
        this.init = false;
    }

    // Crea el archivo si no existe
    async initManager(){
        try {
            let carts = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(carts)
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
    async addCart(){
        try {
            if (!this.init) {
                await this.initManager()
            }

            // Find maxID in file to set new ID as one higher
            let maxID = 0
            if (this.carts.length>0) {
                this.carts.forEach((cart) => {
                    if (cart.id > maxID) {
                        maxID = cart.id
                    }
                })
            }

            // Creates cart 
            let cart = {
                'id': maxID + 1,
                'products': []
            }

            // Save data in file and in array
            this.carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))

            // Return product added
            return cart
        
        } catch (error) {
            throw error;
        }
    }

    // Read
    async getCartById(id){
        try {
            if (!this.init) {
                await this.initManager()
            }

            id = Number(id)
            if (!id){ throw new Error("the param pid is expected to be a number")}

            let cart = this.carts.find(cart => cart.id === id)
            if (cart) {
                return cart.products
            }

            console.log("no carts with given ID")
            return null
        } catch (error) {
            throw error
        }
    } 

    // Add stock for product
    // toddo: Add return cart for next iteration?
    async addProductForCart(cid, pid){
        try {
            if (!this.init) {
                await this.initManager()
            }

            cid = Number(cid)
            pid = Number(pid)
            if ((!pid) || (!cid) || (pid<0)){ throw new Error("the param pid is expected to be a positive number")}

            let cart = await this.getCartById(cid)

            if (cart) {
                let done = false
                cart.forEach((prod) =>{
                    if (prod.id == pid){
                        prod.quantity++
                        done= true
                    }
                })

                if (!done){
                    cart.push({"id":pid, "quantity":1})
                    done= true
                }

                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))

                // Return operation status
                return done
            }else {
                console.log('cart to add products to not found')
                throw new Error("no cart found with id given to add product")
            }

        } catch (error) {
            throw error
        }
        // si se añade uno existente aumentar, incrementar de a uno
    }
}