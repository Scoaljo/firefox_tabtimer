// Store tab creation times
const tabTimes = new Map();

// Initialize: get all existing tabs
browser.tabs.query({}).then(tabs => {
  tabs.forEach(tab => {
    tabTimes.set(tab.id, Date.now());
    updateTabIcon(tab.id);
  });
});

// Listen for new tabs
browser.tabs.onCreated.addListener(tab => {
  tabTimes.set(tab.id, Date.now());
  updateTabIcon(tab.id);
});

// Clean up removed tabs
browser.tabs.onRemoved.addListener(tabId => {
  tabTimes.delete(tabId);
});

// Listen for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTabIcon(tab.id);
  }
});

// Update icons periodically
setInterval(() => {
  browser.tabs.query({}).then(tabs => {
    tabs.forEach(tab => updateTabIcon(tab.id));
  });
}, 60000); // every minute

function getColor(minutes) {
  if (minutes < 30) return '#4caf50';  // green
  if (minutes < 60) return '#ff9800';  // orange
  return '#f44336';  // red
}

function createTimerIcon(timeText, color) {
  const canvas = new OffscreenCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, 32, 32);
  
  // Draw colored background
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(0, 0, 32, 32, 8);
  ctx.fill();
  
  // Draw time text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(timeText, 16, 16);

  // Convert canvas to base64 data URL
  const imageData = ctx.getImageData(0, 0, 32, 32);
  const tempCanvas = new OffscreenCanvas(32, 32);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(imageData, 0, 0);
  
  return tempCanvas.convertToBlob().then(blob => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });
}

async function updateTabIcon(tabId) {
  const startTime = tabTimes.get(tabId);
  if (!startTime) return;

  const minutes = Math.floor((Date.now() - startTime) / 60000);
  const timeText = minutes < 60 ? 
    `${minutes}m` : 
    `${Math.floor(minutes/60)}h`;
  const color = getColor(minutes);
  
  try {
    // Create the icon
    const dataUrl = await createTimerIcon(timeText, color);
    
    // Inject the script to update the favicon
    await browser.tabs.executeScript(tabId, {
      code: `
        (function() {
          let link = document.querySelector('link[rel*="icon"][data-timer-icon]') ||
                     document.createElement('link');
          
          link.type = 'image/x-icon';
          link.rel = 'icon';
          link.href = '${dataUrl}';
          link.setAttribute('data-timer-icon', 'true');
          
          if (!link.parentNode) {
            // Remove any existing favicons
            document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
            document.head.appendChild(link);
          }
        })();
      `
    });
  } catch (err) {
    console.log(`Couldn't update tab ${tabId}: ${err}`);
  }
}

// Initial update
browser.tabs.query({}).then(tabs => {
  tabs.forEach(tab => updateTabIcon(tab.id));
});