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
    searchBtn.addEventListener("click", function() {
        const searchTerm = searchInput.value.toLowerCase();
        imageItems.forEach(item => {
            if (item.textContent.toLowerCase().includes(searchTerm)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    });

    // Filter selection
    filterItems.forEach(filter => {
        filter.addEventListener("click", function() {
            filter.classList.toggle("selected");
        });
    });

    // Reset button functionality (resets search and filters)
    document.querySelector(".reset-btn").addEventListener("click", function() {
        searchInput.value = "";
        imageItems.forEach(item => item.style.display = "");
        filterItems.forEach(filter => filter.classList.remove("selected"));
    });

    document.querySelector(".download-btn").addEventListener("click", function() {
        let selected_image = document.querySelector(".selected");
        console.log(selected_image);
        if (selected_image) {
            const imageUrl = `${CENSUS_IMAGE_URL}${selected_image.getAttribute("data-url")}.png`;

            const anchorElement = document.createElement('a');
            anchorElement.href = imageUrl;
            anchorElement.download = selected_image.getAttribute("data-url") + ".png";
            anchorElement.target = "_blank";
            document.body.appendChild(anchorElement);
            anchorElement.click();
            document.body.removeChild(anchorElement);
        }
    });

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
        Object.entries(images).forEach(([id, data]) => {
            const item = document.createElement('div');
            item.innerText = id + ": " + data.dev_description + "; " + data.description;
            item.classList.add("image-item");
            item.setAttribute("data-url", id);
            imageList.appendChild(item);
        });
        script();
    }

populateImageList();

