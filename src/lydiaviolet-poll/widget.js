let widgetOptions = {};
let users = [];
let isActive = false;
let voteCount = 0;
let vote1 = 0;
let vote2 = 0;
let voteSize = 50;
let interval;
let fadeOutTimeout;
let time;
let fadeOutAfter;

let vote1Img = 'https://raw.githubusercontent.com/PoOwAa/streamelements-widgets/feature/libby-poll-animated/src/lydiaviolet-poll/pepe-1.webp';
let vote2Img = 'https://raw.githubusercontent.com/PoOwAa/streamelements-widgets/feature/libby-poll-animated/src/lydiaviolet-poll/pepe-2.webp';
let vote1ImgAnimated = 'https://raw.githubusercontent.com/PoOwAa/streamelements-widgets/feature/libby-poll-animated/src/lydiaviolet-poll/pepe-1-animated.webp';
let vote2ImgAnimated = 'https://raw.githubusercontent.com/PoOwAa/streamelements-widgets/feature/libby-poll-animated/src/lydiaviolet-poll/pepe-2-animated.webp';
let hypeImg = 'https://raw.githubusercontent.com/PoOwAa/streamelements-widgets/feature/libby-poll-animated/src/lydiaviolet-poll/hype.webp';

// Calculates the position of the pointer in %
function calculatePointerPosition() {
  if (voteCount === 0) {
    return 50;
  }
  return ((vote1 + (vote2 * 2)) / voteCount - 1) * 100;
}

// Update the UI
function updateUI() {
  const pos = calculatePointerPosition();
  // Update the timer
  $('#vote-countdown').text(`${time}s`);

  // Update the pointer position
  $('#vote-pointer').css('left', `calc(${pos}% - ${voteSize / 2}px)`);
}

function vote(user, option) {
  // Increase the vote count
  voteCount++;

  // Increase the vote for the option
  if (option === 1) {
    vote1++;
  } else if (option === 2) {
    vote2++;
  }

  // Add the user to the list of users
  users.push(user);

  // Update the UI
  updateUI();
}

function reset() {
  // Hide the widget
  $('.vote-main-container').fadeOut(1);
  // Reset votes
  voteCount = 0;
  vote1 = 0;
  vote2 = 0;
  users = [];

  $('#vote-pepe-1').attr('src', vote1Img);
  $('#vote-pepe-2').attr('src', vote2Img);
  $('.vote-hype').fadeOut(1);

  isActive = false;

  // Clear the interval and timeout
  if (interval) {
    clearInterval(interval);
  }
  if (fadeOutTimeout) {
    clearTimeout(fadeOutTimeout);
  }

  // Update the UI
  updateUI();
}

function countdown() {
  time--;
  updateUI();
  if (time < 1) {
    clearInterval(interval);
    isActive = false;
    const winner = (vote1 === vote2) ? 'Draw' : (vote1 > vote2) ? 1 : 2;
    $('#vote-countdown').text(`W ${winner}!`);
    $('#vote-pepe-1').attr('src', (winner === 1) ? vote1ImgAnimated : vote1Img);
    $('#vote-pepe-2').attr('src', (winner === 2) ? vote2ImgAnimated : vote2Img);
    $('.vote-hype').fadeIn();

    fadeOutTimeout = setTimeout(() => {
      reset();
    }, fadeOutAfter * 1000);
  }
}

window.addEventListener('onWidgetLoad', (obj) => {
  // obj will give you the data you set your self in the overlay editor
  widgetOptions = obj.detail.fieldData;
  widgetOptions.channelName = obj.detail.channel.username;

  voteSize = widgetOptions.progressBarWidth / 4.5;
  time = widgetOptions.pollTime;
  fadeOutAfter = widgetOptions.fadeOutAfter;

  $('.vote-main-container').css('width', `${widgetOptions.progressBarWidth}px`);

  // Set the size and position of the images
  $('#vote-progress-image').css('width', `${widgetOptions.progressBarWidth}px`);
  $('.vote-hype').css('width', `${voteSize / 2}px`);
  $('.vote-hype').css('height', `${voteSize / 2}px`);
  $('#vote-pepe-1').css('width', `${voteSize}px`);
  $('#vote-pepe-2').css('width', `${voteSize}px`);
  $('#vote-pointer').css('width', `${voteSize}px`);
  $('#vote-pointer').css('left', `calc(50% - ${voteSize / 2}px)`);

  updateUI();
});

window.addEventListener('onEventReceived', (obj) => {
  if (obj.detail.listener !== 'message') return;

  const data = obj.detail.event.data;
  const message = data.text.toLowerCase();
  const user = data.nick;

  const userState = {
    mod: parseInt(data.tags.mod),
    sub: parseInt(data.tags.subscriber),
    vip: (data.tags.badges.indexOf('vip') !== -1),
    badges: {
      broadcaster: (user === widgetOptions.channelName),
    }
  };

  // Only mods/broadcaster can activate the widget
  if (userState.mod || userState.badges.broadcaster) {
    if (message.startsWith(widgetOptions.activationCommand) && !isActive) {
      // Reset the widget
      reset();
      
      // Adjust the polltime via chat command
      const [_, pollTime, fadeOutTime] = message.split(' ');
      if (pollTime && !isNaN(parseInt(pollTime))) {
        time = parseInt(pollTime);
      } else {
        time = widgetOptions.pollTime;
      }

      // Adjust the fadeout time via chat command
      if (fadeOutTime && !isNaN(parseInt(fadeOutTime))) {
        fadeOutAfter = parseInt(fadeOutTime);
      } else {
        fadeOutAfter = widgetOptions.fadeOutAfter;
      }

      // Start the countdown
      isActive = true;
      interval = setInterval(countdown, 1000);
      updateUI();

      // Show the widget
      $('.vote-main-container').fadeIn();
      return;
    } else if (message.startsWith(widgetOptions.deactivationCommand) && isActive) {
      reset();
      return;
    }
  }

  // Only allow votes if the widget is active
  if (!isActive) return;
  // Only allow 1 vote per user if the option is enabled
  if (widgetOptions.onlyUnique && users.indexOf(user) !== -1) return false;
  // Sub only mode
  if (widgetOptions.subOnly && !userState.sub) return false;
  
  // The vote
  if (message.indexOf('1') !== -1) {
    vote(user, 1);
  } else if (message.indexOf('2') !== -1) {
    vote(user, 2);
  }
});