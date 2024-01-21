const apiUrl = 'https://api.github.com/users/';
const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let currentPage = '';
let perPage = perPageOptions[0];
let searchTerm = '';
let username="";

function getUserName(){
    const userName = prompt('Enter GitHub username:');
    username=userName; 
    //username="johnpapa"
}
getUserName();


document.addEventListener('DOMContentLoaded', () => {
    fetchRepositories();
    displayPagination();
    perPageDetails();  
    displayUserDetails();   
});


function fetchRepositories() {
    document.getElementById('loadingIndicator').classList.toggle('hidden');
    document.getElementById('repositoriesList').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';
    document.getElementById('perpagedetails').innerHTML=''; 

   const requestUrl=`${apiUrl}${username}/repos?page=${currentPage}&per_page=${perPage}&q=${searchTerm}`
    //console.log(requestUrl)
    const doNetworkCall = async () => {
        const response = await fetch(requestUrl);
        const jsonData = await response.json();
        console.log(jsonData)
        displayRepositories(jsonData);
    };
    doNetworkCall()
}


function displayRepositories(repositories) {
    document.getElementById('loadingIndicator').classList.toggle('hidden');
    const repositoriesList = document.getElementById('repositoriesList');
    repositories.forEach(repo => {
        const userRepo=document.createElement('div')   
        userRepo.classList.add('repo-details')
        repositoriesList.appendChild(userRepo)
        
        const name=document.createElement('h1')
        name.textContent=repo.full_name
        name.classList.add("git-user-name")
        userRepo.appendChild(name);

        const descrip=document.createElement('p');
        descrip.textContent=repo.description
        userRepo.appendChild(descrip)

        const topic=document.createElement('div')
        if(repo.topics.length>0){
            repo.topics.forEach(eachTopic=>{
                const everyTopic=document.createElement('p')
                everyTopic.textContent=eachTopic 
                everyTopic.classList.add('topic-deta')
                topic.appendChild(everyTopic)
                topic.classList.add('topic')
            })
        }
        else{
            topic.textContent="There are no Topics for this user"
            topic.classList.add('no-topic')
        }
        userRepo.appendChild(topic)
        //repositoriesList.innerHTML += `<div>${repo.name}</div>`;
    });
}



function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML += `<span>Page: </span>`;
    for (let i = 1; i <= 10; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            changePage(i);
        });
        pagination.appendChild(button);
    }
}
function changePage(newPage) {
    currentPage = newPage;
    //console.log(currentPage)
    fetchRepositories();
    displayPagination();
    perPageDetails();
}


function perPageDetails(){
    //console.log("Manoj")
    const perpagedetails = document.getElementById('perpagedetails');
    perpagedetails.innerHTML += `<span>Show per page: </span>`;
    const perPageSelect = document.createElement('select');
    perPageSelect.id = 'perPageSelect';
    perPageOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        optionElement.selected = option === perPage;
        perPageSelect.appendChild(optionElement);
    });
    perPageSelect.addEventListener('change', () => {
        perPage = parseInt(perPageSelect.value);
        fetchRepositories();
        displayPagination();
        perPageDetails();
    });
    perpagedetails.appendChild(perPageSelect);
}


function displayUserDetails(jsonData){
    const gitUserName=document.getElementById('git-username')
    gitUserName.textContent=username

    const gitUrl=document.getElementById('git-url')
    gitUrl.textContent=`${apiUrl}${username}`;

}

function searchRepositories() {
    searchTerm = document.getElementById('searchInput').value;
    fetchRepositories();
    displayPagination();
    perPageDetails();
}
