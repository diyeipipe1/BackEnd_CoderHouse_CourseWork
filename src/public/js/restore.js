const form = document.getElementById('restorePasswordForm');
const email = document.getElementById('email')

form.addEventListener('submit',evt=>{
    evt.preventDefault();
    const data = new FormData(form);
    const obj={};

    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/session/restorepassword', {
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-type': 'application/json',
            'email': email.textContent
        }
    }).then(
        result=>result.json())
    .then(json=>{
        //console.log(json) 
        if (json.status == "success"){
            Swal.fire({
                icon: 'success',
                title: 'Password modified'
            })
            setTimeout(() => {
                window.location.href= "/";
            }, 5000);
        }else if(json.status == "PreviousData"){
            Swal.fire({
                icon: 'error',
                title: "Oops...",
                text: "The password can't be the same as the previous one, try again"
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: j
            })
        }
    });
    //TODO: Error handling empty fields
})