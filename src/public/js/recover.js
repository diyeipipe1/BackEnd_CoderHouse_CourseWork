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
            Swal.fire({
                icon: 'success',
                title: 'Mail sent'
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'An error ocurred',
                text: json.error
            })
        }
    });
    //TODO: Error handling empty fields
})