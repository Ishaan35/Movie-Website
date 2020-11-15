
const API_KEY_ = "0f8c600ac4c6d94f453b6d233c2bbcc9";
const ConfigLink = "https://api.themoviedb.org/3/configuration?api_key=" + API_KEY_;


let baseURL;
let size = "original"
fetchConfigInfo();



async function fetchConfigInfo() {
    try {
        const response = await fetch(ConfigLink);
        const json = await response.json();
        baseURL = json.images.base_url;
        return json.images.base_url;

    } catch (error) {
        console.error(error);
    }

}

