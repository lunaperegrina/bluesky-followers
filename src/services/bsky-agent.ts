import { AtpAgent, type AtpSessionData, type AtpSessionEvent } from "@atproto/api";

export const bskyAgent = new AtpAgent({
	service: "https://bsky.social",
	persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
		if (sess) {
			sessionStorage.setItem("session", JSON.stringify(sess));
		}
	},
});
