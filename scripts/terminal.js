const URL = 'https://api.github.com/repos/eugenelanets/lanets/commits';
const TEMP_URL = 'http://localhost:3000/commits';
const getUsefulCommitData = ({commit}) => {
  const dateOptions =  {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZoneName: 'short'
  };
  const date = new Intl.DateTimeFormat('ru-RU', dateOptions)
    .format(new Date(commit.author.date))

  return {
    date,
    message: commit.message,
    sha: commit.tree.sha,
  }
};

const getAllCommits = async (url, changeState) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    changeState();
    return result.map(getUsefulCommitData);
  } catch (e) {
    return e;
  }


}

const createLi = (commit) => {
  const li = document.createElement('li');
  li.classList.add('terminal__list-item');

  const firstLine = document.createElement('p');
  firstLine.classList.add('terminal__line');

  const dateNode = document.createElement('datetime');
  dateNode.classList.add('terminal__date');
  dateNode.append(commit.date);

  const shaNode = document.createElement('span');
  shaNode.classList.add('terminal__sha');
  shaNode.append(`${commit.sha.slice(0,7)} `);

  firstLine.append(shaNode, dateNode);

  const commitMessageNode = document.createElement('p');
  commitMessageNode.classList.add('terminal__message', 'terminal__line');
  commitMessageNode.append(commit.message);

  li.append(firstLine, commitMessageNode);
  return li;
}

const createList = (commits) => {
  const ul = document.createElement('ul');
  ul.classList.add('terminal__list');
  ul.append(...commits.map(createLi));

  return ul;
}

const terminal = async (elem, hiddenClass) => {
  const state = {loading: true};
  const toggleLoading = () => state.loading = !state.loading;

  const terminalNode = document.querySelector(elem);
  const loadingNode = terminalNode.querySelector(('.loading'));
  const commitList = await getAllCommits(TEMP_URL, toggleLoading);
  const commitsNode = createList(commitList);

  const render = () => {
    if (!state.loading) {
      loadingNode.classList.add(hiddenClass);
      terminalNode.append(commitsNode);
    } else {
      loadingNode.classList.remove(hiddenClass);
    }
  }

  render();
}

terminal('.terminal', 'loading_hidden');


