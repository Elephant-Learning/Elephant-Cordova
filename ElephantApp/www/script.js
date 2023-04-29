let param1 = false;
let param2 = false;
let param3 = false;
let currentModal;
const loadingMinimumDelay = 10;
const backBtns = [-1, 0, 1, 0, 3];

const UserTypes = {
    INDIVIDUAL: "INDIVIDUAL",
    STUDENT: "STUDENT",
    INSTRUCTOR: "TEACHER"
}

const User = function(){
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.countryCode = 0;
    this.type = "";

    this.updateName = function(fullname){
        fullname = fullname.split(' ');
        this.firstName = fullname[0];
        this.lastName = fullname[fullname.length - 1]
    }
}

async function signup(data) {
    console.log(data);

    const response = await fetch('https://elephantsuite-rearend.herokuapp.com/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });

    const content = await response.json();
}

async function resetPasswordEmail(){
    /*document.getElementById('desktop-loading-modal').classList.remove('inactive-modal');
    document.getElementById('desktop-alert-modal').className = "desktop-modal inactive-modal";*/

    const email = document.getElementById('forgot-password-email').value;

    const responseEmail = await fetch('https://elephantsuite-rearend.herokuapp.com/login/userByEmail?email=' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const contentEmail = await responseEmail.json();

    /*if(contentEmail.status === "SUCCESS"){
        const responsePass = await fetch('https://elephantsuite-rearend.herokuapp.com/password/sendEmail?id=' + contentEmail.context.user.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        });

        const contentPass = await responsePass.json();
        document.getElementById('desktop-alert-header').innerHTML = "Check Your Email"
        console.log(contentPass);
    } else if(contentEmail.status === "FAILURE") document.getElementById('desktop-alert-header').innerHTML = "Email Not Found"

    document.getElementById('desktop-alert-para').innerHTML = contentEmail.message;
    document.getElementById('desktop-loading-modal').classList.add('inactive-modal');
    document.getElementById('desktop-alert-modal').classList.remove('inactive-modal')
    setTimeout(function(){
        document.getElementById('desktop-alert-modal').classList.add('inactive-modal')
    }, 5000);*/
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

    console.log(modalNumber, backBtns[modalNumber]);

    if(modalNumber === -1){
        navigator.app.exitApp();
    } else {
        document.querySelector(".active-container").classList.remove("active-container");
        document.querySelectorAll(".login-container")[modalNumber].classList.add("active-container");
    }

    if(backBtns[modalNumber] !== -1 && document.getElementById("back-button-modal").classList.contains("inactive-modal")){
        document.getElementById("back-button-modal").classList.remove("inactive-modal");
    } else if(backBtns[modalNumber] === -1 && !document.getElementById("back-button-modal").classList.contains("inactive-modal")){
        document.getElementById("back-button-modal").classList.add("inactive-modal");
    }

    currentModal = modalNumber;
}

document.getElementById("main-container-login-btn").addEventListener("click", function(e){
    toggleModal(1);
});
document.getElementById("main-container-signup-btn").addEventListener("click", function(e){
    toggleModal(3);
});

function isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// index corresponds to input with class input-container, and number corresponds to button with class input-container-primary-button
const buttonCorrespondence = [0, 0, 1, 2, 2, 2];

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
    if(param1 && param2 && param3) document.getElementById("loading-modal").classList.add("inactive-modal");
}

function signupIndividual(){
    const user = new User();

    user.updateName(document.getElementById('individual-name').value);
    user.email = document.getElementById('individual-email').value;
    user.password = document.getElementById('individual-password').value;
    user.type = UserTypes.INDIVIDUAL;
    //user.countryCode = selectedLocation;
    user.countryCode = 252;

    signup(user);
}

function initialize(){
    let inputNum = 0;

    document.querySelectorAll(".input-container").forEach(function(element){
        const input = element.children[1];
        element.id = `input-container-${inputNum}`;

        input.addEventListener("input", function(e){
            if(input.getAttribute("type") === "email"){
                if(isEmailValid(input.value)) removeBtnDeactivation(buttonCorrespondence[parseInt(element.id.split("-")[2])]);
            } else {
                removeBtnDeactivation(buttonCorrespondence[parseInt(element.id.split("-")[2])]);
            }
        })

        console.log();

        inputNum++;
    });

    document.getElementById("back-button-modal").addEventListener("click", function(e){
        const audio = new Audio("./audio/click.mp3");
        audio.play();

        toggleModal(backBtns[currentModal]);
    });

    document.getElementById("forgot-password-button").addEventListener("click", function(e){
        toggleModal(2);
    });

    document.getElementById("individual-signup-portal").addEventListener("click", function(e){
        toggleModal(4);
    });

    document.getElementById("different-account-btn").addEventListener("click", function(e){
        toggleModal(3);
    });

    document.getElementById("forgot-password-btn").addEventListener("click", function(e){
        resetPasswordEmail();
    })

    document.querySelectorAll(".primary-button").forEach(function(element){
        element.addEventListener("click", function(e){
            const audio = new Audio("./audio/click.mp3");
            audio.play();
        })
    });

    document.querySelectorAll(".secondary-button").forEach(function(element){
        element.addEventListener("click", function(e){
            const audio = new Audio("./audio/click.mp3");
            audio.play();
        })
    });

    param3 = true;
    loginModal();
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
    if(document.getElementById("login-button").classList.contains("deactivated-primary-button")) return;

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
});

initializeNavbar();
initialize();