// Tipos e API
export { api } from "./api";
export { apiClient } from "./api_client";
export type { ApiErrorResponse } from "./api_client";

// Dados de países
export { countries } from "./countries";
export type { Country } from "./countries";

// Helpers
export { formatArray } from "./helpers";

// Enums
export {
  RoleOptions,
  StatusOptions,
  GenderOptions,
  LanguageOptions,
  CurrencyOptions,
  ThemeOptions,
} from "./enums";

// Links
export {
  LinkPlatformIcon,
  PlatformCategoryMap,
  getPlatformIcon,
  getCategoryByPlatform,
  createLinkWithDefaults,
  formatClickCount,
} from "./link";

// CV Storage
export {
  saveCVToStorage,
  loadCVFromStorage,
  saveCVToCookie,
  loadCVFromCookie,
} from "./cookie-store";
