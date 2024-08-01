import { Pageable } from './dto/base-paginated-filter.dto';

export const unPaged: Pageable = {
  order: null,
  skip: null,
  take: null
};

export const googleClientId =
  '968174945289-aipc44p9o7sqtri2jbp6vv2kk1qpi857.apps.googleusercontent.com';

export const mongodbInjectionToken = 'DATABASE_CONNECTION'
