"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { GithubIcon } from "@/components/icons/GithubIcon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import LoginLoading from "./loading";

export default function LoginContent() {
    const params = useSearchParams();
    const router = useRouter();
    const error = params.get("error");
    const next = params.get("next") || "/dashboard";
    //const { data: user, isLoading } = useCurrentUser();

    const user = null;
    const isLoading = false;

    if (isLoading || !user) {
        return <LoginLoading />;
    }

    return (
        <div>
            LoginPage
        </div>
    );
}
