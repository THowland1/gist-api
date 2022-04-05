type Sync<T> = T extends Promise<infer R> ? R : never;
