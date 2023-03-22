/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(5000, function () {});
});

/*=============================================
          js-voice-note-app
================================================*/
$(window).onload = function () {
  
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
  } catch (e) {
    console.error(e);
    swal('No Browser Support', 'Try again in a browser with WebSpeech Recognition', 'error');
    $('.app').hide();
    
  }

//**************** variables ****************//
  const note_textarea = $('#note-textarea');
  const note_list = $('#notes-list');
  
  let note_content = '';
  
  
  /*=============================================
          recognition
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
      note_textarea.val(note_content);
    }
    
  }; //end of onresult function
  
  recognition.onstart = function() {
    swal('Speech Recognition Activated', 'Begin speaking into the microphone', 'success');
    
  }
  
  recognition.onspeechend = function() {
    swal('Speech Recognition Terminated', 'Termnates, when silence for 15 seconds', 'info');
  }
  
  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      swal('Terminated','No speech detected. Try again!', 'error');
    };
  }
  
  /*=============================================
  
================================================*/
  
  
  
  
  
  
  
  
  /*=============================================
  
================================================*/


  
}; //end of window onload anonymous function