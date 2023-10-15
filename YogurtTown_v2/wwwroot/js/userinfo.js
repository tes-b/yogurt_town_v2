// ====================================================
// Variables
// ====================================================

var isLoggedIn = false;

// ====================================================
// Process
// ====================================================

getUserInfo();

// ====================================================
// FUNCTIONS
// ====================================================

function openSlideMenu() {
    document.getElementById('side-menu').style.width = '250px';
}
  
function closeSlideMenu() {
    document.getElementById('side-menu').style.width = '0';
}

function toggleUserMenu() {
    var userPopupContent = document.querySelector('.user-popup-content');
    userPopupContent.style.display = (userPopupContent.style.display === 'block') ? 'none' : 'block';
}

function userInfo() {
    if (isLoggedIn){
        toggleUserMenu();
    }
    else {
        location.href = '/accounts/login/';
    }
}

function userLogout() {
    // console.log("log out");
    fetch("/accounts/api/login/", {
        method: 'DELETE',
        credentials: 'include' // 쿠키를 request에 같이 보낸다.
    })
        .then(response => {
            if (response.status === 202) {
                console.log("log out");
            }
            else {
                throw new Error('logout failed');
            }
        })
        .finally(() => {
            location.href = '/wordle/';
        })   
    
}

function getUserInfo() {
    fetch("/accounts/api/login/", {
        method: 'GET',
        credentials: 'include' 
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } 
            else {
                throw new Error('Not logged in');
            }
        })
        .then(data => {
            // 로그인 되어있는 경우 아이디 표시
            isLoggedIn = true;
            username = data.username;
            user_id = data.id;

            const usernameDiv = document.getElementById('user-info');
            usernameDiv.textContent = username;
        })
        .catch(error => {
            isLoggedIn = false;
            // console.error(error);
            // const usernameDiv = document.getElementById('username');
            // usernameDiv.textContent = "Log In";
        });
}


function userWithdrawal() {
    console.log("user withdrawal");
    let input = prompt("탈퇴를 원하시면 'delete'를 입력하세요.");
    console.log(input);
    if (input === 'delete') {
        console.log("계정삭제");
        fetch("/accounts/api/signup/", {
        method: 'DELETE',
        credentials: 'include' // 쿠키를 request에 같이 보낸다.
        })
            .then(response => {
                if (response.status === 200) {
                    alert("탈퇴되었습니다.");
                    location.href = '/wordle/';
                }
                else {
                    alert("탈퇴에 실패했습니다.");
                    location.reload();
                }
            })   
    }
    else if (input == null){
        // nothing
    }
    else {
        alert("잘못된 입력입니다.");
    }
    
}