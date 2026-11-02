import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import {Request} from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    try {
      const jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret not configured');
      }
      const decoded = jwt.verify(token, jwtSecret);
      (request as any).user = decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}
