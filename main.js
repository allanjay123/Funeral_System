// Database Simulation using LocalStorage
const DB_NAME = 'funeral_db_v1';

// Step 1-4: Temporary saving
function saveStep(fields, nextUrl) {
    let currentData = JSON.parse(sessionStorage.getItem('temp_reg')) || {};
    fields.forEach(f => currentData[f] = document.getElementById(f).value);
    sessionStorage.setItem('temp_reg', JSON.stringify(currentData));
    window.location.href = nextUrl;
}

// CREATE: Final Submit
function finalSubmit() {
    let finalData = JSON.parse(sessionStorage.getItem('temp_reg')) || {};
    const lastFields = ['deceasedName', 'location', 'contact', 'payment'];
    lastFields.forEach(f => finalData[f] = document.getElementById(f).value);
    
    finalData.id = Date.now(); // Unique ID
    finalData.status = "Pending";

    let db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    db.push(finalData);
    localStorage.setItem(DB_NAME, JSON.stringify(db));
    
    sessionStorage.removeItem('temp_reg');
    alert("Successfully Registered!");
    window.location.href = 'index.html';
}

// READ: Load for Admin
function loadAdminOrders() {
    const container = document.getElementById('orderList');
    const db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    if(db.length === 0) return container.innerHTML = "<h3>Walang record.</h3>";

    container.innerHTML = db.map(o => `
        <div class="order-card" id="card-${o.id}">
            <div id="view-${o.id}">
                <h3>${o.deceasedName}</h3>
                <p><b>Coffin:</b> ${o.coffinType} (${o.coffinColor}) | <b>Hearse:</b> ${o.karoType}</p>
                <p><b>Contact:</b> ${o.contact} | <b>Location:</b> ${o.location}</p>
                <button onclick="toggleEdit(${o.id})" class="btn-edit">Edit</button>
                <button onclick="deleteOrder(${o.id})" class="btn-delete">Delete</button>
            </div>
            <div id="edit-${o.id}" style="display:none">
                <input type="text" id="inp-name-${o.id}" value="${o.deceasedName}">
                <input type="text" id="inp-contact-${o.id}" value="${o.contact}">
                <button onclick="updateOrder(${o.id})" class="btn-save">Save changes</button>
                <button onclick="toggleEdit(${o.id})">Cancel</button>
            </div>
        </div>
    `).join('');
}

// UPDATE
function toggleEdit(id) {
    const v = document.getElementById(`view-${id}`);
    const e = document.getElementById(`edit-${id}`);
    v.style.display = v.style.display === 'none' ? 'block' : 'none';
    e.style.display = e.style.display === 'none' ? 'block' : 'none';
}

function updateOrder(id) {
    let db = JSON.parse(localStorage.getItem(DB_NAME));
    const idx = db.findIndex(item => item.id === id);
    db[idx].deceasedName = document.getElementById(`inp-name-${id}`).value;
    db[idx].contact = document.getElementById(`inp-contact-${id}`).value;
    localStorage.setItem(DB_NAME, JSON.stringify(db));
    loadAdminOrders();
}

// DELETE
function deleteOrder(id) {
    if(!confirm("Are you sure?")) return;
    let db = JSON.parse(localStorage.getItem(DB_NAME));
    db = db.filter(item => item.id !== id);
    localStorage.setItem(DB_NAME, JSON.stringify(db));
    loadAdminOrders();
}

function adminLogin() {
    const pass = prompt("Enter Admin Password:");
    if(pass === "admin123") {
        localStorage.setItem('is_admin', 'true');
        window.location.href = 'admin.html';
    }
}
  
