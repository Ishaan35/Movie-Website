let MovieID = localStorage.getItem("MovieID");
let ThebaseURL = localStorage.getItem("baseURL");

let CrewURL = "https://api.themoviedb.org/3/movie/" + MovieID + "/credits?api_key=0f8c600ac4c6d94f453b6d233c2bbcc9";

async function fetchCredits() {
    try {
        const response = await fetch(CrewURL);
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error);
    }
}

async function setCrew() {
    let creditsData = await fetchCredits();
    let crew = creditsData.crew;

    let list = "<ul style='position: relative;    list-style-type: none;'>"
    let content = document.getElementById('CrewList');


    for (let i = 0; i < crew.length; i++) {
        let image = "";

        if (crew[i].profile_path != null) {
            //data
            let imageSrc = ThebaseURL + size + crew[i].profile_path;
            image = "<img src='" + imageSrc + "'width='40' height='57.5' style='border-radius: 3px; position: relative; display: inline-block; margin-top: 1px; margin-left: 2px' ></img>"
        }
        else {
            let imageSrc = 'images/empty.png';
            image = "<img src='" + imageSrc + "'width='40' height='57.5' style='border-radius: 3px; position: relative; display: inline-block; margin-top: 1px; margin-left: 2px' ></img>"
        }
        let name = crew[i].name;
        let department = crew[i].department;
        let job = crew[i].job;

        let nameText = "<p style='position: absolute; color: lightgray; font-size: 13px; pointer-events: none; left: 8%; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%);'>" + name + "</p>";
        let departmentText = "<p style='position: absolute; color: lightgray; font-size: 13px; pointer-events: none;  top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%); left: 40%'>" + department + "</p>";
        let jobText = "<p style='position: absolute; color: lightgray; font-size: 13px; pointer-events: none;  top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%); left: 60%'>" + job + "</p>";


        list += "<li class='CrewListItem'>" + image + nameText + departmentText + jobText + "</li > "
    }

    list += "</ul>";
    content.innerHTML = list;
}

setCrew();