const API_KEY = 'AIzaSyA3jettFRrAFXpNzQdtjHSOwutBxhVr9MQ';
//const API_KEY = 'IzaSyA3jettFRrAFXpNzQdtjHSOwutBxhVr9MQ';
const API_KEY2='AIzaSyBNPWB3flCC3ld3AKO-k4enmIcpPuQx3uk';
const API_KEY3='AIzaSyBNPWB3flCC3ld3AKO-k4enmIcpPuQx3uk';
const API_KEY4='AIzaSyCOmcLIaJw-iE2aum2Pyel-ILXIRvhy_DA';
const API_KEYS=[
    'AIzaSyA3jettFRrAFXpNzQdtjHSOwutBxhVr9MQ',
    'AIzaSyBNPWB3flCC3ld3AKO-k4enmIcpPuQx3uk',
    'AIzaSyDRuj1dmBIfBBIZKACktYFxUZmwsYVMUkg',
    'AIzaSyCOmcLIaJw-iE2aum2Pyel-ILXIRvhy_DA',
    'AIzaSyCL_uIu8NqKf_qwsgRPspjxVPGZ4Ir0huI',
];
const MAX_RESULTS = 25;
let nextPageToken = '';
let currentKeyIndex=0;

function createInterestSection(interest) {
    const section = document.createElement('div');
    section.className = 'interest-section';
    section.innerHTML = `
        <h2>${interest}</h2>
        <div class="video-list" id="${interest}-videos"></div>
        <button class="load-more-btn" onclick="loadMoreVideos('${interest}')">Load More</button>
    `;
    document.getElementById('main-content').innerHTML = ''; // Clear existing content
    document.getElementById('main-content').appendChild(section);
}

function fetchVideos(interest, pageToken = '', isSearch = false) {
    if (currentKeyIndex >= API_KEYS.length) {
        console.error('All API keys failed.');
        return;
    }

    const apiKey = API_KEYS[currentKeyIndex];
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', () => {
        gapi.client.youtube.search.list({
            part: 'snippet',
            q: interest,
            maxResults: MAX_RESULTS,
            pageToken: pageToken,
            type: 'video'
        }).then(response => {
            const videoListId = isSearch ? 'search-results' : `${interest}-videos`;
            const videoList = document.getElementById(videoListId);

            if (response.result.items.length === 0) {
                if (pageToken === '') {
                    videoList.innerHTML = '<p>No results found.</p>';
                }
                return;
            }

            if (pageToken === '') {
                // Clear previous results only if it's the first load
                videoList.innerHTML = '';
            }

            response.result.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.high.url;
                const channelTitle = item.snippet.channelTitle;
                const publishedAt = item.snippet.publishedAt;

                const videoCard = `
                    <div class="video-card" onclick="location.href='videoview.html?videoId=${videoId}&interest=${interest}'">
                        <img src="${thumbnail}" alt="Video Thumbnail">
                        <div class="video-info">
                            <h4>${title}</h4>
                            <p>${channelTitle} • ${new Date(publishedAt).toDateString()}</p>
                        </div>
                    </div>
                `;
                videoList.innerHTML += videoCard;
            });

            // Store the nextPageToken
            nextPageToken = response.result.nextPageToken;

            // Update the button to load more
            const loadMoreButton = videoList.parentElement.querySelector('.load-more-btn');
            if (nextPageToken) {
                loadMoreButton.style.display = 'block'; // Show button
            } else {
                loadMoreButton.style.display = 'none'; // Hide button
            }

        }).catch(error => {
            console.error(`API Key ${apiKey} failed: ${error.message}`);
            currentKeyIndex += 1; // Move to the next API key
            fetchVideos(interest, pageToken, isSearch); // Retry with the next key
        });
    });
}
function loadMoreVideos(interest, isSearch = false) {
    fetchVideos(interest, nextPageToken, isSearch);
}

function searchVideos() {
    const query = document.getElementById('search-input').value;
    const searchContent = document.getElementById('search-content');
    searchContent.innerHTML = `
        <div class="interest-section">
            <h2>Search Results for "${query}"</h2>
            <div class="video-list" id="search-results"></div>
            <button class="load-more-btn" onclick="loadMoreVideos('${query}', true)">Load More</button>
        </div>
    `;
    showContent('search');
    fetchVideos(query, '', true);
}

function loadInterest(interest) {
    showContent('main');
    createInterestSection(interest);
    fetchVideos(interest);
}

function showContent(contentId) {
    const mainContent = document.getElementById('main-content');
    const searchContent = document.getElementById('search-content');
    if (contentId === 'search') {
        mainContent.style.display = 'none';
        searchContent.style.display = 'block';
    } else {
        mainContent.style.display = 'block';
        searchContent.style.display = 'none';
    }
}

function init() {
    gapi.load('client', () => {
        // Initial load with a default interest or empty state
        loadInterest('Technology');
        updateUserInterface();
    });
    
} 
function getQueryStringParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
function updateUserInterface() {
    // Function to get the query string parameter value by name
   

    const email = getQueryStringParameter('email');

    if (email) {
        // User is signed in, show the logo
        document.getElementById('emailLogo').style.display = 'block';
        document.getElementById('emailLogo').textContent = email.charAt(0).toUpperCase();
        document.getElementById('signInButton').style.display = 'none';
        document.getElementById('signUpButton').style.display = 'none';
        //document.getElementById('dropdown').style.display = 'block';
    } else {
        // User is not signed in, show Sign In and Sign Up buttons
        document.getElementById('signInButton').style.display = 'block';
        document.getElementById('signUpButton').style.display = 'block';
        document.getElementById('emailLogo').style.display = 'none';
    }
}
function toggleDropdown() {
    const email = getQueryStringParameter('email');
    var dropdown = document.getElementById("dropdown");
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
         document.getElementById('email').textContent=email;
    } else {
        dropdown.style.display = "none";
    }
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var closeButton = sidebar.querySelector(".close");

    // Toggle the 'show' class on the sidebar to open/close it
    sidebar.classList.toggle("show");

    // Hide or show the close button based on whether the sidebar is open
    closeButton.style.display = sidebar.classList.contains("show") ? "none" : "block";
}




window.onload = init;
