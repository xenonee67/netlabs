// using my api key

const API_KEY = "9a95e607";

// declaring arrays

let movies = []; // for when i search the movies
let library = JSON.parse(localStorage.getItem("movieLibrary")) || []; //for displaying the library and saving it in the local storage of the browser


// getting html elements
const searchInput = document.getElementById("search-input");
const movieContainer = document.getElementById("movie-container");
const libraryContainer = document.getElementById("library-container");
const movieModal = document.getElementById("movie-modal");
const movieDetails = document.getElementById("movie-details");



// searching any movies takes information from omdb and displays the movies 

function searchMovies(query) {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
        .then(response => response.json())
        .then(data => {
            movies = data.Search || [];
            displayMovies();
        });
}

//to add any movie to my library when clicking checks the id if its already there it doesnt create any duplicates and pushes them into let library = []

function addToLibrary(id) {

    const movie = movies.find(function(movie) {
        return movie.imdbID === id;
    });

    const alreadyAdded = library.some(function(movie) {
        return movie.imdbID === id;
    });

    if (alreadyAdded) {
        return;
    }

    library.push(movie);

    localStorage.setItem("movieLibrary", JSON.stringify(library));

    displayLibrary();
    displayMovies();
}

// after adding movies to the library makes them display in the my library section with the movie poster, title, year, and also a button to remove from the library

function displayLibrary() {
    libraryContainer.innerHTML = "";

    library.forEach(function(movie) {

        libraryContainer.innerHTML += 
        `
            <div class="movie-card">

                <img src="${movie.Poster}" alt="${movie.Title}">

                <div class="movie-card-content">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>

                    <button class="remove-btn" onclick="removeFromLibrary('${movie.imdbID}')">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                    </button>

                </div>

            </div>
        `;

    });
}

//to remove from the library checks the id and updates the library if id = not in the library then it removes and normally displays the other 

function removeFromLibrary(id) {

    library = library.filter(function(movie) {
        return movie.imdbID !== id;
    });

    localStorage.setItem("movieLibrary", JSON.stringify(library));

    displayLibrary();
    displayMovies();
}

// after searching for the movies it display the movie name title poster and year with a button to show add to library

function displayMovies() {
    movieContainer.innerHTML = "";

    movies.forEach(function (movie) {

        movieContainer.innerHTML += `
            <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">

                <img src="${movie.Poster}" alt="${movie.Title}">

                <div class="movie-card-content">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>

                    <button class="library-btn" onclick="addToLibrary('${movie.imdbID}')">
                    <i class="fa-solid fa-bookmark"></i>
                    ${library.some(function(savedMovie) {
                     return savedMovie.imdbID === movie.imdbID;
                     }) ? "Added" : "Add to My Library"}
                    </button>
                </div>

            </div>
        `;

    });
}

// when clicking any movie it shows even more details this time using different search input from the api

function showMovieDetails(id) {

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
        .then(response => response.json())
        .then(data => {

            movieDetails.innerHTML = `
                <img src="${data.Poster}" alt="${data.Title}">

                <div class="movie-info">

                    <h2>${data.Title}</h2>

                    <p>${data.Year} • ${data.Runtime}</p>

                    <p>⭐ ${data.imdbRating} / 10</p>

                    <p><strong>Genre:</strong> ${data.Genre}</p>

                    <p><strong>Director:</strong> ${data.Director}</p>

                    <p><strong>Actors:</strong> ${data.Actors}</p>

                    <p>${data.Plot}</p>

                </div>
            `;

            movieModal.classList.add("active");
        });

}

// after clicking the close it closes the movie
function closeMovieDetails() {
    movieModal.classList.remove("active");
}

// when clicking enter it shows the movie
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const query = searchInput.value;

        if (query !== "") {
            searchMovies(query);
        }

    }

});

displayLibrary();