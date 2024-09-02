import axios, { type AxiosResponse } from "axios";
import { headers } from "next/headers";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_URL = "https://bsky.social/xrpc";

import type {
	Credentials,
	Follower,
	FollowsResponse,
	Profile,
	Session,
} from "@/models/user";

type State = {
	session: Session;
	user: Profile;
	follows: Follower[];
};

type Actions = {
	createSession: (
		credentials: Credentials,
		locale?: string,
	) => Promise<{ token: string; did: string }>;
	getProfile: (did: string, token: string) => Promise<void>;
	getFollows: (did: string, token: string) => Promise<void>;
};

export const useUserContext = create(
	persist<State & Actions>(
		(set) => ({
			session: {} as Session,
			user: {} as Profile,
			follows: [] as Follower[],
			createSession: async (credentials: Credentials) => {
				const { data } = await axios.post(
					`${API_URL}/com.atproto.server.createSession`,
					{
						identifier: credentials.identifier,
						password: credentials.password,
					},
				);

				set({ session: { token: data.accessJwt, did: data.did } });

				return { token: data.accessJwt, did: data.did };
			},
			getProfile: async (did: string, token: string) => {
				const { data } = await axios.get(
					`${API_URL}/app.bsky.actor.getProfile`,
					{
						params: {
							actor: did,
						},
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				set({ user: data });
			},
			getFollows: async (did: string, token: string) => {
				let allFollows: Follower[] = [];
				let cursor = null;

				try {
					do {
						const { data }: AxiosResponse<FollowsResponse> = await axios.get(
							`${API_URL}/app.bsky.graph.getFollows`,
							{
								params: {
									actor: did,
									cursor: cursor,
									limit: 99,
								},
								headers: {
									Authorization: `Bearer ${token}`,
								},
							},
						);

						allFollows = [...allFollows, ...data.follows];
						cursor = data.cursor;
					} while (cursor);

					set({ follows: allFollows });
				} catch (error) {
					console.error("Error fetching follows:", error);
				}
			},
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
