export type ResolveType<T> = (value: T | PromiseLike<T>) => void;
export type RejectType = (reason?: any) => void;
