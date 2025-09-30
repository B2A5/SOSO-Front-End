import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://soso.dreampaste.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Custom instance for orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error cancel is a custom property
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;
