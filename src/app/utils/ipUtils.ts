// utils.ts
import { Request } from 'express';

export function getClientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  let ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return ip || req.socket.remoteAddress;
}

export default getClientIp