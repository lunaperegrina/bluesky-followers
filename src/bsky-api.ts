import axios, { type AxiosError } from "axios";
import type { UserStorageProps } from "./interfaces/user-context";

const API_URL = "https://bsky.social/xrpc";

let userStorage: UserStorageProps;

if (typeof window !== "undefined" && window.sessionStorage) {
	const storage = window.sessionStorage.getItem("user-storage") ?? "";
	userStorage = storage.length > 0 ? JSON.parse(storage) : undefined;
}

export const bskyApi = axios.create({
	baseURL: API_URL,
	headers: userStorage
		? { Authorization: `Bearer ${userStorage.state.session?.access_jwt}` }
		: {},
});

let isRefreshing = false;
const failedRequestQueue = [];

bskyApi.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		console.log(error);

		if (error.response?.status === 400) {
			const currentAccessJwt = userStorage?.state.session?.access_jwt;
			const currentRefreshJwt = userStorage?.state.session?.refresh_jwt;
			const originalConfig = error.config;

			if (!isRefreshing) {
				isRefreshing = true;

				// TODO: Handle refresh token
				// axios
				//   .post(API_URL + '/auth/refresh', {
				//     token: currentToken,
				//   })
				//   .then((response) => {
				//     const { access_token } = response.data;
				//     localStorage.setItem('token', access_token);

				//     bskyApi.defaults.headers['Authorization'] = `Bearer ${access_token}`;

				//     failedRequestQueue.forEach((request) =>
				//       request.onSuccess(access_token),
				//     );
				//     failedRequestQueue = [];
				//   })
				//   .catch((err) => {
				//     failedRequestQueue.forEach((request) => request.onFailure(err));
				//     failedRequestQueue = [];
				//     // logOut();
				//   })
				//   .finally(() => {
				//     isRefreshing = false;
				//   });
			}

			return new Promise((resolve, reject) => {
				failedRequestQueue.push({
					onSuccess: (token: string) => {
						if (originalConfig) {
							originalConfig.headers.Authorization = `Bearer ${token}`;
							resolve(bskyApi(originalConfig));
						}
					},
					onFailure: (err: AxiosError) => {
						reject(err);
					},
				});
			});
		}

		return Promise.reject(error);
	},
);
