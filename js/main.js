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
  recognition.onresult = function(e) {
    
    /**
     * The event is a SpeechRecognitionEvent object.  It holds all the line captured. Therefore,
     * the current one will suffice.
     */
    let current = e.resultIndex;
    
    // Get a transcript of what was said.
    let transcript = event.results[current][0].transcript;
    
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobile_repeat_bug = (current == 1 && transcript == event.results[0][0].transcript);
    
    if(!mobile_repeat_bug) {
      note_content += transcript;
      note_textarea.innerHTML = ' ' + note_content;
      note_content = '';
    }
    
  }; //end of onresult function
  
  recognition.onstart = function() {
      swal('Speech Recognition Activated', 'Begin speaking into the microphone', 'success');
      
  }; //end of onstart function
  
  recognition.onspeechend = function() {
    if (is_recording === true) {
      swal('Speech Recognition Terminated', 'Terminates, when silence for 15 seconds.', 'info');
    }
    
  }; //end of onspeechend function
  
  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      swal('Terminated','No speech detected. Try again!', 'error');
      return;
    };
    
  }; //end of onerror function
  
  /*=============================================
          functions
================================================*/
  
  function deleteNote (dateTime) {
    console.log('deleteNote');
    
  }; //end of deleteNote function
  
  function getAllNotes () {
    console.log('getAllNotes');
    
  }; //end of getAllNotes function
  
  function readOutLoadNote (message) {
    console.log('readOutLoadNote');
    
  }; //end of readOutLoadNote function
  
  function renderNotes (notes) {
    console.log('renderNotes');
    
  }; //end of renderNotes function
  
  function saveNote (dateTime, content) {
    console.log('saveNote');
    
  }; //end of saveNote function
  
  /*=============================================
        addEventListeners
================================================*/
  start_button.addEventListener('click', function(event) {
    
    if (is_recording === false) {
      if (note_textarea.innerHTML.length > 0) {
        console.log(note_textarea.innerHTML.length);
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

  stop_button.addEventListener('click', function(event) {
    console.log(event.target, 'clicked');
    if (is_recording === false) {
      swal ('Speech Recognition Information', 'Speech Recognition is not recording', 'info');
      
    } else {
      recognition.stop();
      is_recording = false;
      swal('Speech Recognition Stopped', 'Speech Recognition has safely stopped', 'info');
    }
    
  });
  
  save_button.addEventListener('click', function(event) {
    console.log(event.target, 'clicked');
  });
  
  note_textarea.addEventListener('input', function(event) {
    console.log(this.value, 'input');
  });
  
  notes_list.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(event.target, 'clicked');
  });
  
});