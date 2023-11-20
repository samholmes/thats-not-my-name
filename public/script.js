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
          .then(images => {
              const grid = document.getElementById('imageGrid');
              images.forEach(url => {
                  const gridItem = document.createElement('div');
                  gridItem.className = 'grid-item';

                  // Creating front and back sides of the card
                  const frontSide = document.createElement('img');
                  frontSide.src = url;
                  frontSide.className = 'front';

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