let MovieID = localStorage.getItem("MovieID");
let ThebaseURL = localStorage.getItem("baseURL");

let reviewURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/reviews?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9&language=en-US&page=1"



setReviews();






async function fetchReviews() {
    try {
        const response = await fetch(reviewURL);
        const json = await response.json();
        return json.results;
    } catch (error) {
        console.error(error);
    }
}

async function fetchSpecificReviewInfo(specificReviewURL) {
    try {
        const response = await fetch(specificReviewURL);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}

async function setReviews() {

    let data = await fetchReviews();

    let ReviewInformation = new Array();
    for (let i = 0; i < data.length; i++) {
        let id = data[i].id;

        let link = "https://api.themoviedb.org/3/review/" + id + "?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9";

        let specific_data = await fetchSpecificReviewInfo(link);
        ReviewInformation.push(specific_data);
    }

    console.log(ReviewInformation);


    let container = document.getElementById("centerAlign");
    container.innerHTML += "<div id='ReviewList'>"; //list

    for (let i = 0; i < ReviewInformation.length; i++) {
        let reviewItem = "<div class='ReviewItem'>";

        if (ReviewInformation[i].author_details.avatar_path.indexOf("https") < 0) {
            reviewItem += "<img src='" + ThebaseURL + "original" + ReviewInformation[i].author_details.avatar_path + "' width='40' style='border-radius: 5px'>"
        }
        else {
            let imgLink = ReviewInformation[i].author_details.avatar_path;
            imgLink = imgLink.substring(1);
            console.log(imgLink);
            reviewItem += "<img src='" + imgLink + "' width='40' style='border-radius: 5px'>"
        }

        reviewItem += "<h7 style = 'margin-left: 10px; margin-top: 15px'; position: relative>" + ReviewInformation[i].author + "</h7>";

        reviewItem += "<pre class= 'review_content'>" + ReviewInformation[i].content + "</pre>";



        reviewItem += "</div>";
        container.innerHTML += reviewItem;
    }



}