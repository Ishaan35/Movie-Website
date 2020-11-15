const API_KEY = "0f8c600ac4c6d94f453b6d233c2bbcc9";
const spaceInName = "%20";

MovieURL = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&query=" //The%20Conjuring%202"

let MovieID;

let data = undefined;

setPopular();
setTopRated();
setNowPlaying();
setUpcoming();

async function fetchResults(theURL) {
    try {
        const response = await fetch(theURL);
        const json = await response.json();
        const arr = await json.results;
        return arr;
    } catch (error) {
        console.error(error);
    }

}

async function fetchMainPageMovies(theURL) {
    try {
        const response = await fetch(theURL);
        const json = await response.json();
        const arr = await json.results;
        return arr;
    } catch (error) {
        console.error(error);
    }
}


async function createResults(theURL) {
    data = await fetchResults(theURL);

    let images = new Array(); //form the images array separate to make everything cleaner
    let IDs = new Array();

    document.getElementById("Container").setAttribute("style", "opacity:0; -moz-opacity:0; filter:alpha(opacity=0)");


    for (let i = 0; i < data.length; i++) {
        if (data[i].poster_path == null) { //so we can set up an alternate picture later on by using this value
            images[i] = null;
        }
        else
            images[i] = baseURL + size + data[i].poster_path;
    }

    let list = "<ul style='position: relative; left: 3.3%'>"

    let content = document.getElementById('results');
    for (let i = 0; i < data.length; i++) {

        let image;
        //this is to set up an alternate image in case there is no poster
        if (images[i] != null) {
            image = "<img src='" + images[i] + "'width='50' height='72' style='border-radius: 3px; margin-left: 10px; margin-top: 10px ; ' ></img>"
        }
        else {
            image = "<img src='images/empty.png '" + "width='50' height='72' style='border-radius: 3px; margin-left: 10px; margin-top: 10px ; ' ></img>"
        }


        let title = "<p style='margin-left: 85px; margin-top: -70px; position: relative; color: white; font-size: 17.5px; pointer-events: none;'>" + data[i].title + "</p>";
        let year = "<p style='font-size: 13px; color: #c2c2c2; margin-left: 86px; pointer-events: none; position: relative; margin-top: -10px'>" + data[i].release_date.substring(0, 4) + "</p>";

        //movie id
        let id = data[i].id;
        IDs.push(id);
        list += "<li class='resultListItem' value='" + id + "' onclick='loadMovieDetails(value)'> " + image + title + year + "</li > " // the value of the list item will be the movie id, and the movie id will be used to get further details of the movie when clicked

        document.getElementById("ID_results").innerHTML = "Results:"

    }

    list += "</ul>"
    content.innerHTML = list;




}

async function search() {
    let search = document.getElementById('searchBar').value;
    search.replace(" ", "%20");
    let newURL = MovieURL + search;
    createResults(newURL);
}

function loadMovieDetails(movieID) {
    localStorage.setItem("MovieID", movieID);
    localStorage.setItem("baseURL", baseURL);
    window.open('selectedMovieDetails.html');
}

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.code === 13 || e.keyCode === 13) {
        search();
    }
};






async function setPopular() {
    let url = "https://api.themoviedb.org/3/movie/popular?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1"
    let popularMovies = await fetchMainPageMovies(url);



    let container = document.getElementById("Carousel");

    let baseURL = await fetchConfigInfo();

    for (let i = 0; i < popularMovies.length; i++) {
        let item = "<div class='item'>";
        // the id properties are used to represent the actual id of the movie, to give them sort of a tag depending on what movie it is
        let theID = popularMovies[i].id;
        item += "<img src='" + baseURL + size + popularMovies[i].poster_path + "' width='200' class='movieImage' onclick='selectMovie(id)' id='" + theID + "'>";
        item += "<p class='movie-title'>" + popularMovies[i].original_title + "</p>";
        item += "</div>"
        container.innerHTML += item;
    }



    $('#Carousel').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,

    });

}

async function setTopRated() {
    let url = "https://api.themoviedb.org/3/movie/top_rated?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1"
    let topRated = await fetchMainPageMovies(url);

    let container = document.getElementById("Carousel2");
    let baseURL = await fetchConfigInfo();

    for (let i = 0; i < topRated.length; i++) {
        let item = "<div class='item'>"
        let theID = topRated[i].id;

        item += "<img src='" + baseURL + size + topRated[i].poster_path + "' width='200' class='movieImage' onclick='selectMovie(id)' id='" + theID + "'>";
        item += "<p class='movie-title'>" + topRated[i].original_title + "</p>";
        item += "</div>"
        container.innerHTML += item;
    }

    $('#Carousel2').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,

    });


}

async function setNowPlaying() {
    let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1";

    let NowPlaying = await fetchMainPageMovies(url);

    let container = document.getElementById("Carousel3");
    let baseURL = await fetchConfigInfo();

    for (let i = 0; i < NowPlaying.length; i++) {
        let item = "<div class='item'>"
        let theID = NowPlaying[i].id;

        item += "<img src='" + baseURL + size + NowPlaying[i].poster_path + "' width='200' class='movieImage' onclick='selectMovie(id)' id='" + theID + "'>";
        item += "<p class='movie-title'>" + NowPlaying[i].original_title + "</p>";
        item += "</div>"
        container.innerHTML += item;
    }

    $('#Carousel3').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,

    });


}

async function setUpcoming() {
    let url = "https://api.themoviedb.org/3/movie/upcoming?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1"

    let Upcoming = await fetchMainPageMovies(url);

    let container = document.getElementById("Carousel4");
    let baseURL = await fetchConfigInfo();

    for (let i = 0; i < Upcoming.length; i++) {
        let item = "<div class='item'>";
        let theID = Upcoming[i].id;

        item += "<img src='" + baseURL + size + Upcoming[i].poster_path + "' width='200' class='movieImage' onclick='selectMovie(id)' id='" + theID + "'>";
        item += "<p class='movie-title'>" + Upcoming[i].original_title + "</p>";
        item += "</div>"
        container.innerHTML += item;
    }

    $('#Carousel4').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,

    });

}

function selectMovie(id) {
    loadMovieDetails(id);
}