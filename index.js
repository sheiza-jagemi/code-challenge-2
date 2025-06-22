document.addEventListener('DOMContentLoaded', function() {
  const guestForm = document.getElementById('guest-form');
  const guestNameInput = document.getElementById('guest-name');
  const guestCategorySelect = document.getElementById('guest-category');
  const guestList = document.getElementById('guests');
  const guestCountSpan = document.getElementById('guest-count');
  const progressBar = document.getElementById('progress');
  
  let guests = [];
  const MAX_GUESTS = 10;

  
  const storedGuests = localStorage.getItem('guests');
  if (storedGuests) {
    guests = JSON.parse(storedGuests);
  }

  guestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = guestNameInput.value.trim();
    const category = guestCategorySelect.value;
    
    if (!name) {
      alert('Please enter a guest name');
      return;
    }
    
    if (guests.length >= MAX_GUESTS) {
      alert(`Sorry, the guest list is limited to ${MAX_GUESTS} people.`);
      return;
    }
    
    const newGuest = {
      id: Date.now(),
      name,
      category,
      attending: true,
      timestamp: new Date()
    };
    
    guests.push(newGuest);
    saveGuests();
    renderGuestList();
    
    guestNameInput.value = '';
    guestNameInput.focus();
  });
  
  function saveGuests() {
    localStorage.setItem('guests', JSON.stringify(guests));
  }
  
  function renderGuestList() {
    guestList.innerHTML = '';
    guestCountSpan.textContent = guests.length;
    progressBar.style.width = `${(guests.length / MAX_GUESTS) * 100}%`;
    
    if (guests.length === 0) {
      guestList.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" fill="#3498db">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          <h3>No guests added yet</h3>
          <p>Add your first guest to start managing your event</p>
        </div>
      `;
      return;
    }
    
    guests.forEach(guest => {
      const li = document.createElement('li');
      li.className = guest.category;
      if (!guest.attending) {
        li.classList.add('not-attending');
      } else {
        li.classList.add('attending');
      }
      
      const guestInfo = document.createElement('div');
      guestInfo.className = 'guest-info';
      
      const nameElement = document.createElement('div');
      nameElement.className = 'guest-name';
      nameElement.textContent = guest.name;
      
      const categoryElement = document.createElement('div');
      categoryElement.className = 'guest-category';
      categoryElement.textContent = guest.category.charAt(0).toUpperCase() + guest.category.slice(1);
      
      const timeElement = document.createElement('div');
      timeElement.className = 'guest-time';
      timeElement.textContent = `Added: ${guest.timestamp.toLocaleString()}`;
      
      guestInfo.appendChild(nameElement);
      guestInfo.appendChild(categoryElement);
      guestInfo.appendChild(timeElement);
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'guest-actions';
      
      const rsvpButton = document.createElement('button');
      rsvpButton.className = 'rsvp-toggle';
      rsvpButton.textContent = guest.attending ? 'Attending' : 'Not Attending';
      rsvpButton.addEventListener('click', () => {
        guest.attending = !guest.attending;
        saveGuests();
        renderGuestList();
      });
      
      const editButton = document.createElement('button');
      editButton.className = 'edit-btn';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        const newName = prompt('Edit guest name:', guest.name);
        if (newName && newName.trim() !== '') {
          guest.name = newName.trim();
          saveGuests();
          renderGuestList();
        }
      });
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        guests = guests.filter(g => g.id !== guest.id);
        saveGuests();
        renderGuestList();
      });
      
      actionsDiv.appendChild(rsvpButton);
      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);
      
      li.appendChild(guestInfo);
      li.appendChild(actionsDiv);
      
      guestList.appendChild(li);
    });
  }
  
  // Initial render
  renderGuestList();
});