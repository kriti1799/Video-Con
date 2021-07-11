// chat/static/chat/scripts/rooms.js
let username ;
const button = document.getElementById('join_leave');
const container = document.getElementById('container');
const count = document.getElementById('count');
let connected = false;
let room;
$(function() {
    // Reference to the chat messages area
    let $chatWindow = $("#messages");
  
    // Our interface to the Chat client
    let chatClient;
  
    // A handle to the room's chat channel
    let roomChannel;
  
    // The server will assign the client a random username - stored here
    
  
    // Helper function to print info messages to the chat window
    function print(infoMessage, asHtml) {
      let $msg = $('<div class="info">');
      if (asHtml) {
        $msg.html(infoMessage);
      } else {
        $msg.text(infoMessage);
      }
      $chatWindow.append($msg);
    }
  
  // Helper function to print chat message to the chat window
   function printMessage(fromUser, message) {
     let $user = $('<span class="username">').text(fromUser + ":");
     if (fromUser === username) {
       $user.addClass("me");
     }
     let $message = $('<span class="message">').text(message);
     let $container = $('<div class="message-container">');
     $container.append($user).append($message);
     $chatWindow.append($container);
     $chatWindow.scrollTop($chatWindow[0].scrollHeight);
   }
  
    // Get an access token for the current user, passing a device ID
    // for browser-based apps, we'll just use the value "browser"
    $.getJSON(
      "/token",
      {
        device: "browser"
      },
      function(data) {
        
        username = data.identity;
        print(
          
            '<span class="me">' +
            username +
            "</span>" + " has entered",
          true
        );
  
        // Initialize the Chat client
        Twilio.Chat.Client.create(data.token).then(client => {
          // Use client
          chatClient = client;
          chatClient.getSubscribedChannels().then(createOrJoinChannel);
        });
  
      }
    );

    function createOrJoinChannel() {
        // Extract the room's channel name from the page URL
        let channelName = window.location.pathname.split("/").slice(-2, -1)[0];
      
       
      
        chatClient
          .getChannelByUniqueName(channelName)
          .then(function(channel) {
            roomChannel = channel;
            setupChannel(channelName);
          })
          .catch(function() {
            // If it doesn't exist, let's create it
            chatClient
              .createChannel({
                uniqueName: channelName,
                friendlyName: `${channelName} Chat Channel`
              })
              .then(function(channel) {
                roomChannel = channel;
                setupChannel(channelName);
              });
          }); 
        }

        function setupChannel(name) {
            roomChannel.join().then(function(channel) {
              
              channel.getMessages(50).then(processPage);
            });
          
            // Listen for new messages sent to the channel
            roomChannel.on("messageAdded", function(message) {
              printMessage(message.author, message.body);
            });
          }
          function processPage(page) {
            page.items.forEach(message => {
              printMessage(message.author, message.body);
            });
            if (page.hasNextPage) {
              page.nextPage().then(processPage);
            } else {
              console.log("Done loading messages");
            }
          }
          
          let $form = $("#message-form");
        let $input = $("#message-input");
        $form.on("submit", function(e) {
        e.preventDefault();
        if (roomChannel && $input.val().trim().length > 0) {
            roomChannel.sendMessage($input.val());
            $input.val("");
        }
    });

    //  function leftroom(){
    //      var url = "/leftroom?var1=@username";
    //      window.location.href= url  ;  
    //  }

}) 

// var btn = document.getElementById("leave");
//     btn.onclick = function(){
//         var url = "/leftroom?var1=@username@";
//          window.location.href= url  ; 
//     }

function addLocalVideo() {
      Twilio.Video.createLocalVideoTrack().then(track => {
          let video = document.getElementById('local').firstChild;
          video.appendChild(track.attach());
      });
  };

  addLocalVideo();
  
  function connectButtonHandler(event) {
    event.preventDefault();
    if (!connected) {
        // let username = usernameInput.value;
        // if (!username) {
        //     alert('Enter your name before connecting');
        //     return;
        // }
        //window.alert(username)
        button.disabled = true;
        button.innerHTML = 'Connecting...';
        connect(username).then(() => {
            button.innerHTML="Leave Call";
            
            button.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button.innerHTML = 'Join with Video';
            button.disabled = false;    
        });
    }
    else {
        disconnect();
        button.innerHTML = 'Join with Video';
        connected = false;
    }
};

button.addEventListener('click', connectButtonHandler);

function connect(username) {
  let promise = new Promise((resolve, reject) => {
    $.getJSON(
      "/vid",
      ).then((data) => {
        window.alert(data.token)
        return Twilio.Video.connect(data.token);
      }).then(_room => {
          // Use client
          //window.alert(_room)
          room = _room;
          room.participants.forEach(participantConnected);
          room.on('participantConnected', participantConnected);
          room.on('participantDisconnected', participantDisconnected);
          connected = true;
          updateParticipantCount();
          resolve();
        })
  
      });
      return promise;
  }

  function updateParticipantCount() {
    if (!connected)
        count.innerHTML = 'Disconnected.';
    else
        count.innerHTML = (room.participants.size + 1) + ' participants online.';
};

function participantConnected(participant) {
  let participantDiv = document.createElement('div');
  participantDiv.setAttribute('id', participant.sid);
  participantDiv.setAttribute('class', 'participant');

  let tracksDiv = document.createElement('div');
  participantDiv.appendChild(tracksDiv);

  let labelDiv = document.createElement('div');
  labelDiv.innerHTML = participant.identity;
  participantDiv.appendChild(labelDiv);

  container.appendChild(participantDiv);

  participant.tracks.forEach(publication => {
      if (publication.isSubscribed)
          trackSubscribed(tracksDiv, publication.track);
  });
  participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  updateParticipantCount();
};

function participantDisconnected(participant) {
  document.getElementById(participant.sid).remove();
  updateParticipantCount();
};

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
};

function trackUnsubscribed(track) {
  track.detach().forEach(element => element.remove());
};

function disconnect() {
  room.disconnect();
  while (container.lastChild.id != 'local')
      container.removeChild(container.lastChild);
  button.innerHTML = 'Join call';
  connected = false;
  updateParticipantCount();
};







