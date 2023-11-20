const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

// Array of image URLs

const imageDirectory = path.join(__dirname, 'public/faces/');
const imageUrls = createImageURLs(imageDirectory);

// // Function to get 24 random images
// function getRandomImages() {
//     let shuffled = imageUrls.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 24);
// }

// Serve static files from 'public' directory
app.use(express.static('public'));

// // Route to get random images
// app.get('/images', (req, res) => {
//     res.json(getRandomImages());
// });


function getRandomImages(seed) {
    const rng = seededRandomGenerator(seed);

    // Custom sort function using the seeded random generator
    let shuffledImages = [...imageUrls].sort(() => 0.5 - rng());
    const selectedImages = shuffledImages.slice(0, 24);

    // Pair each image with a name
    const imageWithName = selectedImages.map((imageUrl) => {
        const name = path.basename(imageUrl).replace(/\.\w+/, '')
        return [imageUrl, name];
    });

    return imageWithName;
}


// Route to get random images with a seed parameter
app.get('/images', (req, res) => {
  const seed = req.query.seed || 'defaultSeed'; // Use a default seed if none is provided
  const images = getRandomImages(seed)
  console.log(images)
  res.json(images);
});

let lastSeed

app.get('/generate-seed', (req, res) => {

    const seed = lastSeed ?? generateSecureRandomSeed();

    lastSeed = seed
    setTimeout(() => {
        lastSeed = undefined
    }, 5000)

    res.send(seed)
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


/**
 * Reads files from a specified directory and creates an array of URLs.
 * @param {string} directory - The path to the directory containing images.
 * @returns {string[]} An array of URLs.
 */
function createImageURLs(directory) {
    try {
        // Read all file names in the directory
        const files = fs.readdirSync(directory).filter(file => file !== '.DS_Store');

        // Map each file name to a URL
        const urls = files.map(file => `/faces/${file}`);
        return urls;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}


function seededRandomGenerator(seed) {
    let hash = crypto.createHash('sha256').update(seed).digest('hex');
    let position = 0;

    // Function to generate a random number between 0 and 1
    return function() {
        if (position >= hash.length) {
            position = 0;
        }

        // Get two characters from the hash and parse them as a hexadecimal number
        // Divide by 0xffff (the maximum value for a 4-digit hexadecimal number) to normalize between 0 and 1
        const value = parseInt(hash.substr(position, 2), 16) / 0xff;
        position += 2;
        return value;
    };
}

function generateSecureRandomSeed(length = 16) {
  // Generate a buffer of 'length' random bytes
  const randomBuffer = crypto.randomBytes(length);

  // Convert the buffer to a hexadecimal string
  return randomBuffer.toString('hex');
}
