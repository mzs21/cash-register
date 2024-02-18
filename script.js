// DOM elements

let cashInput = document.getElementById('cash'); // Get cash input element
let changeDue = document.getElementById('change-due'); // Get change due element
let purchaseBtn = document.getElementById('purchase-btn'); // Get purchase button element
let totalValue = document.getElementById('total'); // Get total value element



// Initial price and cash in drawer

let price = 19.5; // Set initial price

totalValue.innerText = `Total: ${price}`; // Display total price

let cid = [ // Define cash in drawer array
    ["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];

const CURRENCY_UNIT_AMOUNT = { // Define currency unit values
    "PENNY": .01,
    "NICKEL": .05,
    "DIME": .1,
    "QUARTER": .25,
    "ONE": 1.00,
    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100.00
};


// Event listener for purchase button
purchaseBtn.addEventListener('click', () => {
    // Get cash input value, calculate change
    let cash = parseFloat(cashInput.value);
    let changedMoney = cash - price;

    // Check if cash is enough
    if (cash < price) {
        alert('Customer does not have enough money to purchase the item');
        return;
    }

    // Check if exact cash provided
    if (cash === price) {
        changeDue.innerText = 'No change due - customer paid with exact cash';
        return;
    }

    // Check if enough cash in drawer
    let totalCID = cid.reduce((acc, val) => acc + val[1], 0).toFixed(2);
    if (changedMoney > totalCID) {
        changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    // Check if closed drawer possible
    if (cash.toFixed(2) === price) {
        changeDue.innerText = `Status: CLOSED ${cid}`;
        return;
    }

    // Reverse cid array for greedy algorithm
    cid.reverse();

    // Initialize empty change array
    const changeArr = [];

    // Iterate through cid array
    for (let [name, amount] of cid) {
        let temp = [name, 0]; // Create temporary array for current currency unit
        while (changedMoney >= CURRENCY_UNIT_AMOUNT[name] && amount > 0) {
            temp[1] += CURRENCY_UNIT_AMOUNT[name]; // Add unit amount to change
            amount -= CURRENCY_UNIT_AMOUNT[name]; // Decrease available amount
            changedMoney -= CURRENCY_UNIT_AMOUNT[name]; // Decrease remaining change
            changedMoney = changedMoney.toFixed(2); // Fix decimal places
        }
        if (temp[1] > 0) changeArr.push(temp); // Add non-zero change units to final array
    }

    // Check if insufficient funds after iterating
    if (changedMoney > 0) {
        changeDue.innerText = `Status: INSUFFICIENT_FUNDS`;
        return;
    }

    // Display change depending on total funds
    if (totalCID <= .50) {
        changeDue.innerText = `Status: CLOSED ${changeArr.map(item => `${item[0]}: $${item[1].toFixed(2)}`).join(', ')}`;
    } else {
        changeDue.innerText = `Status: OPEN ${changeArr.map(item => `${item[0]}: $${item[1].toFixed(2)}`).join(', ')}`;
    }
});
