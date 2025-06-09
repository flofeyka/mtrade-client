import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * Transforms plain object(s) to class instance(s) using class-transformer
 * Only properties marked with @Expose() will be included in the result
 */
export function transformToRdo<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
): T | T[] {
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

/**
 * Transforms a single object to RDO
 */
export function transformToSingleRdo<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
): T {
  return transformToRdo(cls, plain) as T;
}

/**
 * Transforms an array of objects to RDO array
 */
export function transformToArrayRdo<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
): T[] {
  return transformToRdo(cls, plain) as T[];
}
