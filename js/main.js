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
    
  } catch (event) {
    console.error(event);
    swal('No Browser Support', 'Try again in a browser with WebSpeech Recognition', 'error');
    $('.app').hide();
    return;
    
  }
  
  //**************** variables ****************//
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  const note_textarea = $('#note-textarea');
  const notes_list = $('#notes-list');
  const start_button = $('#start-record-btn');
  const stop_button = $('#stop-record-btn');
  const save_button = $('#save-record-btn');
  
  let is_recording = false;
  let note_content = '';
  
  let is_editing = false;
  let edit_item;
  let edit_id = '';
  let edit_date;
  let edit_content;
  
  
  localSavedNotesList = getInitialNoteList();
  
  /*=============================================
        SpeechRecognition - recognition
================================================*/
  /**
   * If recognition.continuous = false, the recording will stop after a few seconds of
   * silence.  When it is true, the silence period can be longer (about 15 seconds).  Thus,
   * allowing SpeechRecognition to continue recording, even when the speaker pauses.
   */
  recognition.continuous = true;
  
  /**
   * This function is called every time the Speech API captures a line
   */
  recognition.onresult = function (event) {
    
    /**
     * The event is a SpeechRecognitionEvent object.  It holds all the line captured. Therefore,
     * the current one will suffice.
     */
    let current = event.resultIndex;
    
    // Get a transcript of what was said.
    let transcript = event.results[current][0].transcript;
    
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobile_repeat_bug = (current == 1 && transcript == event.results[0][0].transcript);
    
    if (!mobile_repeat_bug) {
      note_content += transcript;
      note_textarea.val(note_content);
      
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
  
  recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
      swal('Terminated', 'No speech detected. Try again!', 'error');
      return;
    }
    
  }; //end of onerror function
  
  /*=============================================
          functions
================================================*/
  
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
    clone.querySelector('.note-read').onclick = readNoteItem;
    clone.querySelector('.note-edit').onclick = editNoteItem;
    clone.querySelector('.note-delete').onclick = deleteNoteItem;
    clone.querySelector('.saved-notes-content').textContent = content;
    
    notes_list.append(clone);
    
  }; //end of createNoteItem function
  
  function deleteNoteItem (event) {
    
    if (event.target.classList.contains('fa-trash-alt')) {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, impossible to recover!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          const noteItem = event.target.parentElement.parentElement.parentElement.parentElement;
          const id = noteItem.dataset.id;
          
          noteItem.remove();
          removeFromLocalStorage(id);
          setToDefaultSettings();
          swal('Successfully Delete', 'Your note item has been deleted!', { icon: 'success' });
          
        } else {
          swal('Note Item Saved', 'Your note item is safe!', { icon: 'info' });
          return;
        }
      });
    }
  }; //end of deleteNote function
  
  /**
   * @description -
   */
  function displaySavedNoteItems () {
    localNoteListArr = getLocalStorage();
    if (localNoteListArr.length > 0) {
      localNoteListArr.forEach(function (noteItem) {
        createNoteItem(noteItem.id, noteItem.date, noteItem.content);
      });
    }
  }; //end of displayNoteItems functions
  
  function editNoteItem (event) {
    console.log('editNoteItem', event.target);
    if (event.target.classList.contains('fa-edit')) {
      is_editing = true;
      save_button.text('edit');
      const edit_item = event.target.parentElement.parentElement.parentElement.parentElement;
      console.log(edit_item);
      
      edit_id = edit_item.dataset.id;
      console.log(edit_id);
      
      edit_date = edit_item.children[0].children[0].innerHTML;
      console.log(edit_date);
      
      edit_content = edit_item.children[1].children[0].innerHTML;
      console.log(edit_content);
      
      note_textarea.text(edit_content).focus();
      
    }
    
  }; //end of editNoteItem function
  
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
  
  function readNoteItem (event) {
    
    if (event.target.classList.contains('fa-volume-up')) {
      const noteItem = event.target.parentElement.parentElement.parentElement.parentElement;
      const id = noteItem.dataset.id;
      /*console.log(id);
      console.log(noteItem.children.length);
      console.log(noteItem.children[1].children[0].innerHTML)*/
      const content = noteItem.children[1].children[0].innerHTML;
      
      swal('Please Wait...', 'SpeechSynthesisUtterance is starting.',{icon: 'info'});
      setTimeout(() => {
        const speech_utter = new SpeechSynthesisUtterance();
        speech_utter.text = content;
        speech_utter.volume = 1;
        speech_utter.rate - 0.7;
        speech_utter.pitch = 1;
  
        window.speechSynthesis.speak(speech_utter);
      }, 3000);
      
    }
  }; //end of readOutLoudNote function
  
  /**
   * @description -
   * @param id
   */
  function removeFromLocalStorage (id) {
    let localNoteListArr = getLocalStorage();
    localNoteListArr = localNoteListArr.filter(function (noteItem) {
      if (noteItem.id !== id) {
        return noteItem;
      }
    });
    localStorage.setItem('savedNoteList', JSON.stringify(localNoteListArr));
    
  }; //end of removeFromLocalStorage function
  
  function saveNoteItem (event) {
      note_content = note_textarea.val().trim();
      
      if (note_content && !is_recording && !is_editing) {
        const date_time = new Date();
        let id = date_time.getDate().toString();
        let date = date_time.toString().slice(0, -29);
        
        createNoteItem(id, date, note_content);
        addToLocalStorage(id, date, note_content);
        setToDefaultSettings();
        
        swal('Success', 'Note Item Successfully Saved', 'success');
        
      } else if (note_content && is_editing) {
/*        edit_content.val(note_content);*/
        
        edit_content = note_content;
        updateEditToLocalStorage(edit_id, edit_date, edit_content);
        displaySavedNoteItems();
        setToDefaultSettings();
        
        swal('Successfully Edited', 'Your note item was successfully edited!', 'success');
        return;
        
      } else {
        swal('Invalid Entry', 'Textarea cannot be empty!', 'error');
        return;
      }
      
  }; //end of saveNoteItem function
  
  /**
   * @description -
   */
  function setToDefaultSettings () {
    setTimeout(() => {
      note_textarea.text('');
      note_content = '';
      is_recording = false;
      is_editing = false;
/*      edit_item.innerHTML = '';*/
      edit_item;
      console.log(edit_item);
      edit_id = '';
      edit_date = '';
      save_button.text('save');
      
    }, 250);
    
  }; //end of setToDefaultSettings function
  
  /**
   * @description -
   * @param id
   * @param content
   */
  function updateEditToLocalStorage (id, date, content) {
    let localNoteListArr = getLocalStorage();
    localNoteListArr = localNoteListArr.map(function (noteItem) {
      if (noteItem.id === id) {
        noteItem.date = date;
        noteItem.content = content;
      }
      return noteItem;
      
    });
    localStorage.setItem('savedNoteList', JSON.stringify(localNoteListArr));
    
  }; //end of updateEditToLocalStorage function
  /*=============================================
        addEventListeners
================================================*/
  window.addEventListener('DOMContentLoaded', getInitialNoteList);
  
  start_button.on('click', function(event) {
    
    if (is_recording === false) {
      if (note_textarea.val().length > 0) {
        note_textarea.val(' ');
        
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
  
  stop_button.on('click', function (event) {
    
    if (is_recording === false) {
      swal('Speech Recognition Information', 'Speech Recognition is not recording', 'info');
      
    } else {
      recognition.stop();
      is_recording = false;
      swal('Speech Recognition Stopped', 'Speech Recognition has safely stopped', 'info');
      
    }
  });
  
  /*save_button.on('click', function(event) {
    if (is_recording === false) {
      if (note_textarea.val().length <= 0) {
        swal('Invalid Note Item', 'Textarea cannot be empty!', 'error');
      
      } else {
        
        const date_time = new Date();
        let id = date_time.getTime().toString();
        let date = date_time.toString().slice(0, -29);
      
        note_content = note_textarea.val();
      
        createNoteItem(id, date, note_content);
        addToLocalStorage(id, date, note_content);
        setToDefaultSettings();
        swal('Success', 'Note Successfully Saved', 'success');
      
      }
    
    } else if (is_recording === true) {
      if (note_textarea.val().length <= 0) {
        swal('Invalid Note Item', 'Textarea cannot be empty!', 'error');
      
      } else  {
        recognition.stop();
        is_recording = false;
      
        note_content = note_textarea.val().trim();
      
        const date_time = new Date();
        let id = date_time.getTime().toString();
        let date = date_time.toString().slice(0, -29);
      
        createNoteItem(id, date, note_content);
        addToLocalStorage(id, date, note_content);
        setToDefaultSettings();
      
        swal('Speech Recognition', 'Speech Recognition safely saved your note.', 'info');
      }
    } else if (is_editing === true) {
        if (note_textarea.val().length <= 0) {
          swal('Invalid Note Item', 'Textarea cannot be empty!', 'error');
          
        } else {
          recognition.stop();
          is_recording = false;
          console.log(edit_item_content);
          updateEditToLocalStorage(edit_id, edit_item_content);
          setToDefaultSettings();
  
          swal('Successfully Edited','Your note item was successfully edited!', {
            icon: 'success'
          });
          return;
        }
    }
  });*/
  
  save_button.on('click', saveNoteItem);
  note_textarea.on('click', function (event) {
    note_content = $(this).val();
  })
  
/*  notes_list.addEventListener('click', function (event) {
    event.preventDefault();
    console.log(event.target, 'clicked');
  });*/
  
  /*notes_list.on('click', function (event) {
    event.preventDefault();
    console.log(event.target, 'clicked');
    
  });*/
  
  displaySavedNoteItems();
  
});

