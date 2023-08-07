const DATA_URL =
    "data.json";

const CENSUS_IMAGE_URL = "https://census.daybreakgames.com/files/ps2/images/static/"

async function fetchData() {
    try {
        return await fetch(DATA_URL).then(res => res.json());
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

let selected_item;

async function displayData() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    let api_data = await fetchData()
    // console.log(api_data)

    for (let data of Object.entries(api_data)) {
        // console.log(data)
        const listItem = document.createElement('li');
        listItem.textContent = "Id: " + data[0] + "; " + data[1]['dev_description'] + "; " + data[1]['description'];
        console.log(data[1]['description']);
        if (data[1]['description']) {
            listItem.classList.add("description");
            console.log("description");
        }
        listItem.addEventListener("click", () => {
            selectItem(listItem, data[0], data[1]['dev_description']);
        });
        dataList.appendChild(listItem);
    }
    selected_item = dataList.firstChild;
}

async function selectItem(item, key, title) {
    selected_item.style.outline = "";
    selected_item.style.backgroundColor = ""
    selected_item = item;
    selected_item.style.backgroundColor = "rgba(44, 94, 219, .4)"
    selected_item.style.outline = "solid blue 2px";

    const selectedImageElement = document.getElementById("selectedImage");
    selectedImageElement.src = CENSUS_IMAGE_URL + key + ".png";
    selectedImageElement.title = title;
}

let delayTimer;

function filterData() {
    clearTimeout(delayTimer); // Clear the previous timer
    delayTimer = setTimeout(() => {
        const searchText = document.getElementById('searchBox').value.toLowerCase();
        const listItems = document.getElementById('dataList').getElementsByTagName('li');
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            const text = listItem.textContent.toLowerCase();
            if (!text.includes(searchText)) {
                if (description_flag) {
                    if (!listItem.classList.contains("description")) {
                        listItem.style.height = "0px";
                        listItem.style.fontSize = "0px";
                        listItem.style.color = "white";
                    }
                } else {
                    listItem.style.height = "0px";
                    listItem.style.fontSize = "0px";
                    listItem.style.color = "white";
                }
            }
        }
    }, 500);
}

document.getElementById('searchBox').addEventListener('input', filterData);

function clearFilters() {
    const listItems = document.getElementById('dataList').getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        listItem.style.height = "auto";
        listItem.style.fontSize = "16px";
        listItem.style.color = "black";
    }

    document.getElementById("searchBox").value = "";
    if (description_flag) {
        description_flag = false;
        descriptionFilter();
    }
}
document.getElementById('clear').addEventListener('click', clearFilters);


let description_flag = false;
function descriptionFilter() {
    description_flag = !description_flag;
    const listItems = document.getElementById('dataList').getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        if (!listItem.classList.contains("description") && description_flag) {
            listItem.style.height = "0px";
            listItem.style.fontSize = "0px";
            listItem.style.color = "white";
        } else {
            listItem.style.height = "auto";
            listItem.style.fontSize = "16px";
            listItem.style.color = "black";
        }
    }
}

document.getElementById('description').addEventListener("click", descriptionFilter);


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