export const compose = (...functions: any) => (args: any) =>
  functions.reduce((arg: any, fn: any) => fn(arg), args);
