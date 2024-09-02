import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { headers } from "next/headers";

const API_URL = 'https://bsky.social/xrpc';
const ONE_MINUTE = 60000;
const ONE_HOUR = 3600000;

interface Credentials {
  identifier: string;
  password: string;
}

interface Session {
  token: string;
  did: string;
}

type State = {
  session: Session;
  user: any;
  follows: any;
  followers: any;
  knownFollowers: any
};

type Actions = {
  createSession: (
    credentials: Credentials,
    locale?: string,
  ) => Promise<{ token: string; did: string }>;
  getProfile: (did: string, token: string) => Promise<void>;
  getFollows: (did: string, token: string) => Promise<void>;
  getKnownFollowers: (did: string, token: string) => Promise<void>;
  getFollowers: (did: string, token: string) => Promise<void>;
};

export const useUserContext = create(
  persist<State & Actions>(
    (set) => ({
      session: {} as Session,
      user: {},
      follows: {},
      knownFollowers: {},
      followers: {},
      createSession: async (credentials: Credentials) => {
        const { data } = await axios.post(`${API_URL}/com.atproto.server.createSession`, {
          identifier: credentials.identifier,
          password: credentials.password,
        });

        set({ session: { token: data.accessJwt, did: data.did } });

        return { token: data.accessJwt, did: data.did };
      },
      getProfile: async (did: string, token: string) => {
        const { data } = await axios.get(`${API_URL}/app.bsky.actor.getProfile`, {
          params: {
            actor: did,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        set({ user: data });
      },
      getFollowers: async (did: string, token: string) => {
        let allFollows: any[] = [];
        let cursor = null;

        try {
          do {
            const { data }: any = await axios.get(`${API_URL}/app.bsky.graph.getFollowers`, {
              params: {
                actor: did,
                cursor: cursor,
                limit: 99
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            allFollows = [...allFollows, ...data.followers];
            cursor = data.cursor;
          } while (cursor);

          set({ follows: allFollows });
        } catch (error) {
          console.error('Error fetching followers:', error);
        }
      },
      getFollows: async (did: string, token: string) => {
        let allFollows: any[] = [];
        let cursor = null;

        try {
          do {
            const { data }: any = await axios.get(`${API_URL}/app.bsky.graph.getFollows`, {
              params: {
                actor: did,
                cursor: cursor,
                limit: 99
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            allFollows = [...allFollows, ...data.follows];
            cursor = data.cursor;
          } while (cursor);

          set({ follows: allFollows });
        } catch (error) {
          console.error('Error fetching follows:', error);
        }
      },
      getKnownFollowers: async (did: string, token: string) => {
        let allKnownFollowers: any[] = [];
        let cursor = null;

        try {
          do {
            const { data }: any = await axios.get(`${API_URL}/app.bsky.graph.getKnownFollowers`, {
              params: {
                actor: did,
                cursor: cursor,
                limit: 20
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            allKnownFollowers = [...allKnownFollowers, ...data.followers];
            cursor = data.cursor;

          } while (cursor);

          set({ knownFollowers: allKnownFollowers });
        } catch (error) {
          console.error('Error fetching getKnownFollowers:', error);
        }
      }
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
