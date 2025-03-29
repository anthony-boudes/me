const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier actuel
app.use(express.static(__dirname));

// Log middleware to debug requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Route pour lister les fichiers d'images
app.get('/list-images', (req, res) => {
    const imagesDir = path.join(__dirname, 'images');
    
    // Check if the directory exists
    if (!fs.existsSync(imagesDir)) {
        console.error(`Images directory does not exist: ${imagesDir}`);
        fs.mkdirSync(imagesDir, { recursive: true });
        return res.json([]);
    }
    
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier:', err);
            return res.status(500).json({ error: 'Impossible de lire le dossier d\'images' });
        }
        
        console.log(`Found ${files.length} files in images directory`);
        
        // Filtrer pour ne garder que les fichiers d'images
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        console.log(`Found ${imageFiles.length} image files`);
        
        // Créer les chemins relatifs pour les images
        const imagePaths = imageFiles.map(file => `/images/${file}`);
        
        res.json(imagePaths);
    });
});

// Add a fallback for empty directories - provide some sample images
app.get('/sample-images', (req, res) => {
    res.json([
        '/images/sample1.jpg',
        '/images/sample2.jpg'
    ]);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Serving static files from: ${__dirname}`);
    console.log(`Looking for images in: ${path.join(__dirname, 'images')}`);
});
