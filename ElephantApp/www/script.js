let param1 = false;
let param2 = false;
let currentModal;
const loadingMinimumDelay = 10;
const backBtns = [-1, 0, 1, 0, 3];

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

            localStorage.setItem("offlineUser", context.context.user);
        } else {
            param1 = true;
            loginModal();
        }
    } catch (e){
        document.getElementById("wifi-warning").classList.remove("inactive-modal");
    }
}

function toggleModal(modalNumber){

    console.log(modalNumber);

    if(modalNumber === -1){
        navigator.app.exitApp();
    } else {
        document.querySelector(".active-container").classList.remove("active-container");
        document.querySelectorAll(".login-container")[modalNumber].classList.add("active-container");
    }

    currentModal = modalNumber;
}

document.getElementById("main-container-login-btn").addEventListener("click", function(e){
    toggleModal(1);
});
document.getElementById("main-container-signup-btn").addEventListener("click", function(e){
    toggleModal(3);
});

const buttonCorrespondence = [0, 0];

function removeBtnDeactivation(btnNum){
    let removeDeactivation = true;
    let cycledToNum = false;

    console.log(btnNum);

    for(let i = 0; i < buttonCorrespondence.length; i++){
        if(buttonCorrespondence[i] === btnNum){
            if(!cycledToNum) cycledToNum = true;

            if(document.querySelectorAll(".input-container")[i].children[1].value === ""){
                removeDeactivation = false;
                break;
            }
        }
    }

    if(removeDeactivation && document.querySelectorAll(".input-container-primary-button")[btnNum].classList.contains("deactivated-primary-button")){
        document.querySelectorAll(".input-container-primary-button")[btnNum].classList.remove("deactivated-primary-button")
    } else if(!removeDeactivation && !document.querySelectorAll(".input-container-primary-button")[btnNum].classList.contains("deactivated-primary-button")){
        document.querySelectorAll(".input-container-primary-button")[btnNum].classList.add("deactivated-primary-button")
    }
}

function loginModal(){
    if(param1 && param2) document.getElementById("loading-modal").classList.add("inactive-modal");
}

function initialize(){
    let btnNum = 0;

    document.querySelectorAll(".login-container").forEach(function(element){
        element.children[0].id = `back-button-${btnNum}`

        element.children[0].children[0].addEventListener("click", function(e){
            toggleModal(backBtns[element.children[0].id.split("-")[2]]);
        });

        btnNum++;
    })

    let inputNum = 0;

    document.querySelectorAll(".input-container").forEach(function(element){
        const input = element.children[1];
        element.id = `input-container-${inputNum}`;

        input.addEventListener("input", function(e){
            removeBtnDeactivation(buttonCorrespondence[parseInt(element.id.split("-")[2])])
        })

        console.log();

        inputNum++;
    });
}

setTimeout(function(){
    param2 = true;
    loginModal();
}, loadingMinimumDelay);

function onDeviceReady() {
    document.addEventListener("backbutton", function(e){
        toggleModal(backBtns[currentModal]);
    }, false)
}

document.getElementById("login-button").addEventListener("click", async function(e){
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
        mode: 'cors'
    });

    const content = await response.json();
    console.log(content);

    if(content.status === "FAILURE"){
        console.log("Failure")
    } else {
        localStorage.setItem('savedUserId', JSON.stringify(content.context.user.id));
        localStorage.setItem('autoLogin', JSON.stringify(true));
        location.href = "./dashboard";
    }
})

initializeNavbar();
initialize()