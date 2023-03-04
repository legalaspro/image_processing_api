import { Request } from 'express';

export interface ImageParams {
  filename: string;
  width: number;
  height: number;
}

export interface ImageParamsRequest extends Request {
  imageParams?: ImageParams;
}
