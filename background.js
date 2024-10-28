// Map to store tab status elements
const tabStatusElements = new Map();

// Listen for tab creation events
browser.tabs.onCreated.addListener((tab) => {
  const creationTime = Date.now();
  tabCreationTimes.set(tab.id, creationTime);
  createTabStatusElement(tab.id, tab.url, creationTime);
});

// Listen for tab removal events
browser.tabs.onRemoved.addListener((tabId) => {
  tabCreationTimes.delete(tabId);
  removeTabStatusElement(tabId);
});

// Update tab status every minute
setInterval(() => {
  browser.tabs.query({}).then((tabs) => {
    tabs.forEach((tab) => {
      updateTabStatus(tab.id, tab.url);
    });
  });
}, 60000);

function updateTabStatus(tabId, tabUrl) {
  const creationTime = tabCreationTimes.get(tabId);
  if (!creationTime) return;

  const timeOpen = Math.floor((Date.now() - creationTime) / 1000 / 60); // Minutes
  let timeText = '';

  if (timeOpen < 60) {
    timeText = `${timeOpen}m`;
  } else {
    const hours = Math.floor(timeOpen / 60);
    timeText = `${hours}h`;
  }

  updateTabStatusElement(tabId, timeOpen, timeText);
}

function createTabStatusElement(tabId, tabUrl, creationTime) {
  const container = document.createElement('div');
  container.classList.add('tab-timer-container');

  const colorBar = document.createElement('div');
  colorBar.classList.add('tab-timer-color-bar');

  const timeText = document.createElement('div');
  timeText.classList.add('tab-time');

  container.appendChild(colorBar);
  container.appendChild(timeText);

  // Append the element to the tab
  browser.tabs.executeScript(tabId, {
    code: `
      var container = document.createElement('div');
      container.classList.add('tab-timer-container');
      document.body.appendChild(container);
    `
  });

  tabStatusElements.set(tabId, container);
}

function updateTabStatusElement(tabId, timeOpen, timeText) {
  const statusElement = tabStatusElements.get(tabId);
  if (!statusElement) return;

  // Update the color and text
  updateStatusColor(statusElement.querySelector('.tab-timer-color-bar'), timeOpen);
  statusElement.querySelector('.tab-time').textContent = timeText;
}

function updateStatusColor(colorBar, timeOpen) {
  if (timeOpen < 60) {
    colorBar.style.backgroundColor = '#4caf50'; // Green
  } else if (timeOpen < 240) {
    colorBar.style.backgroundColor = '#ff9800'; // Orange
  } else {
    colorBar.style.backgroundColor = '#f44336'; // Red
  }
}

function removeTabStatusElement(tabId) {
  const statusElement = tabStatusElements.get(tabId);
  if (!statusElement) return;

  // Remove the element from the tab
  browser.tabs.executeScript(tabId, {
    code: `
      var container = document.querySelector('.tab-timer-container');
      if (container) {
        container.remove();
      }
    `
  });

  tabStatusElements.delete(tabId);
}