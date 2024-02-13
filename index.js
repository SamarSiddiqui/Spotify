//Getting HTML elements
const playlistContainer = document.getElementById('playlistBoxes')
const songTitle = document.getElementById('song-title')
const myAudio = document.getElementById("myAudio")
const currentTime = document.getElementById('currentTime')
const songDuration = document.getElementById('songDuration')
const timeLine = document.getElementById('timeLine')
const backwardBtn = document.getElementById('backwardBtn')
const forwardBtn = document.getElementById('forwardBtn')
const volumeControl = document.getElementById('volume')
const volumeIcon = document.querySelector('.volume-icon')

// Function to create a category div for each music category
function createCategoryDiv(categoryName) {
  const categoryDiv = document.createElement('div')
  categoryDiv.className = 'category'
  playlistContainer.appendChild(categoryDiv)

  const playlistHeadingDiv = document.createElement('div')
  playlistHeadingDiv.className = 'playlistTitleDiv'
  categoryDiv.appendChild(playlistHeadingDiv)

  const playlistTitle = document.createElement('h3')
  playlistTitle.className = 'playlistTitle'
  playlistHeadingDiv.appendChild(playlistTitle)
  playlistTitle.innerHTML = `${categoryName}`


  const playlistOption = document.createElement('h4')
  playlistOption.className = 'playlist-option'
  playlistHeadingDiv.appendChild(playlistOption)
  playlistOption.innerHTML = 'Show all'

  return categoryDiv
}

// Function to create a song box within a given category div
function createSongBox(song, categoryDiv) {
  const songBox = document.createElement('div');
  songBox.className = 'song-box';

  const songsDiv = document.createElement('div')
  songsDiv.className = 'songs-container'

  const playlistImgDiv = document.createElement('div')
  playlistImgDiv.className = 'playlistimgDiv'

  const playlistImg = document.createElement('img')
  playlistImg.className = 'playlist-img'
  playlistImg.src = `${song.songImg}`
  playlistImg.alt = `${song.songName}`
  playlistImgDiv.appendChild(playlistImg)

  songBox.appendChild(playlistImgDiv)

  categoryDiv.appendChild(songBox)

  const playlistInfo = document.createElement('div')
  playlistInfo.className = 'playlistInfo'
  songBox.appendChild(playlistInfo)
  const playlistName = document.createElement('h3')
  playlistName.className = 'playlist-name'
  playlistName.innerHTML = `${song.songName}`
  playlistInfo.appendChild(playlistName)
  const playlistArtist = document.createElement('h4')
  playlistArtist.className = 'playlist-artist'
  playlistArtist.innerHTML = `${song.singerName}`
  playlistInfo.appendChild(playlistArtist)

  // Adding a click event listener to the song box
  songBox.addEventListener('click', () => {
    document.getElementById('songName').innerHTML = `${song.songName} `
    document.getElementById('artistName').innerHTML = `${song.singerName} `

    const controlLeft = document.getElementById('control-left')
    const photoDiv = document.createElement('div')
    photoDiv.className = 'photo-box'
    controlLeft.appendChild(photoDiv)
    const songImg = document.createElement('img')
    photoDiv.appendChild(songImg)
    songImg.src = `${song.songImg}`
    
    // Set the audio source to the selected song and play it
    myAudio.src = `${song.audioPath}`
    myAudio.play()

    // Updating the pause/resume button icon
    pauseResumeBtn.classList.remove('fa-circle-play')
    pauseResumeBtn.classList.add('fa-circle-pause')
  })
}

//Functionality related to the audio timeline,duration & currentTime
myAudio.addEventListener("loadeddata", () => {
  songDuration.innerHTML = formatTime(myAudio.duration)
  updateThumbPosition()
})

myAudio.addEventListener("timeupdate", () => {
  currentTime.innerHTML = formatTime(myAudio.currentTime)
  timeLine.value = currentTime
  updateThumbPosition()
})

forwardBtn.addEventListener('click', () => {
  forwardTrack()
})
backwardBtn.addEventListener('click', () => {
  backwardTrack()
})

volumeControl.addEventListener('input', () => {
  const volume = volumeControl.value / 100;
  myAudio.volume = volume;
  updateVolumeStyles();

});

function toggleVolume() {
  if (myAudio.volume === 0) {
    myAudio.volume = 0.5; // Set the volume to a default value when turning it back on
    volumeControl.value = 50; // Set the volume range to 50%
  } else {
    myAudio.volume = 0; // Mute the volume
    volumeControl.value = 0; // Set the volume range to 0
  }
  updateVolumeStyles();
}

function updateVolumeStyles() {
  const volume = volumeControl.value;
  const volumePercentage = volume + '%';
  volumeControl.style.background = `linear-gradient(to right, #4CAF50 ${volumePercentage}, #ffffff ${volumePercentage})`;

  if (myAudio.volume === 0) {
    volumeIcon.className = 'fas fa-volume-xmark volume-icon';
  } else {
    volumeIcon.className = 'fas fa-volume-high volume-icon';
  }
}

document.addEventListener('keydown', e => {

  if (e.code === "Space") {
    togglePauseResume()
  }else if (e.code === 'ArrowLeft') {
    backwardTrack()
  }else if (e.code === 'ArrowRight') {
    forwardTrack()
  }
})

function forwardTrack() {
  myAudio.currentTime += 10
}

function backwardTrack() {
  myAudio.currentTime -= 10
}
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
  return formattedTime;
}

timeLine.addEventListener('input', () => {
  const newTime = timeLine.value
  myAudio.currentTime = newTime
  updateThumbPosition()
})

timeLine.addEventListener('click', (event) => {
  const clickPosition = event.clientX - timeLine.getBoundingClientRect().left;
  const percentage = clickPosition / timeLine.offsetWidth;
  const newTime = percentage * myAudio.duration;
  myAudio.currentTime = newTime;
});

function updateThumbPosition() {
  // Calculate the percentage of progress
  const progress = (myAudio.currentTime / myAudio.duration) * 100;
  timeLine.style.background = `linear-gradient(to right, #fff 0%, #fff ${progress}%, #837d7d ${progress}%, #837d7d 100%)`;
}

// Event listener for the heart icon click
document.getElementById('heartIcon').addEventListener('click', function () {
  if (!this.classList.contains('clicked')) {
    // First click, turn the heart green
    this.classList.add('clicked');
  } else {
    // Second click, remove the 'clicked' class and trigger animation
    this.classList.remove('clicked');
    // Adding a slight delay before triggering the animation
    setTimeout(() => {
      this.classList.add('animate');
      // Removing the 'animate' class after the animation completes
      setTimeout(() => {
        this.classList.remove('animate');
      }, 600); // Adjust the duration to match the animation
    }, 10);
  }
});

// Function to fetch data from a JSON file and populate the music player
function fetchData() {
  fetch("./data.json")
    .then(res => res.json())
    .then(res => {
      const { categories } = res
      for (const category in categories) {
        const categoryDiv = createCategoryDiv(category)

        const subCategories = categories[category]
        for (const subcategory of subCategories)
          createSongBox(subcategory, categoryDiv)
      }
    })
    .catch(err => console.error(err))
}
fetchData()

// Function to update the greeting based on the current time
function updateGreeting() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var greeting;

  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  document.getElementById("greeting").innerHTML = greeting;
}
// Call the function when the page loads
window.onload = function () {
  updateGreeting();
};

// ChangingPause&ResumeFunctinality
var isPaused = true
const pauseResumeBtn = document.getElementById("pause-resume")

function togglePauseResume() {
  if (isPaused) {
    pauseResumeBtn.classList.remove('fa-circle-pause')
    pauseResumeBtn.classList.add('fa-circle-play')
    myAudio.pause()
  } else {
    pauseResumeBtn.classList.remove('fa-circle-play')
    pauseResumeBtn.classList.add('fa-circle-pause')
    myAudio.play()
  }
  isPaused = !isPaused
}
