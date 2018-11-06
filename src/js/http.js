export default class Http {

  constructor(params) {
    this.baseUrl = 'http://localhost:80/camp1/mblocks/db';
  };

  ajaxRequest(method, url, sendData = null) {
    return new Promise( (resolve, reject) => {
      const req = new XMLHttpRequest();
      if (( method === 'GET' ) && !( sendData === null)) {
        url = `${url}?jsonData=${JSON.stringify(sendData)}`;
      }
      console.log(`ajaxRequest, method=${method}, url=${url}`);
      req.open(method, url, true);
      req.addEventListener('load', () => {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          var error = new Error(req.statusText);
          error.code = req.status;
          reject(error);
        }
      }, false);
      req.addEventListener('error', () => {
        reject(new Error("Network Error"));
      }, false);
      if (( method === 'POST' ) && !( sendData === null ))  {
        req.send(`jsonData=${JSON.stringify(sendData)}`);
        console.log(`sendData = ${JSON.stringify(sendData)}`);
      } else {
        req.send();
      }
    });
  }

  loadResources(script, eventName) {
    this.ajaxRequest('GET', `${this.baseUrl}/${script}`)
      .then(
        respValue => {
          const allResourse = JSON.parse(respValue);
          console.log(`Request is fulfilled: ${script}`);
          const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: allResourse
          });
          document.dispatchEvent(event);
        },
        reason => {
          console.log(`Rejected: ${reason}`);
        }
      );
  }

  loadAllResults() {
    this.loadResources('readresults.php', 'resultsAreLoaded');
  }

  loadAllUsers() {
    this.loadResources('readusers.php', 'usersAreLoaded');
  }

  saveResult(sendData) {
    this.ajaxRequest('GET', `${this.baseUrl}/saveresult.php`, sendData)
      .then(
        respValue => {
          console.log(`Response = ${respValue}`);
          const resultsAreSavedEvent = new CustomEvent("resultsAreSaved", {
            bubbles: true,
            detail: respValue
          });
          document.dispatchEvent(resultsAreSavedEvent);
         },
        reason => {
          console.log(`Rejected: ${reason}`);
        }
      );
  }
}
