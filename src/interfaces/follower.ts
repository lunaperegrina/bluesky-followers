import type { LabelProps } from "./label";

export interface FollowerProps {
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
	labels: LabelProps[];
	description?: string;
	createdAt: string;
}
