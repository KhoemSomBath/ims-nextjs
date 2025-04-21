'use client';

import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import React, { useState } from "react";
import Alert from "../ui/alert/Alert";
import { EyeIcon, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInForm({ callBack }: { callBack?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = callBack || searchParams.get('callbackUrl') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Clear any previous errors
            setError(null);

            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
                rememberMe, // Pass rememberMe to the backend if needed
            });

            if (result?.error) {
                // Handle specific error messages from your Spring Boot API
                if (result.error === "CredentialsSignin") {
                    setError("Invalid username or password");
                } else {
                    setError(result.error);
                }
            } else if (result?.ok) {
                // Successful login
                router.push(callbackUrl);
                router.refresh(); // Ensure client state is updated
            } else {
                setError("An unexpected error occurred");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err instanceof Error ? err.message : "Login failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign In
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <Alert
                                variant="error"
                                title="Login Error"
                                message={error}
                                showLink={false}
                            />
                        </div>
                    )}

                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Username <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="username"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeIcon size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={setRememberMe}
                                            disabled={isSubmitting}
                                        />
                                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Keep me logged in
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        disabled={isSubmitting}
                                        type="submit"
                                        aria-disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Signing in...
                                            </span>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}