# Image Gallery Website

## Debugging Instructions

If you're not seeing any images, follow these steps:

1. Make sure the server is running:
   ```
   npm start
   ```

2. Check that the `/images` directory exists in your project root.

3. Ensure the directory contains image files (jpg, jpeg, png, gif, webp, svg).

4. Check the console for any errors by opening your browser's developer tools.

5. If you still don't see images, try placing some test images directly in the `/images` folder.

6. Ensure file permissions allow the server to read the images directory.

7. If the server runs but no images appear, navigate directly to:
   - http://localhost:3000/list-images 
   - This should show a JSON list of images. If empty, your directory has no images.

## Image Directory Structure

Your images should be in the following location:
