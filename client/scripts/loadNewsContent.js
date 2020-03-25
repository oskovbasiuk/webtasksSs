document.addEventListener('DOMContentLoaded', function() {
  loadNews(USE_LOCAL_STORAGE);
});
async function loadNews(useLS) {
  let news = [];
  if (useLS) {
    news = localStorage.getItem('news') || '[]';
    news = JSON.parse(news);
  } else {
    // await dbWorker.initializeDatabase(1);
    // news = await dbWorker.getAllFromStore('news');
    const data = await fetch('http://localhost:3000/api/news');
    news = await data.json();
  }
  let elementsToAdd = news.map(newsItem => {
    return `
    <div class='news-item'>
          <div class="img-holder">
            <img
              class="news-img"
              src="${newsItem.img}"
              alt=""
            />
          </div>
          <h2 class="news-header">${newsItem.header}</h2>
          <p class="news-paragraph">
            ${newsItem.body}
          </p>
    </div>
    `;
  });
  document.getElementById('news-holder').innerHTML = elementsToAdd.join('');
}
