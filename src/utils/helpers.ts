// src/utils/helpers.ts
export const formatArray = (arr?: string[]): string | undefined =>
  arr?.length ? arr.join(", ") : undefined;