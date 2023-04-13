//TODO: Tome cart id inteligentemente
async function addToCart(id) {
    await fetch(`http://localhost:8080/api/carts/63f08515a3f75ae8763c7713/product/${id}`, { method: 'POST' })
    .then(_ => {
        console.log("Success")        
    })
    .catch(error => {
        console.log(error)
    });
  }