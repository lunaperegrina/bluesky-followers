import { bskyApi } from "@/bsky-api";
import type { FollowerProps } from "@/interfaces/follower";

export async function getFollows(did: string): Promise<FollowerProps[] | []> {
	let allFollows: FollowerProps[] = [];
	let cursor: string | null = null;

	try {
		do {
			const { data } = await bskyApi.get("/app.bsky.graph.getFollows", {
				params: {
					actor: did,
					cursor: cursor,
					limit: 99,
				},
			});

			allFollows = [...allFollows, ...data.follows];
			cursor = data.cursor as string | null;
		} while (cursor);

		return allFollows;
	} catch (error) {
		console.error("Error fetching follows:", error);
		return [];
	}
}
