import { bskyApi } from "@/bsky-api";
import type {
	CredentialsProps,
	ProfileProps,
	SessionProps,
} from "@/interfaces/user-context";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
	session: SessionProps | undefined;
	user: ProfileProps | undefined;
};

type Actions = {
	signIn: (credentials: CredentialsProps, locale?: string) => Promise<void>;
	signOut: () => Promise<void>;
	getProfile: (did: string) => Promise<void>;
};

export const useUserContext = create(
	persist<State & Actions>(
		(set) => ({
			session: undefined as SessionProps | undefined,
			user: undefined as ProfileProps | undefined,
			signIn: async (credentials: CredentialsProps) => {
				const { data } = await bskyApi.post(
					"/com.atproto.server.createSession",
					{
						identifier: credentials.identifier,
						password: credentials.password,
					},
				);

				bskyApi.defaults.headers.Authorization = `Bearer ${data.accessJwt}`;
				set({
					session: {
						access_jwt: data.accessJwt,
						refresh_jwt: data.refreshJwt,
						handle: data.handle,
						did: data.did,
					},
				});
			},
			signOut: async () => {
				sessionStorage.removeItem("user-storage");
				set({ user: undefined });
				set({ session: undefined });
			},
			getProfile: async (did: string) => {
				const { data } = await bskyApi.get("/app.bsky.actor.getProfile", {
					params: {
						actor: did,
					},
				});

				set({ user: data });
			},
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
