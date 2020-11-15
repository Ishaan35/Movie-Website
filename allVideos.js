let MovieID = localStorage.getItem("MovieID");
let TrailerURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/videos?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US";


async function fetchMovieTrailer() {
    try {
        const response = await fetch(TrailerURL);
        const json = await response.json();
        console.log(MovieID);
        return json;
    } catch (error) {
        console.error(error);
    }
}

async function implementVideos() {
    let json = await fetchMovieTrailer();
    let trailers = json.results;

    let movieDiv = document.getElementById("ID_AllVideos");

    let numTrailers = trailers.length;
    document.getElementById("NumberOfResults").innerHTML = "All trailers and videos (" + numTrailers + "):"

    for (let i = 0; i < trailers.length; i++) {
        let link = "https://www.youtube.com/embed/" + trailers[i].key;
        movieDiv.innerHTML += "<iframe width='560' height='315' src=" + link + " frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen style='margin-left: 30px; position: relative; border-radius: 10px; margin-bottom: 30px;' ></iframe >"
    }



}


implementVideos();

