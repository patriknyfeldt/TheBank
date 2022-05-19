const drawUserInfo = (user) => `
<div class="user-box">
<h3>${user.user}</h3>
<button class="btn" onClick="toggleAccountPopup()">Add account</button>
<button class="btn" onClick="logOut()">Log Out</button>
</div>
<div class="list-wrapper">
<h3>${user.accounts.length > 0? 'Your accounts:': 'You have no accounts to show'}</h3>
<ul class="accounts-list">${user.accounts.map(drawAccount).join('')}</ul>
</div>
`
const drawAccount = (account) => `
<li class=list-item>
    <div class="text-box">
        <p class="bold">Account name: </p><p> ${account.name}</p>
    </div>
    <div class="text-box">
        <p class="bold">Account number: </p><p> ${account.number}</p>
    </div>
    <div class="text-box">
        <p class="bold">Balance: </p><p> ${account.balance}</p>
    </div>
    <button class="btn" onClick="startTransaction('Deposit', '${account.number}', '${account.balance}')">Deposit</button>
    <button class="btn" onClick="startTransaction('Withdraw', '${account.number}', '${account.balance}')">Withdraw</button>
    <div class="popup-background hide" id="transaction-popup-${account.number}">
        <form class="popup-form transaction-form" id="transaction-form-${account.number}">
        <h3 id="heading-${account.number}"></h3>
        <div class="input-box">
        <label class="label" for="transaction-input-${account.number}">Amount</label>
        <input class="input" id="transaction-input-${account.number}" type="number"/>
        </div>
        <p id=error-msg-${account.number}></p>
        <button class="btn" onClick="toggleTransactionPopup('${account.number}')">Send</button>
        <a href="http://localhost:3000" class="btn" >Cancel</a>
        </form>
    </div>
    <button class="btn" onClick="deleteAccount('${account.number}')">Delete account</button>
</li>`


