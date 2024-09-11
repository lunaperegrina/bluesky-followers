"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { bskyAgent } from "@/services/bsky-agent";
import type { ProfileView, ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { LogOut, UserRoundMinus } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Component() {
	const [user, setUser] = useState<ProfileViewDetailed>();

	const [follows, setFollows] = useState<ProfileView[]>([]);
	const [cursor, setCursor] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { toast } = useToast();

	useEffect(() => {
		if (!bskyAgent.session) {
			redirect("/login");
		}

		if (bskyAgent.hasSession) {
			getProfile(bskyAgent.session.did);
			getFollows(bskyAgent.session.did);
		}
	}, [bskyAgent]);

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
			isLoading
		) {
			return;
		}

		if (!bskyAgent.session) {
			redirect("/login");
		}

		getFollows(bskyAgent.session.did);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLoading]);

	async function getProfile(did: string) {
		try {
			const { data } = await bskyAgent.getProfile({ actor: did });
			setUser(data);
		} catch (error) {
			console.error(error);
		}
	}

	async function getFollows(did: string) {
		setIsLoading(true);

		try {
			const { data } = await bskyAgent.getFollows({
				actor: did,
				limit: 20,
				cursor: cursor,
			});

			setCursor(data.cursor);
			setFollows([...follows, ...data.follows]);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	async function logOut() {
		// try {
		// 	// await bskyAgent.logout();
		// 	// sessionStorage.removeItem("session");
		// } catch (error) {
		// 	console.error(error);
		// }
	}

	async function unfollow(user: ProfileView) {
		if (!user.viewer?.following) {
			toast({
				title: `Erro ao dar unfollow no usuário ${user.displayName} 😕`,
			});
			return;
		}

		try {
			await bskyAgent.deleteFollow(user.viewer.following);

			const newFollows = follows.filter((f) => f.did !== user.did);
			setFollows(newFollows);

			toast({
				title: `Usuário ${user.displayName} deixou de ser seguido! 💖`,
			});
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<div className="flex justify-end p-4">{/* <LogOut onClick={logOut} className="cursor-pointer" /> */}</div>
			<div className="w-full max-w-md mx-auto bg-background rounded-lg shadow-lg overflow-hidden mt-12">
				<div className="p-8 space-y-6">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage src={user?.avatar} alt="@shadcn" />
							<AvatarFallback>{user?.handle?.slice(0, 2).toUpperCase() || "?"}</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<div className="text-xl font-semibold">{user?.displayName}</div>
							<div className="text-muted-foreground">@{user?.handle}</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold">{user?.followersCount}</div>
							<div className="text-muted-foreground">Seguidores</div>
						</div>
						<div>
							<div className="text-2xl font-bold">{user?.followsCount}</div>
							<div className="text-muted-foreground">Seguindo</div>
						</div>
						{/* <div>
              <div className="text-2xl font-bold">
                {user?.viewer?.knownFollowers?.count}
              </div>
              <div className="text-muted-foreground">Mutuals</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {follows?.filter((follow) => !follow.viewer?.followedBy).length}
              </div>
              <div className="text-muted-foreground">Não te seguem</div>
            </div> */}
					</div>
					<div className="bg-muted rounded-lg p-4">
						<h2 className="text-lg font-semibold mb-2">Não te seguem</h2>
						<ul className="space-y-6 md:space-y-2">
							{follows
								?.filter((follow) => !follow?.viewer?.followedBy)
								.map((follow) => (
									<li className="flex flex-col justify-between overflow-hidden gap-4 md:flex-row" key={follow?.did}>
										<div className="flex items-center gap-4">
											<Avatar className="h-10 w-10">
												<AvatarImage src={follow?.avatar} alt="@shadcn" />
												<AvatarFallback>{follow?.handle?.slice(0, 2).toUpperCase() || "?"}</AvatarFallback>
											</Avatar>
											<div className="space-y-1">
												<div className="text-md font-semibold">{follow?.displayName}</div>
												<div className="text-muted-foreground">@{follow?.handle}</div>
											</div>
										</div>
										<Button variant="destructive" size="sm" onClick={() => unfollow(follow)}>
											<UserRoundMinus size={16} />
										</Button>
									</li>
								))}
						</ul>
						{isLoading && (
							<div className="flex justify-center my-4">
								<LoadingSpinner />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
