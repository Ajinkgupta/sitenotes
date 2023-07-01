document.addEventListener('DOMContentLoaded', () => {
  const noteList = document.getElementById('note-list');
  const websiteList = document.getElementById('website-list');
  const sortOptions = document.getElementById('sort-options');
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
 
  const websiteNames = Array.from(new Set(savedNotes.map(note => note.websiteName)));
 
  websiteNames.forEach(websiteName => {
    const websiteDiv = document.createElement('div');
    websiteDiv.textContent = websiteName;
    websiteDiv.addEventListener('click', () => filterNotesByWebsite(websiteName));
    websiteList.appendChild(websiteDiv);
  }); 

  const sortSelect = document.createElement('select');
  sortSelect.id = 'sort-order';
  sortSelect.addEventListener('change', filterAndSortNotes);

  const defaultOption = document.createElement('option');
  defaultOption.value = 'default';
  defaultOption.textContent = 'Default Sorting';
  sortSelect.appendChild(defaultOption);

  const ascendingOption = document.createElement('option');
  ascendingOption.value = 'ascending';
  ascendingOption.textContent = 'Ascending Order';
  sortSelect.appendChild(ascendingOption);

  const descendingOption = document.createElement('option');
  descendingOption.value = 'descending';
  descendingOption.textContent = 'Descending Order';
  sortSelect.appendChild(descendingOption);

  sortOptions.appendChild(sortSelect);

  filterAndSortNotes();

  function displayNotes(notes) {
    noteList.innerHTML = '';

    notes.forEach(note => {
      const listItem = document.createElement('card'); 

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '❌';
      deleteButton.addEventListener('click', () => deleteNote(note.id));

      listItem.innerHTML = `<div class="column" style="overflow:hidden;"><h3><a href="${note.websiteUrl}" target="_blank">🌐 ${note.websiteUrl}</a></h3>
                            <div class="note-content">${note.content}</div>
                            <div class="timestamp" style="padding:2px; margin-top:5px;">Time : ${note.timestamp}</div></div> `;

      listItem.appendChild(deleteButton);
      

      listItem.classList.add('list-item');

      noteList.appendChild(listItem);
    });
  }

  function filterAndSortNotes() {
    const selectedWebsite = websiteList.getAttribute('data-selected-website');
    const sortOrder = sortSelect.value;

    let filteredNotes;
    if (selectedWebsite === 'all') {
      filteredNotes = savedNotes;
    } else {
      filteredNotes = savedNotes.filter(note => note.websiteName === selectedWebsite);
    }
 
    if (sortOrder === 'ascending') {
      filteredNotes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortOrder === 'descending') {
      filteredNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    displayNotes(filteredNotes);
  }

  function filterNotesByWebsite(websiteName) {
    websiteList.setAttribute('data-selected-website', websiteName);
    filterAndSortNotes();
  }

  function deleteNote(noteId) { 
    const noteIndex = savedNotes.findIndex(note => note.id === noteId);

    if (noteIndex !== -1) { 
      savedNotes.splice(noteIndex, 1);
 
      localStorage.setItem('notes', JSON.stringify(savedNotes));
 
      filterAndSortNotes();
    }
  }
});
