async function initializeNavbar(){
    try{
        if(JSON.parse(localStorage.getItem('autoLogin'))) {
            let savedUserId = JSON.parse(localStorage.getItem('savedUserId'))
            const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login/user?id=' + savedUserId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            })

            console.log("osidjfoisdjfiojdsof");
        } else {
            param1 = true;
            loginModal();
        }
    } catch (e){
        console.log("Welcome to Elephant")
    }

    console.log("sdf")
}

param1 = false;
param2 = false;

function loginModal(){
    if(param1 && param2) document.getElementById("loading-modal").classList.add("inactive-modal");
}

setTimeout(function(){
    param2 = true;
    loginModal();
}, 2000)

initializeNavbar();