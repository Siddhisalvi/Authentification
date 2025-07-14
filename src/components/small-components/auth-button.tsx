"use client";


import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import SignoutButton from "./signout-button";

export default function AuthButtons() {
	const { data, isPending } = authClient.useSession();
	if (isPending) return <div>Loading...</div>;

	const session = data;

	return !session ? (
		<div className="flex gap-2 justify-center">
			<Link href="/signin">
				<Button>Sign In</Button>
			</Link>
			<Link href="/signin">
				<Button>Sign Up</Button>
			</Link>
		</div>
	) : (
		<div className="flex items-center gap-2">
			<SignoutButton />
		</div>
	);
	
}