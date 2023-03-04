import supertest from 'supertest';
import sharp from 'sharp';
import path from 'path';
import { promises as fsPromises } from 'fs';
import app from '../../index';
import { ROOT_DIR } from '../../config';

const request = supertest(app);

describe('Tests for images API', () => {
  const thumbPath = path.join(ROOT_DIR, 'assets', 'thumb');
  afterAll(async () => {
    const files = await fsPromises.readdir(thumbPath);
    await Promise.all(
      files.map((file) => {
        const filePath = path.join(thumbPath, file);
        return fsPromises.unlink(filePath);
      })
    );
  });

  describe('GET /api/images should return correctly resized images', () => {
    it('should return 400 error for missing parameters', async () => {
      const response = await request.get('/api/images');

      expect(response.status).toBe(400);
    });

    it('should return 400 error if width or height are not numbers', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: 'image.png', width: 'notnumber', height: 300 });

      expect(response.status).toBe(400);
    });

    it('should return 404 error for invalid image file', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: 'image.png', width: 200, height: 300 });

      expect(response.status).toBe(404);
    });

    it('should return 200 if query parameters are present', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: 'fjord.jpg', width: 200, height: 300 });

      expect(response.status).toBe(200);
      expect(response.type).toBe('image/jpeg');
    });

    it('should return correct size image', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: 'fjord.jpg', width: 200, height: 300 });

      const imageMeta = await sharp(response.body).metadata();

      expect(imageMeta.width).toBe(200);
      expect(imageMeta.height).toBe(300);
    });

    it('should return correct type image/png', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: 'icelandwaterfall.png', width: 200, height: 300 });

      expect(response.status).toBe(200);
      expect(response.type).toBe('image/png');
    });
  });

  describe('GET /api/images should create and reuse thumbnail', () => {
    const width = 200;
    const height = 200;
    const fileName = 'fjord.jpg';
    const thumbnailPath = path.join(
      ROOT_DIR,
      'assets',
      'thumb',
      `fjord_${width}_${height}.jpg`
    );

    afterEach(async () => {
      await fsPromises.unlink(thumbnailPath).catch(() => {
        console.log('');
      });
    });

    it('should create thumbnail file in thumb folder', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: fileName, width, height });

      expect(response.status).toBe(200);

      const stats = await fsPromises.stat(thumbnailPath);

      expect(stats.isFile()).toBe(true);
    });

    it('should create thumbnail with correct size in thumb folder', async () => {
      const response = await request
        .get('/api/images')
        .query({ filename: fileName, width, height });

      expect(response.status).toBe(200);

      const imageBuffer = await fsPromises.readFile(thumbnailPath);
      const imageMeta = await sharp(imageBuffer).metadata();

      expect(imageMeta.width).toEqual(width);
      expect(imageMeta.height).toEqual(height);
    });

    it('should not create thumbnail in thumb folder if one already exists', async () => {
      spyOn(sharp.prototype, 'toBuffer').and.callThrough();

      await request
        .get('/api/images')
        .query({ filename: fileName, width, height });

      const stats = await fsPromises.stat(thumbnailPath);

      expect(stats.isFile()).toBe(true);

      await request
        .get('/api/images')
        .query({ filename: fileName, width, height });

      const stats2 = await fsPromises.stat(thumbnailPath);

      expect(stats2.isFile()).toBe(true);

      expect(sharp.prototype.toBuffer).toHaveBeenCalledTimes(1);
    });
  });
});
