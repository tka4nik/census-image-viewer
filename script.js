const CENSUS_IMAGE_URL = "https://census.daybreakgames.com/files/ps2/images/static/"
const DATA_URL = "data.json"

const  imageList = document.getElementById("imageList");

function script() {
    const imageItems = document.querySelectorAll(".image-item");
    const selectedImage = document.getElementById("selectedImage");
    const imageTitle = document.getElementById("imageTitle");
    const downloadBtn = document.getElementById("downloadBtn");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const filterItems = document.querySelectorAll(".filter-item");
    // Select image and display
    imageItems.forEach(item => {
        // console.log(item);
        item.addEventListener("click", function() {
            const imageUrl = CENSUS_IMAGE_URL + item.getAttribute("data-url");
            console.log(imageUrl);

            // Highlight selected item
            imageItems.forEach(img => img.classList.remove("selected"));
            item.classList.add("selected");

            // Show image title
            imageTitle.textContent = item.textContent;

            // Load the image on the right side
            selectedImage.src = imageUrl;
            downloadBtn.href = imageUrl;
            downloadBtn.download = imageUrl.split('/').pop();
        });
    });

    // Search function
    // TODO: В иделе переделать как будто бы под добавление класса (или атрибута), чтобы проще с фильтрами работать
    // Или под лист переделать, и использовать библиотеку https://listjs.com/
    searchBtn.addEventListener("click", function() {
        const searchTerm = searchInput.value.toLowerCase();
        imageItems.forEach(item => {
            if (item.style.display === "" && item.textContent.toLowerCase().includes(searchTerm)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    });

    document.querySelector(".attached").addEventListener("click", function() {
        imageItems.forEach(item => {
            if (item.style.display === "" && item.getAttribute("desc") == "") {
                    item.style.display = "none";
                }
        })
    });

    // Filter selection
    filterItems.forEach(filter => {
        filter.addEventListener("click", function() {
            filterItems.forEach(filter => filter.classList.remove("selected"));
            filter.classList.toggle("selected");
        });
    });

    // Reset button functionality (resets search and filters)
    document.querySelector(".reset-btn").addEventListener("click", function() {
        searchInput.value = "";
        imageItems.forEach(item => item.style.display = "");
        filterItems.forEach(filter => filter.classList.remove("selected"));
    });

    document.querySelector(".download-btn").addEventListener("click", image => downloadSelectedImage(image));

    // Press Enter to trigger search
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
}

async function fetchData() {
    try {
        return await fetch(DATA_URL).then(res => res.json());
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function populateImageList() {
        let  images = await fetchData();
        imageList.innerHTML = '';
        items_size_list = [];
        Object.entries(images).forEach(([id, data]) => {
            const item = document.createElement('div');
            item.innerText = id + ": " + data.dev_description + "; " + data.description;
            item.classList.add("image-item");
            item.setAttribute("data-url", id);
            item.setAttribute("dev-desc", data.dev_description);
            item.setAttribute("desc", "");
            if (data.description !== "") {
                console.log(data.description);
                item.setAttribute("desc", data.description);
            }

            /* Logic for max_res attribute goes here */

            imageList.appendChild(item);
        });
        script();
    }

//TODO: Мб переделать еще отображение item'а - отдельно id и описания (как раз под передлку под лист для библиотеки возможно)
async function downloadSelectedImage(image) {
    imageSrc = `${CENSUS_IMAGE_URL}${image.getAttribute("data-url")}.png`;

    const response = await fetch(imageSrc);
    const blobImage = await response.blob();

    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = image.getAttribute("dev-desc")+".png";
    anchorElement.target = "_blank";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
}

populateImageList();

