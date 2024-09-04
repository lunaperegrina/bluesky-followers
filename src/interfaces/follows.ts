import type { FollowerProps } from "./follower";
import type { ProfileProps } from "./user-context";

export interface FollowsProps {
	subject: ProfileProps;
	cursor: string;
	follows: FollowerProps[];
}
