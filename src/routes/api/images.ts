import express from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import sharp from 'sharp';
import mime from 'mime';

import { ROOT_DIR } from '../../config';
import checkImageParams from '../../middleware/checkImageParams';
import { ImageParamsRequest, ImageParams } from '../../types';
const images = express.Router();

images.get('/', checkImageParams, async (req: ImageParamsRequest, res) => {
  const { filename, width, height } = req.imageParams as ImageParams;

  const imageType = mime.getType(filename);
  const { name: imageName, ext: imageExt } = path.parse(filename);

  const imagePath = path.join(ROOT_DIR, 'assets', 'full', filename);
  const thumbnailName = `${imageName}_${width}_${height}${imageExt}`;
  const thumbnailPath = path.join(ROOT_DIR, 'assets', 'thumb', thumbnailName);

  // Lets check if Thumbnail already exists
  try {
    await fsPromises.access(thumbnailPath);
    console.log(`Accessed thumbnail ${thumbnailName}`);
    res.set('Content-Disposition', 'inline');
    res.sendFile(thumbnailPath);
    return;
  } catch (err) {
    console.log('Accessing image for the first time');
  }

  try {
    await fsPromises.access(imagePath);

    const resizedImage = await sharp(imagePath)
      .resize(width, height)
      .toBuffer();

    await fsPromises.writeFile(thumbnailPath, resizedImage);
    console.log(`Processed thumbnail ${thumbnailName}`);
    res.set('Content-Disposition', 'inline');
    res.type(imageType ?? 'image/jpeg').send(resizedImage);
  } catch (err) {
    return res.status(404).json({
      message: 'Image not found'
    });
  }
});

export default images;
