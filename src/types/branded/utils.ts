import { GuardedType } from '@arthurka/ts-utils';

export const initializeByTypeGuard = <T, U>(
  e: T,
  typeGuard: (e: unknown) => e is U,
  typeName: string,
): GuardedType<typeof typeGuard> => {
  if(!typeGuard(e)) {
    throw new Error(`${e} is not ${typeName}`);
  }

  return e;
};
