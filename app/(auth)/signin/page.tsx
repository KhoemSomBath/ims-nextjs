import SignInForm from "../../../components/auth/SignInForm";
import type {Metadata} from "next";
import type {LoginRequest} from "@/types/Auth";
import {authenticate, createAuthSession} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | IMS - Next.js Dashboard",
  description: "This is Next.js Signin Page IMS Dashboard",
};

type LoginPageProps = Promise<{ callbackUrl: string }>

export default async function SignIn(props: { searchParams: LoginPageProps}) {

  const params = await props.searchParams;
  const callBackUrl = params.callbackUrl;

  async function handleLogin(formData: LoginRequest) {
    'use server'

    const { error, tokens } = await authenticate(formData)

    if (error || !tokens) {
      // Return error to client component instead of redirecting
      return { error: error}
    }

    if(tokens){
      await createAuthSession(tokens, formData.rememberMe)
    }

    return {error: undefined}
  }

  return <SignInForm callBack={callBackUrl} onSubmitAction={handleLogin} />;
}
