const queryString = new URLSearchParams(location.search);
const qsForm = queryString.get('form');

const userWrapper = document.getElementById('user-wrapper');

const accountForm = document.getElementById('account-form');
const accountName = document.getElementById('account-name');
const accountBalance = document.getElementById('account-balance');

const logoutForm = document.getElementById('logout-form');

const userForm = document.getElementById('user-form');
const nameInput = document.getElementById('name-input');
const passwordInput = document.getElementById('password-input')

let loginAttempt = false;

const toggleTransactionPopup = (id) => {
    document.getElementById(`transaction-popup-${id}`).classList.toggle('hide');
}

const toggleAccountPopup = () => {
    document.getElementById('account-popup').classList.toggle('hide')
}

const startTransaction = (transactionType, accountNumber, balance) => {
    toggleTransactionPopup(accountNumber);
    const transactionForm = document.getElementById(`transaction-form-${accountNumber}`);
    
    document.getElementById(`heading-${accountNumber}`).innerText = transactionType;

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let newBalance = 0;
        balance = +balance;
        const transactionAmount = +document.getElementById(`transaction-input-${accountNumber}`).value;
        if(transactionType === 'Withdraw'){
            if(transactionAmount > balance){
                alert('Not enough money on the account, try again!')
            }
            else{
                newBalance = balance - transactionAmount;
                updateAccount(accountNumber, newBalance);
            }
        }
        else{
            newBalance = balance + transactionAmount;
            updateAccount(accountNumber, newBalance);
        }
    })
}

accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const account = JSON.stringify({
        accounts: {
            name: accountName.value,
            balance: accountBalance.value
        }
    })
    addAccount(account);
    toggleAccountPopup();
})

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.stringify({
        user: nameInput.value,
        password: passwordInput.value,
    })

    if(qsForm === 'Login'){
        loginAttempt= true;
        await login(user);
        checkIfLoggedIn();
        userForm.reset();    
    }
    else if(qsForm === 'Register'){
        await register(user);
        alert('You are registered, you can now log in');
        window.location.href = 'http://localhost:3000/?form=Login';
    }
})

const renderUserinfo = async () => {
    const user = await getActiveUser();
    userWrapper.innerHTML = drawUserInfo(user);
}

const start = () => {
    document.getElementById('user-form-heading').innerText = qsForm;
    document.getElementById('user-form-btn').innerText = qsForm;
    if(qsForm){
        userForm.classList.remove('hide');
    }
}

const checkIfLoggedIn = async () => {
    const user = await getActiveUser();
        if(user){
            document.getElementById('form-wrapper').classList.add('hide');
            document.getElementById('main').classList.add('logged-in');
            renderUserinfo();
        }
        else{
            if(loginAttempt){
                document.getElementById('error-msg').innerText = 'wrong username or password, try again'
            }
        }
}

start();
checkIfLoggedIn();
