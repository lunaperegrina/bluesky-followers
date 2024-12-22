"use client";

import { PasswordInput } from "@/components/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UsernameInput } from "@/components/username-input";
import { useToast } from "@/hooks/use-toast";
import { bskyAgent } from "@/services/bsky-agent";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		async function resume() {
			const session = sessionStorage.getItem("session");

			if (session) {
				const savedSessionData = JSON.parse(session);
				await bskyAgent.resumeSession(savedSessionData);
			}
		}

		resume();
	}, []);

	useEffect(() => {
		if (bskyAgent.hasSession) {
			router.push("/followers");
		}
	}, [bskyAgent]);

	const formSchema = z.object({
		identifier: z.string().min(3, {
			message: "Por favor, insira um username de pelo menos 3 caracteres.",
		}),
		password: z.string().min(3, {
			message: "Por favor, insira uma senha de pelo menos 3 caracteres.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await bskyAgent.login({
				identifier: values.identifier,
				password: values.password,
			});

			toast({
				title: "Login realizado com sucesso! 💖",
			});

			router.push("/followers");
		} catch (error) {
			console.error(error);
			if ((error as { message: string }).message.includes("Invalid identifier or password")) {
				toast({
					title: "Username ou senha incorretos 😕",
				});
				return;
			}
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen mx-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Bluesky Followers</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
							<FormField
								control={form.control}
								name="identifier"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>username</FormLabel>
										<FormControl>
											<UsernameInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>password</FormLabel>
										<FormControl>
											<PasswordInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className="w-full bg-blue-500">Login</Button>
						</form>
					</Form>
					<Alert variant="default">
						<Lightbulb className="h-4 w-4" />
						<p>
							Use App Passwords for greater security! Go to{" "}
							<a href="https://bsky.app/settings" className="underline text-primary" target="_blank" rel="noreferrer">
								Settings
							</a>{" "}
							&gt; App Passwords and generate your password!
						</p>
					</Alert>
					{/* <Alert variant="default">
						<AlertTriangle className="h-4 w-4" />
						<p>Autenticação de dois fatores (2FA) ainda não é suportada.</p>
					</Alert> */}
				</CardContent>
			</Card>
		</div>
	);
}
