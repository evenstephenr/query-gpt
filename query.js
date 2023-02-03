chrome.action.onClicked.addListener((tab) => {
  if(tab.url.includes("google.com/search?q=")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"]
    });
  }
});

chrome.runtime.onMessage.addListener(function (request,/**sender*/ _, sendResponse) {    
  // saving this for later...
  //
  // if (request.contentScriptQuery == "GET") {
  //     var url = request.url;
  //     fetch(url)
  //         .then(response => response.text())
  //         .then(response => sendResponse(response))
  //         .catch()
  //     return true;
  // }
  if (request.contentScriptQuery == "POST") {
      fetch(request.url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${request.token}`
          },
          body: JSON.stringify(request.body)
      })
        .then(response => response.json())
        .then(response => sendResponse(response))
        .catch(error => console.log('Error:', error));
      return true;
  }
});

// TODO: remove localStorage api key on exit
// https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved
// ^ this won't actually work, tabId is there but the tab is ~gone~
// chrome.tabs.onRemoved.addListener((tabId) => {
//   chrome.scripting.executeScript({
//     target: { tabId },
//     files: ["cleanup.js"]
//   });
// })