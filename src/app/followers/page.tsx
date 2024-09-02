"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/userContext";
import { AtpAgent } from "@atproto/api";
import { Plus } from "lucide-react";
import { UserRoundMinus } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
	const { user, session, getProfile, follows, getFollows } = useUserContext();

	async function fetchData(callback: () => Promise<void>) {
		try {
			await callback();
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (session.did) {
			fetchData(async () => {
				await getProfile(session.did, session.token);
				await getFollows(session.did, session.token);
			});
		}
		return;
	}, [session]);

	return (
		<div className="w-full max-w-md mx-auto bg-background rounded-lg shadow-lg overflow-hidden mt-40">
			<div className="p-8 space-y-6">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarImage src={user?.avatar} alt="@shadcn" />
						<AvatarFallback>
							{user?.handle?.slice(0, 2).toUpperCase() || "?"}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<div className="text-xl font-semibold">{user?.displayName}</div>
						<div className="text-muted-foreground">@{user?.handle}</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 text-center">
					<div>
						<div className="text-2xl font-bold">{user?.followersCount}</div>
						<div className="text-muted-foreground">Followers</div>
					</div>
					<div>
						<div className="text-2xl font-bold">{user?.followsCount}</div>
						<div className="text-muted-foreground">Following</div>
					</div>
					<div>
						<div className="text-2xl font-bold">
							{user?.viewer?.knownFollowers.count}
						</div>
						<div className="text-muted-foreground">Mutuals</div>
					</div>
					<div>
						<div className="text-2xl font-bold">
							{follows?.filter((follow) => !follow.viewer?.followedBy).length}
						</div>
						<div className="text-muted-foreground">Don't follow you</div>
					</div>
				</div>
				<div className="bg-muted rounded-lg p-4">
					<h2 className="text-lg font-semibold mb-2">Don't follow you</h2>
					<ul className="space-y-6 md:space-y-2">
						{follows
							?.filter((follow) => !follow?.viewer?.followedBy)
							.map((follow) => (
								<div
									className="flex flex-col justify-between overflow-hidden gap-4 md:flex-row"
									key={follow?.handle}
								>
									<div className="flex items-center gap-4">
										<Avatar className="h-10 w-10">
											<AvatarImage src={follow?.avatar} alt="@shadcn" />
											<AvatarFallback>
												{follow?.handle?.slice(0, 2).toUpperCase() || "?"}
											</AvatarFallback>
										</Avatar>
										<div className="space-y-1">
											<div className="text-md font-semibold">
												{follow?.displayName}
											</div>
											<div className="text-muted-foreground">
												@{follow?.handle}
											</div>
										</div>
									</div>
									<Button variant="destructive" size="sm">
										<UserRoundMinus size={16} />
									</Button>
								</div>
							))}
					</ul>
				</div>
			</div>
		</div>
	);
}
