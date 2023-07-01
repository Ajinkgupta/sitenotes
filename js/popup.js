chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    const websiteUrl = await getActiveTabURL();
    const websiteName = extractWebsiteName(websiteUrl);
  
    document.getElementById('website-url').textContent = websiteUrl;
  
    const form = document.getElementById('note-form');
    form.addEventListener('submit', saveNote);
  
    displayNotesForWebsite(websiteName);
  });
  
  async function getActiveTabURL() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          resolve(tabs[0].url);
        } else {
          reject(new Error('Unable to retrieve the active tab URL.'));
        }
      });
    });
  }
  
  function extractWebsiteName(websiteUrl) {
    const url = new URL(websiteUrl);
    return url.hostname;
  }
  
  async function saveNote(event) {
    event.preventDefault();
    const noteContent = document.getElementById('note-content').value;
    const websiteUrl = await getActiveTabURL();
    const websiteName = extractWebsiteName(websiteUrl);
  
    if (noteContent) {
      const note = {
        id: generateUniqueId(),
        websiteUrl: websiteUrl,
        websiteName: websiteName,
        content: noteContent,
        timestamp: new Date().toLocaleString()
      };
  
       const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
      existingNotes.push(note);
  
      localStorage.setItem('notes', JSON.stringify(existingNotes));
      document.getElementById('note-content').value = '';
  
      displayNotesForWebsite(websiteName);  
    }
  }
  
  function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  
  function displayNotesForWebsite(websiteName) {
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';
  
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  
    const filteredNotes = savedNotes.filter(note => note.websiteName === websiteName);
  
    if (filteredNotes.length === 0) {
      const noNotesMessage = document.createElement('p');
      noNotesMessage.textContent = 'No notes found for this website.';
      noteList.appendChild(noNotesMessage);
    } else {
      filteredNotes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.textContent = `Note: ${note.content} | Timestamp: ${note.timestamp}`;
  
        noteList.appendChild(listItem);
      });
    }
  }
  