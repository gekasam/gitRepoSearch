console.clear();

let search = document.querySelector('.search');
let list = document.querySelector('.list');
let retrieved = document.querySelector('.retrieved');
let repo = document.querySelector('.repo');

function debounce(fn) {
  let timer;

  return function (event) {
    clearInterval(timer);
    timer = setTimeout(() => {
      fn(event);
    }, 2000);
  };
}

function inputHandler(event) {
  let searchKey = event.target.value;
  if (searchKey && !/^\s+$/.test(searchKey)) {
    const url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', searchKey);
    url.searchParams.set('per_page', 5);
    fetch(url)
      .then((response) => response.json())
      .then((response) => resultRender(response.items))
      .catch((error) => error);
  } else {
    retrieved.innerHTML = '';
  }
}

function resultRender(items) {
  let fragment = new DocumentFragment();
  console.log(items);
  retrieved.innerHTML = '';
  items.forEach((element) => {
    let option = document.createElement('button');
    option.classList.add('option');
    option.textContent = element.name;
    option.dataset.name = `${element.name}`;
    option.dataset.owner = `${element.owner.login}`;
    option.dataset.stars = `${element.stargazers_count}`;
    fragment.append(option);
  });

  retrieved.append(fragment);

  return items;
}

function addRepo(event) {
  if (event.target.className === 'option') {
    let repoInfo = event.target.dataset;
    let repo = document.createElement('li');
    repo.classList.add('repo');
    for (let key in repoInfo) {
      let fieldInfo = document.createElement('div');
      fieldInfo.classList.add('field');
      let typeInfo = document.createElement('span');
      let info = document.createElement('span');
      typeInfo.textContent = `${key.charAt(0).toUpperCase()}${key.slice(1)}: `;
      info.textContent = repoInfo[key];
      fieldInfo.append(typeInfo);
      fieldInfo.append(info);
      repo.append(fieldInfo);
    }
    let remove = document.createElement('button');
    remove.classList.add('remove');
    remove.textContent = 'X';
    repo.append(remove);
    list.append(repo);
    retrieved.innerHTML = '';
    search.value = '';
    console.dir(search);
    console.log(repoInfo);
  }
}

function removeHandler(event) {
  if (event.target.className === 'remove') {
    event.target.parentElement.remove();
  }
}

search.addEventListener('input', debounce(inputHandler));
retrieved.addEventListener('click', addRepo);
list.addEventListener('click', removeHandler);
