import { HttpMethod } from './http-method.enum.js';
import type { NextFunction, Request, Response } from 'express';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
