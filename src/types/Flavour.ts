declare const FLAVOUR: unique symbol;

export type Flavour<T, U extends string> = T & {
  [FLAVOUR]?: U;
};
