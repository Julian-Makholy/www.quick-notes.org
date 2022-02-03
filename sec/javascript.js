import Darkmode from 'darkmode-js';
const
 noteContainer = document.querySelector('.note-container'),
 modalContainer = document.querySelector('.modal-container'),
 form = document.querySelector('form'),
 titleInput = document.querySelector('#title'),
 noteInput = document.querySelector('#htmlnote'),
 searchBar = document.getElementById('searchBar');
// goals:-
// using btoa to prevent server side scripting? || group notes || sort notes drop down list || the hardest thing: online backup || maybe put the logo in somewhere

// a searchbar + filter function
 searchBar.addEventListener('keyup', e => { 
 var search= e.target.value;
 loopNotes(search);
});
  function loopNotes(searchinput){ 
   const notes = getNotes();
   notes.forEach((note, index) => 
   {
    const        // another way to make the program more compact, no need for 4 consts just renember the ','
      title = (note.title || '').trim().toLowerCase(),
      query = (searchinput || '').trim().toLowerCase(),
      match = title.indexOf(query) != -1,
      el = document.getElementById(note.id);
      console.log(el);
      el.style.display = match ? 'block' : 'none'; // very cool thing '?' if true apply 'block' display style || : divide ||  if false apply 'none'
});
}



// Class: for creating a  new  note
class Note {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = Math.random();
  }
}

tinymce.init({   // tinymce custom text editor
  selector: 'textarea',
  width: "100%",
	height: 300,
  resize: 'both',
	statubar: true,
  branding: false,
	plugins: [
		"advlist autolink image lists charmap print hr anchor pagebreak",
		"searchreplace wordcount visualblocks visualchars fullscreen insertdatetime media nonbreaking",
		"save table directionality emoticons paste"
	  ],
toolbar: "insertfile undo redo  | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | print media fullpage image | forecolor backcolor emoticons",
});

// Retreive notes from local storage
function getNotes(){
  let notes;
  if(localStorage.getItem('noteApp.notes') === null){
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('noteApp.notes'));
  }
  return notes;
}
// Function: Add a note to local storage
function addNotesToLocalStorage(note){
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem('noteApp.notes', JSON.stringify(notes));
}
// Function: remove a note  from local storage
function removeNote(id){
  const notes = getNotes();
  notes.forEach((note, index) => {
    if (note.id === id){
      notes.splice(index, 1);
    }
    localStorage.setItem('noteApp.notes', JSON.stringify(notes));
  })
}

//  Create new note in UI
function addNoteToList(note) { 
  const newUINote = document.createElement('div');
  newUINote.setAttribute("id", note.id); //for UI modification the other note.id is for the remove note func (id for Displayed notes and id for actual localstorage notes)
  newUINote.classList.add('note'); // i wish there was a way to just have 1 id but when i enter a div like in the buttons I cant access the top id
  newUINote.innerHTML = ` 
    <span hidden class="hidden" id="theiclass">${note.id}</span> 
    <h2 class="note__title">${note.title}</h2>
    <div class="note__body" id="notebody2">${note.body}</div>
    <div class="note__btns">
      <button class="note__btn note__view"">View Detail</button>
      <button class="note__btn note__edit">Edit Note</button>
      <button class="note__btn note__delete">Delete Note</button>
    </div>
  `; 
  noteContainer.appendChild(newUINote);
}
// Function: Show notes in UI
function displayNotes(){
  const notes = getNotes();
  notes.forEach(note => {
    addNoteToList(note);
  })
}

// Function: Show alert message
function showAlertMessage(message, alertClass){
  const alertDiv = document.createElement('div');
  alertDiv.className = `message ${alertClass}`;
  alertDiv.appendChild(document.createTextNode(message));
  form.insertAdjacentElement('beforebegin', alertDiv);
  titleInput.focus();
  setTimeout(() => alertDiv.remove(), 2000)
}

// Function: View note in modal
function activateNoteModal(title, body){
  const modalTitle = document.querySelector('.modal__title');
  const modalBody = document.querySelector('.modal__body');
  modalTitle.textContent = title;
  modalBody.innerHTML = body; 
  modalContainer.classList.add('active');
}
// Event: Close Modal
  const modalBtn = document.querySelector('.modal__btn').addEventListener('click', () => {
  modalContainer.classList.remove('active');
})

// Event: Note Buttons   ( view edit delete )
noteContainer.addEventListener('click', (e) => {

  if(e.target.classList.contains('note__view')){
    const currentNote = e.target.closest('.note');
    const currentTitle = currentNote.querySelector('.note__title').textContent;
    const note_body = currentNote.querySelector(".note__body");
    activateNoteModal(currentTitle, note_body.innerHTML);
  }
  
  if(e.target.classList.contains('note__edit')){
    const currentNote = e.target.closest('.note');
    const currentTitle = currentNote.querySelector('.note__title').textContent;
    titleInput.value=currentTitle;
    const note_body = currentNote.querySelector(".note__body");
    tinymce.activeEditor.setContent(note_body.innerHTML);
  }

  if(e.target.classList.contains('note__delete')){
    const currentNote = e.target.closest('.note');
    showAlertMessage('Your note was permanently deleted', 'remove-message');
    currentNote.remove();
    const id = currentNote.querySelector('span').textContent;  
    console.log(id);
    removeNote(Number(id))
  }
})

// Display Notes button
document.addEventListener('DOMContentLoaded', displayNotes)

// Submit button
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // make sure note isn't empty
  if(titleInput.value.length > 0 && noteInput.value.length > 0){ 
    const newNote = new Note(titleInput.value, noteInput.value);
    addNoteToList(newNote);
    addNotesToLocalStorage(newNote);
    titleInput.value = '';
    noteInput.value = '';
    showAlertMessage('Note successfully added', 'success-message');
    titleInput.focus();
  } else {
    showAlertMessage('Please add both a title and a note', 'alert-message');
  }
});

// dark mode
const options = {
  bottom: '850px', // default: '32px'
  right: '34px', // default: '32px'
  left: 'unset', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#111030',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}
 
const darkmode = new Darkmode(options);
darkmode.showWidget();
