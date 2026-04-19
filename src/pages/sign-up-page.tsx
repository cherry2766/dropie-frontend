import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { Spinner } from "@/components/ui/spinner";

// 백엔드 SignUpRequest 유효성 규칙과 동일하게 맞춤
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]+$/;

type FormFields = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!form.email.trim()) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "이메일 형식이 올바르지 않습니다.";
  }

  if (!form.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (form.password.length < 8 || form.password.length > 20) {
    errors.password = "비밀번호는 8자 이상 20자 이하여야 합니다.";
  } else if (!PASSWORD_REGEX.test(form.password)) {
    errors.password = "비밀번호는 영문과 숫자를 포함해야 합니다.";
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = "비밀번호를 한 번 더 입력해주세요.";
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }

  if (!form.nickname.trim()) {
    errors.nickname = "닉네임을 입력해주세요.";
  } else if (form.nickname.length < 2 || form.nickname.length > 10) {
    errors.nickname = "닉네임은 2자 이상 10자 이하여야 합니다.";
  } else if (!NICKNAME_REGEX.test(form.nickname)) {
    errors.nickname = "닉네임에 특수문자를 사용할 수 없습니다.";
  }

  return errors;
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormFields>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: signUp, isPending } = useSignUp();

  function handleChange(field: keyof FormFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // 해당 필드 에러만 실시간으로 지워줌
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    signUp({ email: form.email, password: form.password, nickname: form.nickname });
  }

  return (
    <div className="px-4 pt-8 pb-10">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {/* 로고 */}
        <div className="mb-4 text-center">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#f48b94]">
            Droppie
          </h1>
          <p className="mt-1 text-sm text-[#9f8f95]">지금 인기 디저트를 확인해보세요</p>
        </div>

        {/* 타이틀 */}
        <div className="mb-3 text-center">
          <h2 className="text-[28px] font-bold text-[#5c4f55]">Sign Up</h2>
        </div>

        {/* 이메일 */}
        <div className="mb-3">
          <div
            className={`flex h-14 items-center rounded-2xl border bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1] ${
              errors.email ? "border-red-300" : "border-[#f4c9cf]"
            }`}
          >
            <Mail className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-3">
          <div
            className={`flex h-14 items-center rounded-2xl border bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1] ${
              errors.password ? "border-red-300" : "border-[#f4c9cf]"
            }`}
          >
            <Lock className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="password"
              placeholder="비밀번호 (영문+숫자 8~20자)"
              value={form.password}
              onChange={handleChange("password")}
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-3">
          <div
            className={`flex h-14 items-center rounded-2xl border bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1] ${
              errors.passwordConfirm ? "border-red-300" : "border-[#f4c9cf]"
            }`}
          >
            <Lock className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={form.passwordConfirm}
              onChange={handleChange("passwordConfirm")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>
          {errors.passwordConfirm && (
            <p className="mt-1 text-xs text-red-400">{errors.passwordConfirm}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-5">
          <div
            className={`flex h-14 items-center rounded-2xl border bg-[#fffafb] px-4 focus-within:ring-2 focus-within:ring-[#f7b8c1] ${
              errors.nickname ? "border-red-300" : "border-[#f4c9cf]"
            }`}
          >
            <User className="mr-3 h-5 w-5 text-[#e89aa5]" />
            <input
              type="text"
              placeholder="닉네임 (한글·영문·숫자 2~10자)"
              value={form.nickname}
              onChange={handleChange("nickname")}
              className="w-full bg-transparent text-[15px] text-[#5c4f55] outline-none placeholder:text-[#c6b7bc]"
            />
          </div>
          {errors.nickname && (
            <p className="mt-1 text-xs text-red-400">{errors.nickname}</p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-14 w-full rounded-2xl bg-[#f48b94] text-base font-semibold text-white shadow-[0_8px_20px_rgba(244,139,148,0.35)] transition hover:bg-[#ee7b86] disabled:opacity-60"
        >
          {isPending ? (
            <Spinner className="h-4 w-4 border-white/40 border-t-white" />
          ) : (
            "회원가입"
          )}
        </button>

        {/* 로그인 이동 */}
        <p className="mt-5 text-center text-sm text-[#8f7f85]">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-semibold text-[#f48b94] hover:text-[#eb7481]">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
