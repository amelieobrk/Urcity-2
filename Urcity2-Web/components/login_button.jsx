import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession(); //Pass around the session -> Alles in unserer App kommt durch props -> Wohin wir auch gehen haben wir die Session, sesison überall verfügbar

  return (
    <div>
      {!session ? (
        <>
          <button onClick={signIn}>Einloggen</button>
        </>
      ) : (
        <button onClick={() => signOut({ callbackUrl: "/" })}>Ausloggen</button>
      )}
    </div>
  );
}
