const form = document.getElementById('recoverForm');

form.addEventListener('submit',evt=>{
    evt.preventDefault();
    const data = new FormData(form);
    const obj={};

    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/session/sendemail', {
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-type': 'application/json'
        }
    }).then(
        result=>result.json())
    .then(json=>{
        //console.log(json)
        if (json.status == "success"){
            //STEPHOMEWORK
            window.location.href= "/products";
        }
    });
    //TODO: Error handling empty fields
})