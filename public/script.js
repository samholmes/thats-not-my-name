const newSeedBtn = document.getElementById('newseedbtn')
newSeedBtn.onclick = () => {
  location.href = location.pathname
}

function fetchImagesOrRedirectForSeed() {
    // Function to parse the seed from the URL
    function getSeedFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('seed');
    }

    const seed = getSeedFromURL();

    if (seed) {
        // If seed exists, fetch images with seed
        fetch(`/images?seed=${seed}`)
          .then(response => response.json())
          .then(results => {
            const grid = document.getElementById('imageGrid');

            results.forEach(([url, name]) => {
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';

                // Creating front and back sides of the card
                const frontSide = document.createElement('div');
                frontSide.className = 'front';
                const img = document.createElement('img');
                img.src = url;
                const nameLabel = document.createElement('span')
                nameLabel.innerText = name

                frontSide.appendChild(img)
                frontSide.appendChild(nameLabel)

                const backSide = document.createElement('div');
                backSide.className = 'back';

                gridItem.appendChild(frontSide);
                gridItem.appendChild(backSide);

                // Adding click handler
                gridItem.addEventListener('click', () => {
                    gridItem.classList.toggle('flipped');
                });

                grid.appendChild(gridItem);
            });

            // Function to randomly select an image and append it after the grid
            function selectRandomImage() {
                const randomIndex = Math.floor(Math.random() * results.length);
                const pick = results[randomIndex];
                const selectedImageUrl = pick[0]
                const selectedName = pick[1]

                // Create a new image element for the selected image
                const container = document.createElement('div');
                container.className = 'selected-image'; // Add a class for styling
                const selectedImageElement = document.createElement('img');
                selectedImageElement.src = selectedImageUrl;
                const nameLabel = document.createElement('span');
                nameLabel.textContent = selectedName;
                
                container.appendChild(selectedImageElement)
                container.appendChild(nameLabel)

                // Append the new image element after the grid
                grid.parentNode.insertBefore(container, grid.nextSibling);
            }

            // Call the function to select and display a random image
            selectRandomImage();


          })
          .catch(error => console.error('Error fetching images:', error));
    } else {
        // If no seed, fetch a new seed and redirect
        fetch('/generate-seed')
            .then(response => response.text())
            .then(newSeed => {
                window.location.href = `${window.location.pathname}?seed=${newSeed}`;
            })
            .catch(error => console.error('Error fetching new seed:', error));
    }
  }
  
  // Call the function
  fetchImagesOrRedirectForSeed();