const getActiveUser = async () => {
    const response = await fetch('/api/user');
    let data = await response.json();
    return data.user;        
}

const addAccount = async (account) => {
    const user = await getActiveUser();
    await fetch(`/api/user/${user._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: account
    })
    location.reload();
}


const updateAccount = async (accountNumber, balance) => {
    console.log(balance)
    const user = await getActiveUser();
    console.log(user);
    await fetch(`/api/user/${user._id}/transaction`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accounts: {
                number: accountNumber,
                balance
            }
        })
    })
    location.reload();
}

const deleteAccount = async (accountNumber) => {
    if(confirm('Are you sure you want to delete this account?')){
        const user = await getActiveUser();
        await fetch(`/api/user/${user._id}/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accounts: {
                    number: accountNumber
                }
            })
        })
        location.reload();
    
    }
    else return
}

const logOut = async () => {
    await fetch('/api/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
});
location.reload();
}

const register = async (user) => {
    await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: user
    })
}

const login = async (user) => {
    const res = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: user 
})
const data = await res.json();
return data;
}