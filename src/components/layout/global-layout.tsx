import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/dropie_logo.svg";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck } from "lucide-react";
import { useIsLoggedIn, useRole } from "@/store/auth";
import { useMeData } from "@/hooks/queries/use-me-data";

export default function GlobalLayout() {
  const isLoggedIn = useIsLoggedIn();
  const role = useRole();
  const { data: me } = useMeData({ enabled: isLoggedIn });

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-6 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[540px] flex-col overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-xl">
        <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5">
            <Link to="/" className="-mt-2 flex items-center gap-2">
              <img className="h-10 w-auto" src={logo} alt="Dropie 로고" />
            </Link>

            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {role === "ADMIN" && (
                    <Link to="/admin">
                      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f4c9cf] transition hover:bg-[#fff0f3]">
                        <ShieldCheck className="h-5 w-5 text-[#f48b94]" />
                      </button>
                    </Link>
                  )}
                  <Link to="/my">
                    <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-neutral-200 transition hover:bg-neutral-50">
                      {me?.profileImageUrl ? (
                        <img
                          src={me.profileImageUrl}
                          alt="프로필"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-neutral-600" />
                      )}
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      로그인
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button size="sm">회원가입</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white px-4 py-5">
          <Outlet />
        </main>

        <footer className="border-t border-neutral-100 bg-white px-5 py-3">
          <div className="text-center text-xs text-neutral-500">
            © 2026 Dropie
          </div>
        </footer>
      </div>
    </div>
  );
}
