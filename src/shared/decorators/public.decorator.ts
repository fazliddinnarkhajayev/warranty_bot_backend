// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

// KEY ni global guard uchun ishlatamiz
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
