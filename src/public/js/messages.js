const socket = io("localhost:8080/chat");

// Sweet alert, for interactive alert, here and then the HTML script link
Swal.fire({
    title: "Identificate :",
    input: "text",
    text: "Ingrese su nombre en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas un nombre de usuario"
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
    socket.emit("authenticated", user)
    socket.emit("chatMake") 
})


const chatBox = document.getElementById("textbox");

// When a key is unpressed check here, if it was enter, send the message to app.js 
chatBox.addEventListener("keyup", event => {
    if (event.key === "Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit("msg", {user: user, message: chatBox.value});
            chatBox.value= ""
        }
    }
})

// This hears for anyone that emits with the key messageLog, gets the <p> element from HTML
// and then fill it with the accum data from the logs that is kept on the cloud and arrives as data
socket.on("messageLog", data => {
    if (!user) return; // Si user no existe, ruuun
    const messageLog = document.getElementById("log");
    let messages = '';
    data.forEach(msgObj => {
        messages += `${msgObj.user} dice:  ${msgObj.message} <br/>`
    });
    messageLog.innerHTML=messages;
})

// load data as soon as page is set
socket.on("chatMakeJS", data => {
    const messageLog = document.getElementById("log");
    let messages = '';
    data.forEach(msgObj => {
        messages += `${msgObj.user} dice:  ${msgObj.message} <br/>`
    });
    messageLog.innerHTML=messages;
})

// I recieve adata and show it on a toast, when a new User connects Ill show it
socket.on("newUserConnected", data => {
    if (!user) return;
    Swal.fire({
        toast: true, 
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})