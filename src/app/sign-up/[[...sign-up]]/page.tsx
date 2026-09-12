import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isClerkEnabled } from "@/lib/auth";

export default function SignUpPage() {
  if (!isClerkEnabled()) {
    redirect("/verify");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-stone-50 px-4 py-16">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-stone-200",
          },
        }}
      />
    </div>
  );
}
