function togglePage(pageNum){
    document.querySelector(".active-page").classList.remove("active-page");
    document.querySelector(".active-bottom-button").classList.remove("active-bottom-button");
    document.querySelectorAll(".page")[pageNum].classList.add("active-page");
    document.querySelectorAll(".small-bottom-button")[pageNum].classList.add("active-bottom-button");
}

async function initializeNavbar(){
    try{
        if(JSON.parse(localStorage.getItem('autoLogin')) && JSON.parse(localStorage.getItem('savedUserId')) !== undefined) {
            let savedUserId = JSON.parse(localStorage.getItem('savedUserId'));
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

            const context = await response.json();
            console.log(context.context.user);

            localStorage.setItem("offlineUser", JSON.stringify(context.context.user));
            initialize(context.context.user);
        } else {
            param1 = true;
            loginModal();
        }
    } catch (e){
        document.getElementById("wifi-warning").classList.remove("inactive-modal");
        initialize(JSON.parse(localStorage.getItem("offlineUser")));
    }
}

function initialize(user){
    document.getElementById("logout-button").addEventListener("click", function(e){
        localStorage.setItem("autoLogin", JSON.stringify(false));
        localStorage.setItem("savedUserId", undefined);
        window.location = "../index.html";
    });

    let pageCount = 0;

    document.querySelectorAll(".small-bottom-button").forEach(function(element){
        element.id = `page-toggler-${pageCount}`;

        element.addEventListener("click", function(e){
            togglePage(parseInt(element.id.split("-")[2]));
        })

        pageCount++;
    })

    document.getElementById("welcome-header").innerHTML = `Welcome ${user.firstName} ${user.lastName}`;

    document.getElementById("loading-modal").classList.add("inactive-modal");
}

initializeNavbar();