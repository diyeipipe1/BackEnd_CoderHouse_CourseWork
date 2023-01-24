const socket = io("localhost:8080/realtimeproducts");

const deleteForm = document.getElementById("deleteForm");

// When I submit the form, do this or that
deleteForm.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("productId").value;
    // Method delete to specific URI, tell server if succesfull with emit
    fetch(`/api/products/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(_ => {
        socket.emit("update");
    })
    .catch(error => {
        console.log(error)
    });
})

/*
TODO: Me
socket.on("updateList", data => {
    const template = Handlebars.compile(document.getElementById("realTimeProducts-template").innerHTML);
    const container = document.getElementById("realTimeProducts-container");
    container.innerHTML = template({ products: data });
})*/
