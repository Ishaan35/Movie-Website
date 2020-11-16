

let MovieID = localStorage.getItem("MovieID");
console.log(MovieID);
let ThebaseURL = localStorage.getItem("baseURL"); //this is the base for the poster urls

//urls
let detailsURL = "https://api.themoviedb.org/3/movie/" + MovieID + "?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";
let TrailerURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/videos?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";
let CreditsURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/credits?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";
let similarMoviesURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/similar?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";
let genresURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";
let reviewsURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/reviews?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1";


let plotURL;


//similar movies
let similarMoviesArr = [];


let movieDetailsObject = {
    title: "",
    releaseDate: "",
    voteAverage: 0,
    voteCount: 0,
    genres: [],
    overview: "",
    posterpath: "",
    tagline: "",
    originalLanguage: "",
    productionCountries: [],
    productionCompanies: [],
    revenue: 0,
    budget: 0,
    IMDB_ID: ""
}
let moreMovieDetailsObject = {
    rating: "",
    director: "",
    plot: "",
    production: "",
    runtime: "",
    awards: "",
    writers: ""
}



async function fetchMovieDetails() {
    try {
        const response = await fetch(detailsURL);
        const json = await response.json();
        //set
        movieDetailsObject.title = json.title;//
        movieDetailsObject.releaseDate = json.release_date.substring(0, 4);//
        movieDetailsObject.voteAverage = json.vote_average;//
        movieDetailsObject.voteCount = json.vote_count;//
        movieDetailsObject.genres = json.genres; //needs to be filtered out to get the name only
        movieDetailsObject.overview = json.overview;//
        movieDetailsObject.posterpath += json.poster_path;//
        movieDetailsObject.tagline = json.tagline;//
        movieDetailsObject.originalLanguage = json.original_language; //
        movieDetailsObject.productionCountries = json.production_countries;//
        movieDetailsObject.productionCompanies = json.production_companies;//
        movieDetailsObject.revenue = json.revenue;//
        movieDetailsObject.budget = json.budget;//
        movieDetailsObject.IMDB_ID = json.imdb_id;//
    } catch (error) {
        console.error(error);
    }

    //other details
    try {
        let moreDetailsURL = "https://www.omdbapi.com/?i=" + movieDetailsObject.IMDB_ID + "&plot=full&apikey=29e86f57";
        let moreDetailsURL2 = "https://www.omdbapi.com/?i=" + movieDetailsObject.IMDB_ID + "&plot=full&apikey=1bb7d720";

        let response = await fetch(moreDetailsURL);
        if (response == null || response == undefined) {
            response = await fetchCredits(moreDetailsURL2);
        }
        let json = await response.json();

        moreMovieDetailsObject.rating = json.Rated; //
        moreMovieDetailsObject.awards = json.Awards;
        moreMovieDetailsObject.plot = json.Plot; //
        moreMovieDetailsObject.production = json.Production;
        moreMovieDetailsObject.runtime = json.Runtime; //
        moreMovieDetailsObject.director = json.Director;
        moreMovieDetailsObject.writers = json.Writer;
    } catch (error) {
        console.error(error);
    }

    ImplementResults();


}
async function fetchMovieTrailer() {
    try {
        const response = await fetch(TrailerURL);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}
async function fetchCredits() {
    try {
        const response = await fetch(CreditsURL);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}
async function fetchSimilar() {
    try {
        const response = await fetch(similarMoviesURL);
        const json = await response.json();
        return json.results;
    } catch (error) {
        console.error(error);
    }
}
async function fetchGenres() {
    try {
        const response = await fetch(genresURL);
        const json = await response.json();
        return json.genres;
    } catch (error) {
        console.error(error);
    }
}


async function fetchSpecificReview(review_link) {
    try {
        let response = await fetch(review_link);
        data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function ImplementResults() {

    document.getElementById("ID_PageTitle").innerHTML = movieDetailsObject.title;
    //movie header details
    document.getElementById("ID_Title").innerHTML = movieDetailsObject.title;
    document.getElementById("ID_Date").innerHTML = "(" + movieDetailsObject.releaseDate + ")";
    document.getElementById("ID_VoteAverage").innerHTML = movieDetailsObject.voteAverage + "/10";
    document.getElementById("ID_VoteCount").innerHTML = numberWithCommas(movieDetailsObject.voteCount);
    let genres = "";
    for (let i = 0; i < movieDetailsObject.genres.length; i++) {
        genres += movieDetailsObject.genres[i].name;
        if (i != movieDetailsObject.genres.length - 1) {
            genres += ", "
        }
    }
    document.getElementById("ID_Genres").innerHTML = genres;

    //rating
    if (moreMovieDetailsObject.rating != undefined)
        document.getElementById("ID_Rating").innerHTML = moreMovieDetailsObject.rating;
    //runtime
    if (moreMovieDetailsObject.runtime != undefined)
        document.getElementById("ID_Runtime").innerHTML = moreMovieDetailsObject.runtime;
    //director
    if (moreMovieDetailsObject.director != undefined) {
        let content = document.getElementById("movieTitle");
        content.innerHTML += "<p style='position: relative; margin-left: 30px; padding-bottom: 15px; font-size: smaller; color: gainsboro; display: inline;'>" + "Director: " + moreMovieDetailsObject.director + "</p> <br>"
    }
    //writers
    if (moreMovieDetailsObject.writers != undefined) {
        let content = document.getElementById("movieTitle");
        content.innerHTML += "<p style='position: relative; margin-left: 30px; padding-bottom: 15px; font-size: smaller; color: gainsboro; display: inline-block;'>" + "Writer(s): " + moreMovieDetailsObject.writers + "</p>"
    }

    //trailer
    let key = await returntrailerDetails();
    document.getElementById("ID_Trailer").src = "https://www.youtube.com/embed/" + key + "";

    //poster
    if (movieDetailsObject.posterpath == null || movieDetailsObject.posterpath == undefined || movieDetailsObject.posterpath == "") {
        document.getElementById("ID_MainPoster").src = 'images/empty.png';

    }
    else {
        document.getElementById("ID_MainPoster").src = ThebaseURL + size + movieDetailsObject.posterpath;
    }
    //all videos button
    let num = await numTrailers();
    document.getElementById("ID_AllVideosBTN").innerHTML = "All Videos (" + num + ")";
    //overview
    document.getElementById("ID_Overview").innerHTML = movieDetailsObject.overview;
    //tagline
    if (movieDetailsObject.tagline != "") {
        document.getElementById("ID_Tagline").innerHTML = movieDetailsObject.tagline;
    } else {
        document.getElementById("ID_Tagline").innerHTML = "No tagline available.";
    }
    //behind scenes info
    setBehindScenesInfo();

    //plot
    if (moreMovieDetailsObject.plot != undefined)
        document.getElementById("ID_Plot").innerHTML = moreMovieDetailsObject.plot;
    //credits
    setCredits();

    //more like this
    setSimilar();





}




fetchMovieDetails();



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function returntrailerDetails() {
    let trailerData = await fetchMovieTrailer();
    let resultsArr = trailerData.results;
    let trailerKey = undefined;

    for (let i = 0; i < resultsArr.length; i++) {
        if (resultsArr[i].type == "Trailer") {
            trailerKey = resultsArr[i].key;
            break;
        }
    }
    if (trailerKey == undefined) {
        for (let i = 0; i < resultsArr.length; i++) {
            if (resultsArr[i].type == "Teaser") {
                trailerKey = resultsArr[i].key;
            }
        }
    }
    return trailerKey;
}
async function numTrailers() {
    let trailerData = await fetchMovieTrailer();
    let arr = trailerData.results;
    let len = arr.length;
    return len;
}

function setBehindScenesInfo() {
    //production countries
    let prodCountries = "";
    for (let i = 0; i < movieDetailsObject.productionCountries.length; i++) {
        prodCountries += movieDetailsObject.productionCountries[i].name + " (" + movieDetailsObject.productionCountries[i].iso_3166_1 + ")"
        if (i != movieDetailsObject.productionCountries.length - 1) {
            prodCountries += ", "
        }
    }
    document.getElementById("ID_ProductionCountries").innerHTML = prodCountries;

    //production companies
    let prodCompanies = "";
    for (let i = 0; i < movieDetailsObject.productionCompanies.length; i++) {
        prodCompanies += movieDetailsObject.productionCompanies[i].name;
        if (i != movieDetailsObject.productionCompanies.length - 1) {
            prodCompanies += ", "
        }
    }
    document.getElementById("ID_ProductionCompanies").innerHTML = prodCompanies;

    //budget
    let budget = "$" + numberWithCommas(movieDetailsObject.budget);
    document.getElementById("ID_Budget").innerHTML = budget;

    //revenue
    let revenue = "$" + numberWithCommas(movieDetailsObject.revenue);
    document.getElementById("ID_Revenue").innerHTML = revenue;
}

function seeAllVideos() {
    localStorage.setItem("MovieID", MovieID);
    window.open('allVideos.html');
}




async function setCredits() {
    let creditsData = await fetchCredits();
    let cast = creditsData.cast;

    let list = "<ul style='position: relative;    list-style-type: none;'>"
    let content = document.getElementById('CastList');


    for (let i = 0; i < cast.length; i++) {
        let image = "";

        if (cast[i].profile_path != null) {
            //data
            let imageSrc = ThebaseURL + size + cast[i].profile_path;
            image = "<img src='" + imageSrc + "'width='40' height='57.5' style='border-radius: 3px; position: relative; display: inline-block; margin-top: 1px; margin-left: 2px' ></img>"
        }
        else {
            let imageSrc = 'images/empty.png';
            image = "<img src='" + imageSrc + "'width='40' height='57.5' style='border-radius: 3px; position: relative; display: inline-block; margin-top: 1px; margin-left: 2px' ></img>"
        }
        let character = cast[i].character;
        let actor = cast[i].name;

        let actorText = "<p style='position: absolute; color: lightgray; font-size: 13px; pointer-events: none; left: 8%; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%);'>" + actor + "</p>";
        let characterText = "<p style='position: absolute; color: lightgray; font-size: 13px; pointer-events: none;  top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%); left: 40%'>" + character + "</p>";

        list += "<li class='CastListItem'>" + image + actorText + characterText + "</li > "
    }

    list += "</ul>";
    content.innerHTML = list;
}

function goToCast() {
    var elmntToView = document.getElementById("CastTitle");
    elmntToView.scrollIntoView();
}


function viewCrew() {
    localStorage.setItem("MovieID", MovieID);
    localStorage.setItem("baseURL", ThebaseURL);
    window.open('viewCrew.html');
}

async function setSimilar() {
    let data = await fetchSimilar();
    if (data != null && data != undefined && data.length != 0) { //if the similar movies is not null or empty
        let content = document.getElementById("pageTransparency");

        let horizontalLine = "<hr style='background-color: gray; margin-top: 50px; height: 0.5px;'>"
        let title = "<h3 style='position: relative; border-radius: 10px; margin-left: 32px; display: block; color: gray; margin-top: 40px; width: 500px; margin-bottom: -10px;'> Similar: </h3>"

        content.innerHTML += horizontalLine;
        content.innerHTML += title;

        similarMoviesArr = new Array();

        //create the image list that can be clicked on to view the movie details
        let imageDiv = "<div class='SimilarMoviesGallery'>";

        for (let i = 0; i < data.length; i++) {
            let imgSRC = ThebaseURL + size + data[i].poster_path;
            let movieItem = "<img type='image' src=" + imgSRC + " class='similarMoviesItem' id=" + i + " onclick='setSimilarMovieInfo(id)'> "; //the id is used as an array index 
            imageDiv += movieItem;
        }
        imageDiv += "</div>"
        content.innerHTML += imageDiv;

        //create array of the information objects
        let genresTotal = await fetchGenres();
        for (let i = 0; i < data.length; i++) {

            let title = data[i].title;/////////////////
            let year = data[i].release_date.substring(0, 4);/////////////////////
            let genreIDS = data[i].genre_ids;
            //corresponding genre
            for (let j = 0; j < genreIDS.length; j++) { //traverse each given genre in the array
                for (let k = 0; k < genresTotal.length; k++) { //traverse the list of all genres to find one which has a matching id, and assign the name to it
                    if (genreIDS[j] == genresTotal[k].id) {
                        genreIDS[j] = genresTotal[k].name;
                        break;
                    }
                }
            }
            let genreString = "";//////////////////////
            for (let i = 0; i < genreIDS.length; i++) { //now contains strings
                if (i != genreIDS.length - 1) {
                    genreString += genreIDS[i] + ", ";
                } else {
                    genreString += genreIDS[i];
                }
            }
            let overview = data[i].overview;

            let movieObj = {
                TITLE: title,
                YEAR: year,
                GENRE: genreString,
                OVERVIEW: overview
            }
            similarMoviesArr.push(movieObj);
        }



        let infoDiv = "<div class='SimilarMovieInfo'>";
        infoDiv += "<h3 id='similarMovieTitle' style= 'color: white; margin-left: -150px'>" + similarMoviesArr[0].TITLE + "</h3>";
        infoDiv += "<h4 id='similarMovieYear' style= 'color: gray; margin-left: -150px'>" + "(" + similarMoviesArr[0].YEAR + ")" + "</h4>";
        infoDiv += "<p id='similarMovieGenre' style= 'color: gray; margin-left: -150px'>" + similarMoviesArr[0].GENRE + "</p>";
        infoDiv += "<p id='similarMovieOverview' style= 'color: lightgray; margin-left: -150px; margin-top: 40px'>" + similarMoviesArr[0].OVERVIEW + "</p>";

        content.innerHTML += infoDiv;

    }
}

function setSimilarMovieInfo(index) {
    document.getElementById("similarMovieTitle").innerHTML = similarMoviesArr[index].TITLE;
    document.getElementById("similarMovieYear").innerHTML = similarMoviesArr[index].YEAR;
    document.getElementById("similarMovieGenre").innerHTML = similarMoviesArr[index].GENRE;
    document.getElementById("similarMovieOverview").innerHTML = similarMoviesArr[index].OVERVIEW;
}

function viewReviews() {
    localStorage.setItem("MovieID", MovieID);
    localStorage.setItem("baseURL", ThebaseURL);
    window.open('ViewReviews.html');
}



/*
async function scrapePlot() {

    let proxyURLS = ["https://thingproxy.freeboard.io/fetch/", "https://cors-anywhere.herokuapp.com/", "https://cors-proxy.htmldriven.com/?url=", "http://www.whateverorigin.org/get?url="]

    let htmlString = "";
    const proxyurl = "https://thingproxy.freeboard.io/fetch/";
    const theURL = "https://www.imdb.com/title/" + movieDetailsObject.IMDB_ID + "/plotsummary?ref_=tt_stry_pl#synopsis";
    let text;
    try {
        await $.ajax({
            url: proxyurl + theURL, success: function (data) {
                //i get the list with the tag of plot-synopsis-content
                htmlString = data;
                let temp = document.createElement('div');
                temp.innerHTML = htmlString;
                let list = temp.querySelector('#' + "plot-synopsis-content").outerHTML;

                let temp2 = document.createElement('div'); //extract the list item which there is only one of and get its text value with the <br> included, so i can replace them with newline characters
                temp2.innerHTML = list;
                result = temp2.getElementsByTagName('li').item(0);
                text = result.innerHTML.toString();

            }
        });
    }
    catch (error) {

    }


    return text;
}
*/
