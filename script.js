const API_KEY = "ccfa4bc49c32432ebea0ce0d183afe71";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    const randomTopic = getRandomTopic();
    fetchNews(randomTopic);
    setInterval(() => {
        const randomTopic = getRandomTopic();
        fetchNews(randomTopic);
    }, 60000); 
});

function getRandomTopic() {
    const topics = ["India", "movie", "music", "environment","artificial intelligence","banks","cars"];
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}



function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        console.log(data); // Log the response to inspect the structure
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    if (articles && articles.length > 0) {
        articles.forEach((article) => {
            if (!article.urlToImage) return;
            const cardClone = newsCardTemplate.content.cloneNode(true);
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
    } else {
        // Handle the case where articles is undefined or empty
        console.warn('No articles to display.');
    }
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}



let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
})

async function subscribeNewsletter() {
    const emailInput = prompt('Enter your email:');

    if (!emailInput) {
        return;
    }

    try {
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput }),
        });

        const data = await res.json();

        if (data.success) {
            alert('Subscription successful!');
        } else {
            alert(`Subscription failed: ${data.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during subscription.');
    }
}
async function subscribeNewsletter() {
    const emailInput = prompt('Enter your email:');

    if (!emailInput) {
        return;
    }

    try {
        console.log('Attempting to subscribe with email:', emailInput);

        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailInput }),
        })

        if (!res.ok) {
            
            console.error('Subscription request failed:', res.statusText);
            alert('Subscription request failed. Please try again.');
            return;
        }

        const data = await res.json();

        console.log('Subscription response:', data);

        if (data.success) {
            alert('Subscription successful!');
        } else {
            alert(`Subscription failed: ${data.message}`);
        }
    } catch (error) {
        console.error('An error occurred during subscription:', error);
        alert('An error occurred during subscription.');
    }
}