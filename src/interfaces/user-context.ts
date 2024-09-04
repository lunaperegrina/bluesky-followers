import type { LabelProps } from "@radix-ui/react-label";
import type { FollowerProps } from "./follower";

export interface CredentialsProps {
	identifier: string;
	password: string;
}

export interface SessionProps {
	access_jwt: string;
	refresh_jwt: string;
	handle: string;
	did: string;
}

export interface ProfileProps {
	did: string;
	handle: string;
	displayName: string;
	avatar: string;
	associated: {
		lists: number;
		feedgens: number;
		starterPacks: number;
		labeler: boolean;
		chat: {
			allowIncoming: string;
		};
	};
	viewer: {
		muted: boolean;
		blockedBy: boolean;
		knownFollowers: {
			count: number;
			followers: FollowerProps[];
		};
	};
	labels: LabelProps[];
	createdAt: string;
	description: string;
	indexedAt: string;
	banner: string;
	followersCount: number;
	followsCount: number;
	postsCount: number;
}

export type UserStorageProps = UserStorage | undefined;

interface UserStorage {
	state: {
		session: SessionProps | undefined;
		user: ProfileProps | undefined;
	};
	version: number;
}
