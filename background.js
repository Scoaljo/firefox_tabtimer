// Store tab creation times
const tabTimes = new Map();

// Initialize: get all existing tabs
browser.tabs.query({}).then(tabs => {
  tabs.forEach(tab => {
    tabTimes.set(tab.id, Date.now());
  });
});

// Listen for new tabs
browser.tabs.onCreated.addListener(tab => {
  tabTimes.set(tab.id, Date.now());
});

// Clean up removed tabs
browser.tabs.onRemoved.addListener(tabId => {
  tabTimes.delete(tabId);
});

// Listen for tab updates (navigation/refresh)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateAllTabs();
  }
});

// Update titles periodically
setInterval(updateAllTabs, 60000); // every minute
updateAllTabs(); // initial update

function updateAllTabs() {
  browser.tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
      const startTime = tabTimes.get(tab.id);
      if (startTime) {
        const minutes = Math.floor((Date.now() - startTime) / 60000);
        const timeText = minutes < 60 ? 
          `${minutes}m` : 
          `${Math.floor(minutes/60)}h`;
          
        browser.tabs.executeScript(tab.id, {
          code: `document.title = '${timeText} | ' + document.title.split(' | ')[document.title.split(' | ').length-1]`
        }).catch(err => console.log(`Couldn't update tab ${tab.id}: ${err}`));
      }
    });
  });
}