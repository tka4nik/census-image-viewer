const API_URL =
    "https://census.lithafalcon.cc/get/ps2/image?c:limit=100&c:join=item^on:path^to:image_path^show:name%27description^list:1&c:tree=path&c:lang=en";

const CENSUS_IMAGE_URL = "https://census.daybreakgames.com"

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function displayData() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    let api_data = await fetchData();
    api_data = api_data['image_list'];


    for (let [i, data] of Object.entries(api_data)) {
        for (let [key, value] of Object.entries(data)) {
            console.log(key, value);
            console.log(value);
            console.log(value['description']);
            const listItem = document.createElement('li');
            listItem.textContent = "Id: " + value['image_id'] + "; " + value['description'];
            listItem.addEventListener("click", () => {
                selectItem(key);
            });
            dataList.appendChild(listItem);
        }
    }
}


async function selectItem(key) {
    const selectedImageElement = document.getElementById("selectedImage");
    selectedImageElement.src = CENSUS_IMAGE_URL + key;
}


function filterData() {
    const searchBox = document.getElementById('searchBox');
    const searchText = searchBox.value.toLowerCase();
    const dataList = document.getElementById('dataList');
    const listItems = dataList.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const text = listItem.textContent.toLowerCase();

        if (text.includes(searchText)) {
            listItem.style.display = '';
        } else {
            listItem.style.display = 'none';
        }
    }
}
//
document.getElementById('searchBox').addEventListener('input', filterData);
//
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", () => {
    const selectedImageElement = document.getElementById("selectedImage");
    downloadImage(selectedImageElement.src, selectedImageElement.title).then(() => {
        console.log('The image has been downloaded');
    })
        .catch(err => {
            console.log('Error downloading image: ', err);
        });
});


async function downloadImage(
    imageSrc,
    nameOfDownload = 'image.jpg',
) {
    const response = await fetch(imageSrc);

    const blobImage = await response.blob();

    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = nameOfDownload;
    anchorElement.target = "_blank";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
}

displayData();
