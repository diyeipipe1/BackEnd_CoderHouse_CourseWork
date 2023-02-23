const btnLogout = document.getElementById('btnLogout');

if (btnLogout) {
    btnLogout.addEventListener('click' , ()=>{
        fetch('/api/session/logout', {
            method:'GET',
            headers:{
                'Content-type': 'application/json'
            }
        }).then(result=>{
            if (result.status == 200){
                window.location.href= "/";
            }
        });
    })
}