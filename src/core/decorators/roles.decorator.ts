import { ReflectMetadata } from '@nestjs/common';

export const Roles = (...roles: number[]) => ReflectMetadata('roles', roles);