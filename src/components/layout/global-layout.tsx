import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export default function GlobalLayout() {
  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-6 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[540px] flex-col overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-xl">
        <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2">
              <img className="h-7 w-auto" src={logo} alt="Dropie 로고" />
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>

              <Link to="/sign-up">
                <Button size="sm">회원가입</Button>
              </Link>
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
