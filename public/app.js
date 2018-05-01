// Remember: no copy pasting!

// Controlled input. This is similar to what you did in react.
function addItemInputChanged() {
    setState({ addItemInput: event.target.value });
}

// Controlled input. This is similar to what you did in react.
function nameInputChanged() {
    setState({ listNameInput: event.target.value });
}


// Don't try to understand the body of this function. You just 
// We're going to try and stick with React's way of doing things
let state = {
    items: [],
    addItemInput: "", // The contents of the add item input box
    listNameInput: "", // The contents of the input box related to changing the list
    listName: ""
}

// Calling rerender changes the UI to reflect what's in the state

function rerender() {
    let inputElement = document.getElementById('itemInput');
    inputElement.value = state.addItemInput; // you can ignore this line

    let listNameInputChanged = document.getElementById('listNameInputChanged');
    listNameInputChanged.value = state.listNameInput; // you can ignore this line

    let listNameElement = document.getElementById('listName')
    listNameElement.innerText = state.listName;

    let d = document.getElementById("items");
    d.innerHTML = '';
    state.items.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        d.appendChild(li)
    })
}

// Our good friend setState paying us a visit from ReactVille
function setState(newState) {
    var keys_ = Object.keys(newState)
    if (keys_.indexOf('items') !== -1) state.items = newState.items;
    if (keys_.indexOf('addItemInput') !== -1) state.addItemInput = newState.addItemInput;
    if (keys_.indexOf('listNameInput') !== -1) state.listNameInput = newState.listNameInput;
    if (keys_.indexOf('listName') !== -1) state.listName = newState.listName;
    rerender();
}

function clearList() {
    let cb = () => {
        setState({ items: [] })
    }
    fetch('/clearItems', {
        method: 'GET'
    })
        .then(response => response.text())
        .then(cb)
}

function reverse() {
    let cb = () => {
        setState({ items: state.items.reverse() })
    }
    fetch('/reverse', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(cb)
}

function sendItemToServer(it, ln) {
    // This function is so short it could be inlined
    let cb = (itemsFromServer) => {
        let parsedItems = JSON.parse(itemsFromServer)
        setState({ items: parsedItems })
    }
    fetch('/addItem', {
        body: JSON.stringify({ item: it, listName: ln }),
        method: 'POST'
    })
        .then(response => response.text())
        .then(cb)
}

// When you submit the form, it sends the item to the server
function addItemSubmit() {
    event.preventDefault();
    sendItemToServer(state.addItemInput, state.listName);
    setState({ addItemInput: "" });
}

function listNameSubmit() {
    event.preventDefault();
    //populateItems(state.listName);
    //setState({ listName: state.listNameInput, listNameInput: "" });
    fetch("/changeListName", { method: "POST", body: state.listNameInput })
        .then(getListName())
    console.log(state)
}

// When the client starts he needs to populate the list of items
function populateItems(listName) {
    let cb = itemsString => {
        let itemsParsed = JSON.parse(itemsString)
        setState({ items: itemsParsed })
    }
    let body = JSON.stringify({ listName: state.listName });

    fetch('/items', {
        body: body,
        method: 'POST'
    })
        .then(response => response.text())
        .then(cb)
}

function getListName() {
    fetch("/getListName", { method: "GET" })
        .then(e => e.text())
        .then(e => setState({ listName: e })) //the new list name will be populated to listname: new name
        .then(e => populateItems(state.listName))
}

// We define a function and then call it right away. I did this to give the file a nice structure.
getListName() // asks for list from the server
// populateItems(state.listName);