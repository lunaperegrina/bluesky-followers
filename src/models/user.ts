export interface Profile {
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
			followers: Follower[];
		};
	};
	labels: Label[];
	createdAt: string;
	description: string;
	indexedAt: string;
	banner: string;
	followersCount: number;
	followsCount: number;
	postsCount: number;
}

export interface Follower {
	did: string;
	handle: string;
	displayName: string;
	avatar: string;
	associated: {
		chat: {
			allowIncoming: string;
		};
	};
	viewer: {
		muted: boolean;
		blockedBy: boolean;
		following?: string;
		followedBy?: string;
	};
	labels: Label[];
	description?: string;
	createdAt: string;
}

export interface Label {
	src: string;
	uri: string;
	cid: string;
	val: string;
	cts: string;
}

export interface Credentials {
	identifier: string;
	password: string;
}

export interface Session {
	token: string;
	did: string;
}

export interface FollowsResponse {
	cursor: string;
	follows: Follower[];
}
