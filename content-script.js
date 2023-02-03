// TODO: can we programmatically see if this key is still valid?
// https://platform.openai.com/docs/api-reference/authentication
if (!window.localStorage.getItem("ext-gptquery--apikey")) {
  const key = prompt("key, please");
  window.localStorage.setItem("ext-gptquery--apikey", key);
}

// TODO: style this, extend with semantic elements
const el = document.createElement('div');
el.innerHTML = "Loading...";
el.className = "appbar";
el.style = "max-width: 80%;margin-bottom:2em;margin-top:1em;font-size:medium;";
el.id = "ext-gptquery--appbar"
const target = document.getElementById("appbar");
target.parentNode.insertBefore(el, target.nextSibling);

// actually sending the POST now...
chrome.runtime.sendMessage(
  {
    contentScriptQuery: 'POST',
    url: 'https://api.openai.com/v1/completions',
    token: window.localStorage.getItem('ext-gptquery--apikey'),
    body: {
      // ChatGPT API access is highly restricted right now
      //  but we can use a public model
      model: 'text-davinci-003',
      prompt: new URLSearchParams(window.location.search).get('q'),
      max_tokens: 2048,
      temperature: 0,
    }
  }, (res) => {
    if (!res.choices[0].text) {
      console.error(res); // womp womp
      return;
    }

    const target = document.getElementById("ext-gptquery--appbar");
    target.innerHTML = "🎉Query GPT has an answer for you👋<br/>" + res.choices[0].text;
  }
)