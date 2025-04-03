'use client';

import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import React, {useState} from "react";
import Alert from "../ui/alert/Alert";
import type {LoginRequest} from "@/types/Auth";
import {EyeIcon, EyeOff} from "lucide-react";
import {useRouter} from "next/navigation";

interface SignInFormProps {
    onSubmitAction: (ormData: LoginRequest) => Promise<{ error?: string }>,
    callBack?: string
}

export default function SignInForm({onSubmitAction, callBack}: SignInFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null); // Error state
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on new submission
        setIsSubmitting(true);

        try {
            const respond = await onSubmitAction({
                username,
                password,
                rememberMe: isChecked
            },);

            if (respond?.error) {
                setError(respond.error);
            }

            router.replace(callBack || '/');

        } catch (err) {
            // Handle different error types
            setError(
                err instanceof Error
                    ? err.message
                    : "Login failed. Please try again."
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

                    {/* Show error alert if exists */}
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
                            {/* Rest of your form remains the same */}
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        username <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        placeholder="Username"
                                        type="text"
                                        defaultValue={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            defaultValue={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                                            ) : (
                                                <EyeOff className="fill-gray-500 dark:fill-gray-400"/>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isChecked} onChange={setIsChecked}/>
                                        <span
                                            className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Keep me logged in
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Signing in..." : "Sign in"}
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