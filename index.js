// DOM Elements
const guestForm = document.getElementById('add-guest');
const guestNameInput = document.getElementById('guest-name');
const guestCategorySelect = document.getElementById('guest-category');
const guestList = document.getElementById('guest-items');
const guestCountEl = document.getElementById('guest-count');
const alertBox = document.getElementById('alert-box');

// Guest data
let guests = [];
const MAX_GUESTS = 10;

// Format date function
function formatDate(date) {
    return new Date(date).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
    });
}

// Add guest function
function addGuest(event) {
    event.preventDefault();
    
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;
    
    if (!name) {
        alert('Please enter a guest name');
        return;
    }
    
    if (guests.length >= MAX_GUESTS) {
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
        return;
    }
    
    const newGuest = {
        id: Date.now(),
        name,
        category,
        isAttending: true,
        addedAt: new Date()
    };
    
    guests.push(newGuest);
    renderGuestList();
    
    // Reset form
    guestNameInput.value = '';
    guestNameInput.focus();
}

// Remove guest function
function removeGuest(id) {
    guests = guests.filter(guest => guest.id !== id);
    renderGuestList();
}

// Toggle RSVP status
function toggleRSVP(id) {
    guests = guests.map(guest => {
        if (guest.id === id) {
            return { ...guest, isAttending: !guest.isAttending };
        }
        return guest;
    });
    renderGuestList();
}

// Edit guest name
function editGuest(id, newName) {
    if (!newName.trim()) return;
    
    guests = guests.map(guest => {
        if (guest.id === id) {
            return { ...guest, name: newName.trim() };
        }
        return guest;
    });
    renderGuestList();
}

// Render guest list
function renderGuestList() {
    // Update guest count
    guestCountEl.textContent = guests.length;
    
    if (guests.length === 0) {
        guestList.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-user-friends"></i>
                <h3>No guests yet</h3>
                <p>Add your first guest to get started</p>
            </li>
        `;
        return;
    }
    
    guestList.innerHTML = guests.map(guest => {
        const categoryLabel = guest.category.charAt(0).toUpperCase() + guest.category.slice(1);
        
        return `
            <li class="guest-item" data-id="${guest.id}">
                <div class="guest-info">
                    <div class="guest-name">
                        ${guest.name}
                        <span class="category ${guest.category}">${categoryLabel}</span>
                    </div>
                    <div class="guest-details">
                        <span class="timestamp">Added: ${formatDate(guest.addedAt)}</span>
                    </div>
                </div>
                <div class="rsvp-status ${guest.isAttending ? 'attending' : 'not-attending'}" 
                     onclick="toggleRSVP(${guest.id})">
                    ${guest.isAttending ? 'Attending' : 'Not Attending'}
                </div>
                <div class="guest-actions">
                    <div class="action-btn edit-btn" onclick="openEditForm(${guest.id})">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-btn delete-btn" onclick="removeGuest(${guest.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </li>
        `;
    }).join('');
}

// Open edit form
function openEditForm(id) {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;
    
    const guestItem = document.querySelector(`.guest-item[data-id="${id}"]`);
    guestItem.innerHTML = `
        <div class="edit-form">
            <h3>Edit Guest</h3>
            <input type="text" id="edit-name" value="${guest.name}" placeholder="Guest name">
            <div class="edit-buttons">
                <button class="save-btn" onclick="saveEdit(${id})">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="cancel-btn" onclick="renderGuestList()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('edit-name').focus();
}

// Save edited name
function saveEdit(id) {
    const newName = document.getElementById('edit-name').value;
    editGuest(id, newName);
}

// Event listeners
guestForm.addEventListener('click', addGuest);
guestNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addGuest(e);
    }
});

// Initialize
renderGuestList();

// Expose functions to global scope for inline event handlers
window.removeGuest = removeGuest;
window.toggleRSVP = toggleRSVP;
window.openEditForm = openEditForm;
window.saveEdit = saveEdit;
window.renderGuestList = renderGuestList;