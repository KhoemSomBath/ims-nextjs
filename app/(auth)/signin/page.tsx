// app/signin/page.tsx
import SignInForm from '@/components/auth/SignInForm';
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: "Next.js SignIn Page | IMS - Next.js Dashboard",
    description: "This is Next.js Signin Page IMS Dashboard",
};

type LoginPageProps = Promise<{ callbackUrl: string }>

export default async function SignIn(props: { searchParams: LoginPageProps }) {

    const params = await props.searchParams;
    const callbackUrl = params.callbackUrl;

    return (
        <SignInForm
            callBack={callbackUrl}
        />
    );
}