import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

const API_URL = 'https://bsky.social/xrpc';
const ONE_MINUTE = 60000;
const ONE_HOUR = 3600000;

interface Credentials {
  identifier: string;
  password: string;
}

interface User {
  token: string;
  did: string;
}

type State = {
  user: User;
  setUser: (user: User) => void;
  createSession: (
    credentials: Credentials,
  ) => Promise<{ token: string; did: string }>;
};

type Actions = {
  setUser: (user: User) => void;
  createSession: (
    credentials: Credentials,
    locale?: string,
  ) => Promise<{ token: string; did: string }>;

};

export const useUserContext = create(
  persist<State & Actions>(
    (set) => ({
      user: {} as User,
      setUser: (user: User) => set({ user }),
      createSession: async (credentials: Credentials) => {
        const { data } = await axios.post(`${API_URL}/com.atproto.server.createSession`, {
          identifier: credentials.identifier,
          password: credentials.password,
        });

        set({ user: { token: data.accessJwt, did: data.did } });
        return { token: data.accessJwt, did: data.did };
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
