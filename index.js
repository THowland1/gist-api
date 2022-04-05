let gistId = "4d75b5203bc3cc08c1f483d4cb230b8a";

/** @type {HTMLPreElement} */
const response = document.getElementById('response');
/** @type {HTMLElement} */
const spinner = document.getElementById('spinner');
/** @type {HTMLElement} */
const curlEl = document.getElementById('curl');

/** @type {HTMLElement} */ const skipChipEl = document.getElementById('skip-chip');
/** @type {HTMLElement} */ const topChipEl = document.getElementById('top-chip');
/** @type {HTMLElement} */ const sortbyChipEl = document.getElementById('sortby-chip');
/** @type {HTMLElement} */ const sortdirectionChipEl = document.getElementById('sortdirection-chip');

/** @type {HTMLElement} */ const authChipEl = document.getElementById('auth-chip');

/** @type {HTMLSpanElement} */ const gistIdControl = document.getElementById('gist-id-control');
/** @type {HTMLSelectElement} */ const sortdirectionControl = document.getElementById('sortdirection-control');

let skip = 0;
let ttop = 2;
let sortby = '';
let sortdirection = 'asc';
let authToken = '';
let showSkip = false;
let showTop = true;
let showSortby = false;
let showSortdirection = false;
let showAuthToken = false;

gistIdControl.innerText = gistId;

gistIdControl.addEventListener('keypress', function (evt) {
  swallowWhitespace(evt);
  /** @type {HTMLElement} */ const el = evt.target;
  gistId = el.innerText;
  getGist();
});
gistIdControl.addEventListener('keyup', function (evt) {
  /** @type {HTMLElement} */ const el = evt.target;
  if (el.innerHTML !== el.innerText) {
    el.innerHTML = el.innerText;
  }
  gistId = el.innerText;
  getGist();
});

function nobubble(/** @type {MouseEvent} */ evt) {
  evt.cancelBubble = true;
}

sortdirectionControl.addEventListener('change', function () {
  setSortdirection(this.value);
});

authChipEl.addEventListener('click', function () {
  showAuthToken = !showAuthToken;
  if (showAuthToken) {
    this.dataset.active = '';
  } else {
    delete this.dataset.active;
  }
  getGist();
});
skipChipEl.addEventListener('click', function () {
  showSkip = !showSkip;
  if (showSkip) {
    this.dataset.active = '';
  } else {
    delete this.dataset.active;
  }
  getGist();
});
topChipEl.addEventListener('click', function () {
  showTop = !showTop;
  if (showTop) {
    this.dataset.active = '';
  } else {
    delete this.dataset.active;
  }
  getGist();
});
sortbyChipEl.addEventListener('click', function () {
  showSortby = !showSortby;
  if (showSortby) {
    this.dataset.active = '';
  } else {
    delete this.dataset.active;
  }
  getGist();
});
sortdirectionChipEl.addEventListener('click', function () {
  showSortdirection = !showSortdirection;
  if (showSortdirection) {
    this.dataset.active = '';
  } else {
    delete this.dataset.active;
  }
  getGist();
});

function setSkip(newSkip) { skip = newSkip; getGist(); }
function setTop(newTop) { ttop = newTop; getGist(); }
function setSortby(newSortby) { sortby = newSortby; getGist(); }
function setSortdirection(newSortdirection) { sortdirection = newSortdirection; getGist(); }
function setAuthToken(newAuthToken) { authToken = newAuthToken; getGist(); }
function textKeyup(evt, currentValue, setValue) {
  /** @type {HTMLElement} */ const target = evt.target;
  const value = target.innerText;
  const cleanValue = value.replace(/[\n\r\s]+/g, '');
  if (value !== cleanValue) {
    target.innerText = cleanValue;
  }
  setValue(cleanValue);
}
function swallowWhitespace(/** @type {KeyboardEvent} */ evt) {
  switch (evt.key) {
    case ' ':
    case 'Enter':
      evt.preventDefault();
      break;
  }
}
function numberKeyup(evt, currentValue, setValue) {
  /** @type {HTMLElement} */ const target = evt.target;
  const value = Number.parseInt(target.innerText);
  const cleanValue = value >= 0 ? value : 0;
  if (value !== cleanValue) {
    target.innerText = cleanValue;
  }
  setValue(cleanValue);
}

function numberKeydown(/** @type {KeyboardEvent} */ evt, currentValue, setValue) {
  /** @type {HTMLElement} */ const target = evt.target;
  switch (evt.key) {
    case 'ArrowUp':
      evt.preventDefault();
      const newValue = currentValue + 1;
      setValue(newValue);
      target.innerText = newValue;
      break;
    case 'ArrowDown':
      evt.preventDefault();
      if (currentValue > 0) {
        const newValue = currentValue - 1;
        setValue(newValue);
        target.innerText = newValue;
      };
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Backspace':
    case 'Tab':
      break;
    default:
      if (isNaN(Number(evt.key))) {
        evt.preventDefault();
      }
      break;
  }
}

function foop(/** @type {HTMLElement} */ el, newGistId) {
  document.querySelectorAll('[data-gistid]').forEach(o => {
    delete o.dataset.active;
  });
  el.dataset.active = '';
  gistId = newGistId;
  getGist();
}

function getUrl() {
  const url = new URL(`https://gist-api.tomhowland.com/v1/${gistId}`);
  const params = url.searchParams;
  if (showSkip) { params.append('skip', skip); }
  if (showTop) { params.append('top', ttop); }
  if (showSortby) { params.append('sortby', sortby); }
  if (showSortdirection) { params.append('sortdirection', sortdirection); }
  return url.toString();
}

let timeout = window.setTimeout(() => { }, 0);
async function getGist() {
  response.style.opacity = 0;
  spinner.style.opacity = 1;
  const url = getUrl();
  curlEl.innerHTML = '<span class="red">curl</span> \\';
  curlEl.innerHTML += showAuthToken ? `\n  -H "Authorization: Bearer ${authToken}"` : '';
  curlEl.innerHTML += `\n  "${url}"`;

  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    try {
      const ddd = await fetch(
        url,
        {
          headers: showAuthToken ? new Headers({
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${authToken}`,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
          }) : undefined
        });
      if (!ddd.ok) {
        const err = await ddd.text();
        throw new Error(err);
      }
      const dddd = await ddd.json();
      response.style.opacity = 01;
      spinner.style.opacity = 0;
      response.innerHTML = JSON.stringify(dddd, null, 2);

    } catch (error) {
      response.style.opacity = 01;
      spinner.style.opacity = 0;
      if (error instanceof Error) {
        response.innerHTML = `<span class="red">${error.message}</span>`;
      }
    }
  }, 200);
}

getGist();