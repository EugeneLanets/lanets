const URL = 'https://api.github.com/repos/eugenelanets/lanets/commits';
const getUsefulCommitData = ({commit}) => ({
  date: commit.author.date,
  message: commit.message,
  sha: commit.tree.sha,
});

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
  li.append(`${commit.date} ${commit.message}`);
  return li;
}

const createList = (commits) => {
  const ul = document.createElement('ul');
  ul.append(...commits.map(createLi));

  return ul;
}

const terminal = async (elem, hiddenClass) => {
  const state = {loading: true};
  const toggleLoading = () => state.loading = !state.loading;

  const terminalNode = document.querySelector(elem);
  const loadingNode = terminalNode.querySelector(('.loading'));
  const commitList = await getAllCommits(URL, toggleLoading);
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


