async function loadAppeals(useLS) {
  let appeals = [];
  console.log(useLS);
  if (useLS) {
    appeals = localStorage.getItem('appeals') || '[]';
    appeals = JSON.parse(appeals);
  } else {
    // await dbWorker.initializeDatabase(1);
    // appeals = await dbWorker.getAllFromStore('appeals');
    const data = await fetch('http://localhost:3000/api/appeals');
    appeals = await data.json();
  }
  let elementsToAdd = appeals.map(newsItem => {
    return `
    <div class='single-comment'>
        <p class="user-comment">
          ${newsItem.text}
        </p>
        <div class="date-name">
          <h2 class="date">${newsItem.date} ${newsItem.time}</h2>
          <h2 class="username">user.name</h2>
        </div>
    </div>
    `;
  });
  document.getElementById('userCommentHolder').innerHTML = elementsToAdd.join('');
}

document.addEventListener('DOMContentLoaded', function() {
  loadAppeals(USE_LOCAL_STORAGE);
});
