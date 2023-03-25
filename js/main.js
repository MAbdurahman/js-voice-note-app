/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(5000, function () {});
});

/*=============================================
         js-voice-note-app scripts
================================================*/
$(function () {
  /**
   * Test whether or not the browser has support for SpeechRecognition
   */
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
  } catch (e) {
    console.error(e);
    swal('No Browser Support', 'Try again in a browser with WebSpeech Recognition', 'error');
    $('.app').hide();
    return;
    
  }
  
  //**************** variables ****************//
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  const note_textarea = document.getElementById('note-textarea');
  const notes_list = document.getElementById('notes-list');
  
  const start_button = document.getElementById('start-record-btn');
  const stop_button = document.getElementById('stop-record-btn');
  const save_button = document.getElementById('save-record-btn');
  
  let is_recording = false;
  let note_content = '';
  
  localSavedNotesList = getInitialNoteList();
  
  /*let notes = localStorage.length;
  console.log(notes);
  renderNotes(notes);*/
  
  /*=============================================
        SpeechRecognition - recognition
================================================*/
  /**
   * If recognition.continuous = false, the recording will stop after a few seconds of
   * silence.  When it is true, the silence period can be longer (about 15 seconds).  Thus,
   * allowing SpeechRecognition to continue recording, even when the speecher pauses.
   */
  recognition.continuous = true;
  
  /**
   * This function is called every time the Speech API captures a line
   */
  recognition.onresult = function (e) {
    
    /**
     * The event is a SpeechRecognitionEvent object.  It holds all the line captured. Therefore,
     * the current one will suffice.
     */
    let current = e.resultIndex;
    
    // Get a transcript of what was said.
    let transcript = e.results[current][0].transcript;
    
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobile_repeat_bug = (current == 1 && transcript == e.results[0][0].transcript);
    
    if (!mobile_repeat_bug) {
      note_content += transcript;
      note_textarea.innerHTML = ' ' + note_content;
      note_content = '';
    }
    
  }; //end of onresult function
  
  recognition.onstart = function () {
    swal('Speech Recognition Activated', 'Begin speaking into the microphone', 'success');
    
  }; //end of onstart function
  
  recognition.onspeechend = function () {
    if (is_recording === true) {
      swal('Speech Recognition Terminated', 'Terminates, when silence for 15 seconds.', 'info');
    }
    
  }; //end of onspeechend function
  
  recognition.onerror = function (e) {
    if (e.error == 'no-speech') {
      swal('Terminated', 'No speech detected. Try again!', 'error');
      return;
    }
    ;
    
  }; //end of onerror function
  
  /*=============================================
          functions
================================================*/
  
  function deleteNoteItem (id) {
    console.log('deleteNote');
    
  }; //end of deleteNote function
  
  function getAllNotes () {
    /*let notes = [];
    let key;
    for (let i = 0; i < notes.length; i++) {
      key = localStorage.key(i);
      if (key.substring(0, 5) === 'note-') {
        notes.push({
          date: key.replace('note-', ''),
          content: localStorage.getItem(localStorage.key(i))
        });
      }
    }
    return notes;*/
    
  }; //end of getAllNotes function
  
  function readOutLoudNote (message) {
    console.log('readOutLoudNote');
    
  }; //end of readOutLoudNote function
  
  function renderNotes (notes) {
    console.log('renderNotes called');
/*    console.log(notes);
    console.log(notes.length);
    let html = '';
    if (notes.length) {
      notes.forEach(function (note) {
        html += `<li class="note">
                    <p class="note-heading">
                        <span class="note-date">${note.date}</span>
                        <section class="note-buttons-container">
                            <a href="#" class="note-read">
                                <i class='fal fa-book-reader fa-8x' style='color:#4682b4'></i>
                            </a>
                            <a href="#" class="note-delete">
                                <i class='fal fa-trash-alt fa-9x' style='color:#4682b4'></i>
                            </a>
                        </section>
                    </p>
                    <section class="note-content-container">
                        <p class="note-content">${note.content}</p>
                    </section>
                </li>`;
        
      });
    } else {
      html = `<li class="saved-notes-item">
                <!--<p class="no-notes">You do not have any saved notes.</p>-->
              </li>`;
    }
    $('#notes-list').append(html);
    */
    
  }; //end of renderNotes function
  
  function saveNote (id, date, content) {
/*    console.log('saveNote');
    console.log('saveNote - ', content);
    localStorage.setItem('note-' + date, content);*/
    
  }; //end of saveNote function
  
  
  
  /**
   * @description -
   * @param id
   * @param date
   * @param content
   */
  function addToLocalStorage (id, date, content) {
    const noteItem = {
      id,
      date,
      content
    };
    let localNoteListArr = getLocalStorage();
    localNoteListArr.push(noteItem);
    localStorage.setItem('savedNoteList', JSON.stringify(localNoteListArr));
    
  }; //end of addToLocalStorage function
  
  /**
   * @description -
   * @param id
   * @param date
   * @param content
   */
  function createNoteItem (id, date, content) {
    let attr = document.createAttribute('data-id');
    attr.value = id;
    
    const template = document.querySelector('#template');
    const clone = document.importNode(template.content, true);
    
    clone.querySelector('.saved-notes-item').setAttributeNode(attr);
    clone.querySelector('.saved-notes-date').textContent = date;
    clone.querySelector('.note-read').addEventListener('click', readOutLoudNote);
    clone.querySelector('.note-delete').addEventListener('click', deleteNoteItem);
    clone.querySelector('.saved-notes-content').textContent = content;
    
    notes_list.appendChild(clone);
  
  }; //end of createNoteItem function
  
  /**
   * @description -
   */
  function displaySavedNoteItems () {
    localNoteListArr = getLocalStorage();
    if (localNoteListArr.length > 0) {
/*      localNoteListArr.forEach(function () {
        createNoteItem(noteItem.id, noteItem.date, noteItem.content);
      });*/
      for (noteItem in localNoteListArr) {
        createNoteItem(noteItem.id, noteItem.date, noteItem.content);
      }
    }
  }; //end of displayNoteItems functions
  
  /**
   * @description -
   * @returns {*[]|any}
   */
  function getInitialNoteList () {
    //**************** get the todoList ****************//
    const localNoteList = localStorage.getItem('savedNoteList');
    
    //*** parse localNoteList to json format if not empty ***//
    if (localNoteList) {
      return JSON.parse(localNoteList);
    }
    
    //**************** localStorage is empty, set it to 'noteList' ****************//
    localStorage.setItem('savedNoteList', []);
    return [];
    
  }; //end of getInitialNoteList function
  
  /**
   * @description -
   * @returns {any|*[]}
   */
  function getLocalStorage () {
    return localStorage.getItem('savedNoteList') ? JSON.parse(localStorage.getItem('savedNoteList')) : [];
    
  }; //end of getLocalStorage function
  
  /**
   * @description -
   * @param id
   */
  function removeFromLocalStorage (id) {
    let localNoteListArr = getLocalStorage();
    localNoteListArr = localNoteListArr.filter(function (note) {
      if (noteItem.id !== id) {
        return noteItem;
      }
    });
    localStorage.setItem('savedNoteList', JSON.stringify(localNoteListArr));
    
  }; //end of removeFromLocalStorage function
  
  function saveNoteItem () {
    if (is_recording === false) {
      if (note_textarea.innerHTML.length <= 0) {
        swal('Invalid NoteItem', 'Textarea cannot be empty!', 'error');
        
      } else {
        note_content = note_textarea.innerHTML.trim();
        
        const date_time = new Date();
        let id = date_time.getTime().toString();
        let date = date_time.toString().slice(0, -29);
        
  
        console.log(date);
        console.log(note_content);
        
        createNoteItem(id, date, note_content);
        addToLocalStorage(id, date, note_content);
        setToDefaultSettings();
        swal('Success', 'Note Successfully Saved', 'success');
        displaySavedNoteItems();
      }
    }
  }; //end of saveNoteItem function
  
  /**
   * @description -
   */
  function setToDefaultSettings() {
    setTimeout(() => {
      note_textarea.innerHTML = '';
      note_content = '';
      is_recording = false;
      
    }, 250);
    
  }; //end of setToDefaultSettings function

  /*=============================================
        addEventListeners
================================================*/
  window.addEventListener('DOMContentLoaded', getInitialNoteList);
  start_button.addEventListener('click', function (event) {
    
    if (is_recording === false) {
      if (note_textarea.innerHTML.length > 0) {
        note_textarea.innerHTML = '';
      }
      recognition.start();
      is_recording = true;
      
    } else if (is_recording === true) {
      swal('Speech Recognition Error', 'Speech Recognition has already started! Stopping...', 'error');
      recognition.stop();
      is_recording = false;
      return;
    }
    
  });
  
  stop_button.addEventListener('click', function (event) {
    
    if (is_recording === false) {
      swal('Speech Recognition Information', 'Speech Recognition is not recording', 'info');
      
    } else {
      recognition.stop();
      is_recording = false;
      swal('Speech Recognition Stopped', 'Speech Recognition has safely stopped', 'info');
    }
    
  });
  
/*  save_button.addEventListener('click', function (event) {
    console.log(event.target, 'clicked');
    if (is_recording === false) {
      if (note_textarea.innerHTML.length <= 0) {
        swal('Invalid Note', 'Textarea cannot be empty', 'error');
        
      } else {
        /!**
         * Save the textarea content to LocalStorage - the key is the dateTime with seconds,
         * and the value is the text content of the textarea
         *!/
        note_content = note_textarea.innerHTML;
        
        /!*saveNote(new Date().getTime().toString(), note_content);*!/
        /!*saveNote(new Date().toString().slice(0, -29), note_content);*!/
        /!*saveNote(new Date().toString().slice(0, -33), note_content);*!/
        
        
        // render the notes, reset the variables, and update the user interface
        renderNotes(getAllNotes());
        note_content = '';
        note_textarea.innerHTML = '';
        swal('Success', 'Note Successfully Saved', 'success');
        
      }
    }
  });*/
  
  save_button.addEventListener('click', saveNoteItem);
  
  note_textarea.addEventListener('input', function (event) {
    console.log(this.value, 'input');
  });
  
  notes_list.addEventListener('click', function (event) {
    event.preventDefault();
    console.log(event.target, 'clicked');
  });
  
  displaySavedNoteItems();
  console.log(displaySavedNoteItems());
  
});

