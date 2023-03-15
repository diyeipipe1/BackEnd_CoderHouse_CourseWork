const socket = io("localhost:8080/realtimeproducts");

const deleteForm = document.getElementById("deleteForm");
const table = document.getElementById("bodyProds");

// When I submit the form, do this or that
deleteForm.addEventListener("submit", event => {
    event.preventDefault();
    const id = document.getElementById("productId").value;
    // Method delete to specific URI, tell server if succesfull with emit
    fetch(`/api/products/${id}`, { method: 'DELETE' })
    .then(_ => {
        socket.emit("update");
    })
    .catch(error => {
        console.log(error)
    });
})


socket.on("updateList", data => {
    console.log(data)
    table.innerHTML = "";
    for(let product of data) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.thumbnail}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
        `;
        table.appendChild(row);
    }
})
