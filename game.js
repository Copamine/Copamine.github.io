const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const jumpStrength = 15.5;
const gravity = -0.5;
let jumping = false;
let playerY = 0;
let playerVelocityY = 0;
let playerVelocityX = 0;
let playerX = parseInt(getComputedStyle(player).left);
let cameraX = 0;
let cameraY = 0;
let debugMode = false;
let flying = false;
let friction = 0;
let maxSpeed = 8;
const movementKeys = ['a', 'A', 'ArrowLeft', 'd', 'D', 'ArrowRight'];
const jumpKeys = ['w', 'W', 'ArrowUp', 's', 'S', 'ArrowDown'];
let isOnSlipperyPlatform = false;
let intervalId = null;
let intervalId2 = null;
let intervalId3 = null

const platforms = document.querySelectorAll('.platform');
const cameraLerpFactor = 0.1;

document.addEventListener('keydown', (event) => {
  if (event.key === '\\') {
    debugMode = !debugMode;
    document.querySelector('.debug-mode').style.display = debugMode ? 'block' : 'none';
    if (!debugMode) {
      flying = false;
    }
  }
function handleKeyUp(event) {
    const keys = ['s', 'S', 'ArrowDown', 'w', 'W', 'ArrowUp'];
    if (keys.includes(event.key)) {
        playerVelocityY = 0;
    }
}

document.addEventListener('keyup', function(event) {
    if (flying) {
        handleKeyUp(event);
    }
});
  
 if (event.key === '`' && debugMode) {
    flying = !flying;
    if (flying) {
      playerVelocityY = 0;
    }
  }

  if (movementKeys.includes(event.key)) {
    if (event.key === 'a' || event.key === 'ArrowLeft') {
      if (isOnSlipperyPlatform) {
        clearInterval(intervalId);
        intervalId = null;
        playerVelocityX = playerVelocityX - .25;
        if (playerVelocityX <= -maxSpeed) {
          playerVelocityX = -maxSpeed;
        }
      }

      else {
        
        
        playerVelocityX = -8;
        clearInterval(intervalId);
        intervalId = null;
        clearInterval(intervalId2);
        intervalId2 = null;
        clearInterval(intervalId3);
        intervalId3 = null;
        
      
    }
    }
      

    if (event.key === 'd' || event.key === 'ArrowRight') {
      
      if (isOnSlipperyPlatform) {
        clearInterval(intervalId);
        intervalId = null;
        playerVelocityX = playerVelocityX + .25;
        if (playerVelocityX >= maxSpeed) {
          playerVelocityX = maxSpeed;
        }
         
      }
      else {
        
       
       
        playerVelocityX = 8;
        clearInterval(intervalId);
        intervalId = null;
        clearInterval(intervalId2);
        intervalId2 = null;
        clearInterval(intervalId3);
        intervalId3 = null;
    
        
      
      
    }
  }
}





  if (event.key === 'w' || event.key === 'ArrowUp') {
    if (!flying) {
      if (!jumping) {
        jumping = true;
        playerVelocityY = jumpStrength;
      }
    } else {
      playerVelocityY = 10;
    }
  }

  if (event.key === 's' || event.key === 'ArrowDown') {
    if (flying) {
      playerVelocityY = -10;
    }
  }

  if (event.key === 'r') {
    resetPosition();
  }
});



document.addEventListener('keyup', (event) => {
  if (movementKeys.includes(event.key)) {
    clearInterval(intervalId);
    
    playerVelocityX *= friction;
    console.log(playerVelocityX);

    intervalId = setInterval(() => {
      playerVelocityX *= friction;
      console.log(playerVelocityX);
      
      if (Math.abs(playerVelocityX) <= 2) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
    }, 500);
  }
  else {

  }
});






if (flying && (event.key === 'w' || event.key === 's' || event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
  playerVelocityY = 0;
}

function resetPosition() {
  playerY = 0;
  playerVelocityY = 0;
  playerVelocityX = 0;
  playerX = 0;
  cameraX = 0;
  cameraY = 0;
  player.style.bottom = playerY + 'px';
  player.style.left = playerX + 'px';
  gameContainer.style.left = cameraX + 'px';
  gameContainer.style.top = cameraY + 'px';
  jumping = false;
}

function update() {
  if (!flying) {
    playerVelocityY += gravity;
  }

  playerX += playerVelocityX;
  playerY += playerVelocityY;

  if (playerY >= 0) {
    player.style.bottom = playerY + 'px';
  } else {
    player.style.bottom = '0';
    playerY = 0;
    jumping = false;
  }

  for (const platform of platforms) {
    if (isColliding(player, platform)) {
      if (platform.classList.contains('slippery-platform')) {
        isOnSlipperyPlatform = true;
        friction = 0.5;
        acceleration = 2;
        
      } else {
        isOnSlipperyPlatform = false;
        clearInterval(intervalId);
        friction = 0;
        acceleration = 8;
      }

      if (platform.classList.contains('death')) {
        resetPosition();
      }

      if (platform.classList.contains('teleport-platform')) {
        playerY = parseInt(platform.style.bottom) + 1;
        playerVelocityY = 0;
        friction = 0;
        jumping = false;
      } else {
        if (playerVelocityY < 0 && playerY > parseInt(platform.style.bottom)) {
          playerY = parseInt(platform.style.bottom) + 1;
          playerVelocityY = 0;
          jumping = false;
        } else if (playerVelocityY > 0 && playerY + 1 < parseInt(platform.style.bottom) + 10) {
          playerY = parseInt(platform.style.bottom) - 49;
          playerVelocityY = 0;
        } else if (playerVelocityY > 0 && playerY < parseInt(platform.style.bottom) && playerY + 1 > parseInt(platform.style.bottom)) {
          playerY = parseInt(platform.style.bottom);
          playerVelocityY = 0;
          jumping = false;
        } else if (playerVelocityY < 0 && playerY + 1 > parseInt(platform.style.bottom) && playerY < parseInt(platform.style.bottom)) {
          playerY = parseInt(platform.style.bottom) + 1;
          playerVelocityY = 0;
          jumping = false;
        }
      }
    }
  }

  if (playerVelocityY <= -9) {
    playerVelocityY = -9;
  }

  cameraX += (playerX - cameraX - gameContainer.offsetWidth / 2 + player.offsetWidth / 2) * cameraLerpFactor;
  cameraY += (playerY - cameraY - gameContainer.offsetHeight / 5 + player.offsetHeight / 2) * cameraLerpFactor;

  gameContainer.style.left = `-${cameraX}px`;
  gameContainer.style.top = `${cameraY}px`;

  player.style.left = playerX + 'px';

  if (debugMode) {
    const debugInfo = `X: ${Math.round(playerX)}, Y: ${Math.round(playerY)}`;
    document.querySelector('.debug-mode').innerText = debugInfo;
  }

  requestAnimationFrame(update);
}

function isColliding(player, platform) {
  const playerRect = player.getBoundingClientRect();
  const platformRect = platform.getBoundingClientRect();

  return (
    playerRect.bottom >= platformRect.top &&
    playerRect.top <= platformRect.bottom &&
    playerRect.right >= platformRect.left &&
    playerRect.left <= platformRect.right
  );
}

update();



