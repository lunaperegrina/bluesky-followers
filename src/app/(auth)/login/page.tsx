"use client";

import { PasswordInput } from "@/components/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
export default function Component() {
	const { signIn } = useUserContext();
	const { toast } = useToast();

	const router = useRouter();

	const { session } = useUserContext();
	useEffect(() => {
		if (
			session?.access_jwt &&
			session.refresh_jwt &&
			session.did &&
			session.handle
		) {
			router.push("/followers");
		}
	}, [session]);

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
			await signIn({
				identifier: values.identifier,
				password: values.password,
			});

			toast({
				title: "Login realizado com sucesso! 💖",
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.data.message === "Invalid identifier or password") {
					toast({
						title: "Username ou senha incorretos 😕",
					});
				}
			}
			console.error(error);
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Followers on BlueSky</CardTitle>
					{/* <CardDescription>Entre com seu nome de usuário e senha para acessar sua conta.</CardDescription> */}
				</CardHeader>
				<CardContent className="space-y-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
							<FormField
								control={form.control}
								name="identifier"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>
											Username
											{/* <span className="text-red-500">*</span> */}
										</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Your username" />
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
										<FormLabel>
											Password
											{/* <span className="text-red-500">*</span> */}
										</FormLabel>
										<FormControl>
											<PasswordInput {...field} placeholder="Your password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className="w-full bg-primary">Entrar</Button>
						</form>
					</Form>
					<Alert variant="default">
						<AlertTriangle className="h-4 w-4" />
						<p>Autenticação de dois fatores (2FA) ainda não é suportada.</p>
					</Alert>
				</CardContent>
			</Card>
		</div>
	);
}
