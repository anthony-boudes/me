document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const isDesktop = window.innerWidth > 768;
    
    try {
        // Get all existing images from the HTML
        const existingImages = [...imageContainer.querySelectorAll('img')];
        
        if (existingImages.length === 0) {
            const noImagesMsg = document.createElement('p');
            noImagesMsg.textContent = 'Aucune image trouvée.';
            imageContainer.appendChild(noImagesMsg);
            return;
        }
        
        // Store original images before duplicating
        const originalImages = [...existingImages];
        
        // Duplicate images for infinite loop effect
        for (let i = 0; i < 2; i++) {
            originalImages.forEach(originalImg => {
                const imgClone = originalImg.cloneNode(true);
                imageContainer.appendChild(imgClone);
            });
        }

        // Setup features based on device type
        if (isDesktop) {
            setupDesktopImagePreview();
            setupAutoScroll(imageContainer);
        } else {
            setupAutoScroll(imageContainer);
        }
        
    } catch (error) {
        console.error('Error loading images:', error);
    }
});

/**
 * Configure le défilement automatique des images (for both mobile and desktop)
 * @param {HTMLElement} container - Le conteneur d'images à faire défiler
 */
function setupAutoScroll(container) {
    let scrollY = 0;
    const scrollSpeed = 0.3;

    // Obtenir la hauteur totale de la galerie pour la boucle
    function getContainerHeight() {
        const images = container.querySelectorAll('img');
        if (images.length === 0) return 0;
        
        const isDesktop = window.innerWidth > 768;
        const imagesPerRow = isDesktop ? 4 : 2;
        const rows = Math.ceil(images.length / imagesPerRow) / 3;
        return rows * images[0].offsetHeight;
    }
    
    // Variable pour suivre si l'utilisateur fait défiler manuellement
    let userScrolling = false;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Détecter le défilement manuel
    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(currentScrollTop - lastScrollTop) > 5) {
            userScrolling = true;
            setTimeout(() => {
                userScrolling = false;
            }, 1000);
        }
        lastScrollTop = currentScrollTop;
    });

    function scroll() {
        // Ne pas animer si l'utilisateur fait défiler
        if (!userScrolling) {
            const height = getContainerHeight();
            // Défilement vertical
            scrollY += scrollSpeed;
            
            // Réinitialiser quand on atteint la fin du premier ensemble d'images
            if (scrollY >= height) {
                scrollY = 0;
            }
            
            container.style.transform = `translateY(-${scrollY}px)`;
        }
        
        requestAnimationFrame(scroll);
    }
    
    // Démarrer l'animation de défilement
    requestAnimationFrame(scroll);

    // Arrêter le défilement lors du survol
    container.addEventListener('mouseenter', () => {
        container.style.transition = 'transform 0.5s ease-out';
    });

    // Reprendre le défilement à la sortie du survol
    container.addEventListener('mouseleave', () => {
        container.style.transition = 'transform 1s ease-out';
    });
}

/**
 * Setup desktop image preview functionality 
 */
function setupDesktopImagePreview() {
    const imageContainer = document.querySelector('.image-container');
    
    // Create a modal for full-size image preview
    const modal = document.createElement('div');
    modal.classList.add('image-modal');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    modal.style.zIndex = '1000';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.cursor = 'pointer';

    const modalImg = document.createElement('img');
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.objectFit = 'contain';
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    // Add click event to gallery images
    imageContainer.querySelectorAll('img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            modalImg.src = e.target.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });

    // Close modal on click
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
}