import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { SubmitButton } from "./submit-button";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const searchParams = await props.searchParams;
  const hasError = searchParams.error !== undefined;

  async function authenticate(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=1");
      }
      throw error;
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-bgreen-dark p-12 text-paper lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 10%, rgba(184,134,11,0.35), transparent), radial-gradient(50% 40% at 90% 85%, rgba(159,43,37,0.35), transparent)",
          }}
        />
        <Image
          src="/brand/logo.png"
          alt="Quan Travel"
          width={140}
          height={140}
          className="relative size-[140px] rounded-2xl bg-paper/5 p-2"
          priority
        />
        <div className="relative">
          <p className="font-display text-3xl leading-tight tracking-[-0.02em]">
            Куан туралы контентті — бір орталықтан басқарыңыз.
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-paper/70">
            Турлар, галерея, пікірлер, басты бет блоктары және өтінімдер — Quan
            Travel әкімшілік панелі.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Image
            src="/brand/logo.png"
            alt="Quan Travel"
            width={56}
            height={56}
            className="mb-8 size-14 rounded-xl lg:hidden"
          />
          <h1 className="font-display text-[28px] leading-tight tracking-[-0.02em] text-ink">
            Әкімшілік панельге кіру
          </h1>
          <p className="mt-2 text-[15px] leading-[1.7] text-muted">
            Email және құпия сөзіңізді енгізіңіз.
          </p>

          <form action={authenticate} className="mt-8 flex flex-col gap-5">
            {hasError && (
              <p
                role="alert"
                className="rounded-lg border border-bred-light/40 bg-bred/10 px-4 py-3 text-[14px] leading-snug text-bred-dark"
              >
                Email немесе құпия сөз қате. Қайталап көріңіз.
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="owner@quantravel.kz"
                className="h-12 rounded-lg border border-line bg-white px-4 text-[15px] text-ink outline-none
                           transition-colors placeholder:text-muted/60
                           focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-ink">
                Құпия сөз
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 rounded-lg border border-line bg-white px-4 text-[15px] text-ink outline-none
                           transition-colors placeholder:text-muted/60
                           focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
              />
            </div>

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
