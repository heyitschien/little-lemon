import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://storage.googleapis.com/storage.catbird.ai/predictions/276370279339532288/3606d6f0-5b33-4f37-81fa-fc0749228a8f.png',
    filename: 'john-doll.png'
  },
  {
    url: 'https://storage.googleapis.com/storage.catbird.ai/predictions/276370354602131456/8afd3046-b186-497c-ac3b-c6911e6d5f7a.png',
    filename: 'jane-smith.png'
  },
  {
    url: 'https://storage.googleapis.com/storage.catbird.ai/predictions/276370422772154368/ed16712d-41db-4a0c-b885-086629e1dddd.png',
    filename: 'mike-jones.png'
  },
  {
    url: 'https://storage.googleapis.com/storage.catbird.ai/predictions/276370517739589632/e614c20a-6018-4b16-8d22-086d861b9946.png',
    filename: 'sarah-williams.png'
  }
];

const downloadDir = path.join(__dirname, '../src/assets/images/testimonials');

// Create directory if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(downloadDir, filename));
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(filename, () => {}); // Delete the file if there's an error
      reject(error);
    });
  });
};

const downloadAll = async () => {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAll();
