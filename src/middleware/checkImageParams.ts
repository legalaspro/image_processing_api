import { Response, NextFunction } from 'express';
import { ImageParamsRequest } from '../types';

const checkImageParams = (
  req: ImageParamsRequest,
  res: Response,
  next: NextFunction
) => {
  const { filename, width, height } = req.query;
  if (!filename || !width || !height) {
    return res.status(400).json({
      message: 'Missing query parameters: filename, width and height required!'
    });
  }

  const _width = parseInt(width as string);
  const _height = parseInt(height as string);

  if (isNaN(_width) || isNaN(_height)) {
    return res.status(400).json({
      message: 'Invalid query parameters: width and height must be numbers'
    });
  }

  req.imageParams = {
    filename: filename as string,
    width: Number(width),
    height: Number(height)
  };

  next();
};

export default checkImageParams;
