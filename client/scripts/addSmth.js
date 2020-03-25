const isOnline = () => {
  return window.navigator.onLine;
};

const popup = {
  good: {
    text: 'Item is succesfully added',
    color: '#ff0',
    timeout: 1500
  },
  bad: {
    text: 'Item will be added when you will restore internet connection',
    color: '#f33',
    timeout: 2500
  },
  connectionRestored: {
    text: 'Connection restored and all items are added!',
    color: '#ff0',
    timeout: 2500,
    display: false
  }
};

const checkFieldLength = (field, minLen, maxLen) => {
  let isValid = false;
  const fieldTrimmed = field.value.trim();
  const whitespaces = [...fieldTrimmed.matchAll(/\s{2,}/g)];
  const wpLength = whitespaces.reduce((accum, currElem) => {
    return accum + currElem[0].length;
  }, 0);
  const realFieldLength = fieldTrimmed.length - (wpLength - whitespaces.length);
  if (realFieldLength < minLen || realFieldLength > maxLen) {
    field.classList.add('not-valid');
    field.setCustomValidity(
      `This field length should be betwwen ${minLen} and ${maxLen} symbols long`
    );
    field.reportValidity();
    isValid = false;
  } else {
    field.setCustomValidity('');
    field.classList.remove('not-valid');
    isValid = true;
  }
  return isValid;
};
const symbolsCheck = field => {
  let isValid = false;
  const scanRes = [...field.value.trim().matchAll(/[#^*_<>]/g)];
  if (scanRes.length > 0) {
    field.classList.add('not-valid');
    field.setCustomValidity(`This field shouldn't contain # ^ * _ < > symbols`);
    field.reportValidity();
    isValid = false;
  } else {
    field.setCustomValidity('');
    field.classList.remove('not-valid');
    isValid = true;
  }

  return isValid;
};
const twoDigits = num => (((num / 10) ^ 0) == 0 ? '0' + num : num);

document.addEventListener('DOMContentLoaded', () => {
  checkIfNotEmptyAfterOffline();

  async function checkIfNotEmptyAfterOffline() {
    let fansArray = localStorage.getItem('appendFans');
    let newsArray = localStorage.getItem('appendNews');

    if (isOnline() && fansArray) {
      fansArray = JSON.parse(fansArray);
      let appeals = [];

      if (USE_LOCAL_STORAGE) {
        appeals = localStorage.getItem('appeals') || '[]';
        appeals = JSON.parse(appeals);
        fansArray.forEach(item => {
          appeals.push(item);
        });
        localStorage.setItem('appeals', JSON.stringify(appeals));
      } else {
        // await dbWorker.initializeDatabase(1);
        fansArray.forEach(appeal => {
          // dbWorker.addToStore('appeals', appeal);
          fetch('http://localhost:3000/api/appeals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(appeal)
          });
        });
      }
      loadAppeals(USE_LOCAL_STORAGE);

      popup.connectionRestored.display = true;
      localStorage.removeItem('appendFans');
    }

    if (isOnline() && newsArray) {
      newsArray = JSON.parse(newsArray);
      let news = [];
      if (USE_LOCAL_STORAGE) {
        news = localStorage.getItem('news') || '[]';
        news = JSON.parse(news);
        newsArray.forEach(item => {
          news.push(item);
        });
        localStorage.setItem('news', JSON.stringify(news));
      } else {
        // await dbWorker.initializeDatabase(1);
        newsArray.forEach(newsItem => {
          // dbWorker.addToStore('news', newsItem);
          fetch('http://localhost:3000/api/news', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newsItem)
          });
        });
      }
      popup.connectionRestored.display = true;
      localStorage.removeItem('appendNews');
    }

    if (popup.connectionRestored.display) {
      showPopup(popup.connectionRestored);
      popup.connectionRestored.display = false;
    }
  }

  window.addEventListener('online', checkIfNotEmptyAfterOffline);

  if (document.getElementById('addFanAppealForm')) {
    const appealForm = document.getElementById('addFanAppealForm');
    const appealTextField = document.getElementById('appealText');
    appealForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      if (checkFieldLength(appealTextField, 16, 320)) {
        const { value } = document.getElementById('appealText');

        let date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${twoDigits(hours)}:${twoDigits(minutes)}`;

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        date = `${twoDigits(day)}.${twoDigits(month)}.${year}`;

        let appeals = [];

        if (USE_LOCAL_STORAGE) {
          appeals = localStorage.getItem('appeals') || '[]';
          appeals = JSON.parse(appeals);
        } else {
          // await dbWorker.initializeDatabase(1);
          // appeals = await dbWorker.getAllFromStore('appeals');
        }

        if (isOnline()) {
          appeals.push({ text: value, date, time });
          if (USE_LOCAL_STORAGE) {
            localStorage.setItem('appeals', JSON.stringify(appeals));
          } else {
            // dbWorker.addToStore('appeals', {
            //   text: value,
            //   date,
            //   time
            // });
            const appeal = {
              text: value,
              date,
              time
            };
            fetch('http://localhost:3000/api/appeals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(appeal)
            });
          }

          loadAppeals(USE_LOCAL_STORAGE);
          showPopup(popup.good);
        } else {
          let fansArray = localStorage.getItem('appendFans') || '[]';
          fansArray = JSON.parse(fansArray);
          console.log(fansArray);

          fansArray.push({ text: value, date, time });

          localStorage.setItem('appendFans', JSON.stringify(fansArray));
          showPopup(popup.bad);
        }
        appealTextField.value = '';
      } else {
        console.log('form invalid');
      }
    });

    appealTextField.addEventListener('focus', function() {
      checkFieldLength(this, 16, 320);
    });

    appealTextField.addEventListener('change', function() {
      checkFieldLength(this, 16, 320);
    });

    appealTextField.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }

  if (document.getElementById('addNewsForm')) {
    const addNewsForm = document.getElementById('addNewsForm');
    const newsHeaderField = document.getElementById('newsHeader');
    const newsBodyField = document.getElementById('newsBody');
    const imgPreview = document.getElementById('imgToAdd');

    document.getElementById('photo').addEventListener('change', function(event) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onloadend = function() {
        imgPreview.src = reader.result;
        console.log(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        imgPreview.src = '';
      }
    });

    addNewsForm.addEventListener('submit', async event => {
      event.preventDefault();

      if (
        checkFieldLength(newsHeaderField, 8, 64) &&
        symbolsCheck(newsHeaderField) &&
        checkFieldLength(newsBodyField, 25, 255)
      ) {
        let news = localStorage.getItem('news') || '[]';
        news = JSON.parse(news);

        if (isOnline()) {
          news.push({
            header: newsHeaderField.value,
            body: newsBodyField.value,
            img: imgPreview.src
          });
          if (USE_LOCAL_STORAGE) {
            localStorage.setItem('news', JSON.stringify(news));
          } else {
            // await dbWorker.initializeDatabase(1);
            // dbWorker.addToStore('news', {
            //   header: newsHeaderField.value,
            //   body: newsBodyField.value,
            //   img: imgPreview.src
            // });
            const news = {
              header: newsHeaderField.value,
              body: newsBodyField.value,
              img: imgPreview.src
            };
            fetch('http://localhost:3000/api/news', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(news)
            });
          }

          showPopup(popup.good);
        } else {
          let newsArray = localStorage.getItem('appendNews') || '[]';
          newsArray = JSON.parse(newsArray);

          newsArray.push({
            header: newsHeaderField.value,
            body: newsBodyField.value,
            img: imgPreview.src
          });

          localStorage.setItem('appendNews', JSON.stringify(newsArray));

          showPopup(popup.bad);
        }
        imgPreview.src = 'content/img/NAVI_logoMain.png';
        newsHeaderField.value = newsBodyField.value = '';
      }
    });

    newsHeaderField.addEventListener('focus', function() {
      checkFieldLength(this, 8, 64) && symbolsCheck(this);
    });

    newsHeaderField.addEventListener('change', function() {
      checkFieldLength(this, 8, 64) && symbolsCheck(this);
    });

    newsHeaderField.addEventListener('input', function() {
      this.setCustomValidity('');
      symbolsCheck(this);
    });

    newsBodyField.addEventListener('focus', function() {
      checkFieldLength(this, 25, 255);
    });

    newsBodyField.addEventListener('change', function() {
      checkFieldLength(this, 25, 255);
    });

    newsBodyField.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  }
});
