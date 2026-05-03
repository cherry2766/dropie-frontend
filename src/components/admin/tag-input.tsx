import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAdminTagsSearchData } from "@/hooks/queries/use-admin-tags-search-data";
import type { TagEntity } from "@/types";

interface Props {
  // 현재 선택된 태그의 raw 이름 배열 (# 미포함)
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

// 응답의 tag.name은 "#달콤한" 형태 → 페이로드용 raw로 변환
function stripPrefix(name: string): string {
  return name.replace(/^#/, "");
}

// 입력값 정규화 — 공백 trim, 사용자가 #를 같이 쳐도 제거
function normalize(raw: string): string {
  return raw.trim().replace(/^#+/, "").trim();
}

export default function TagInput({ value, onChange, placeholder }: Props) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // raw 상태 — 사용자 화살표 입력 인덱스. 표시·사용 시점에 suggestions 길이로 clamp
  const [rawHighlightIdx, setRawHighlightIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 300ms debounce — 노션 스펙
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data: searchResults = [] } = useAdminTagsSearchData(debounced);

  // 이미 선택된 태그는 드롭다운에서 제외
  const suggestions: TagEntity[] = useMemo(() => {
    const selected = new Set(value);
    return searchResults.filter((t) => !selected.has(stripPrefix(t.name)));
  }, [searchResults, value]);

  // suggestion 갯수가 변해도 안전하도록 렌더 시 clamp
  const highlightIdx = suggestions.length > 0
    ? Math.min(rawHighlightIdx, suggestions.length - 1)
    : 0;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(raw: string) {
    const cleaned = normalize(raw);
    if (!cleaned) return;
    if (value.includes(cleaned)) {
      setInput("");
      return;
    }
    onChange([...value, cleaned]);
    setInput("");
    setRawHighlightIdx(0);
  }

  function removeTag(target: string) {
    onChange(value.filter((t) => t !== target));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      // 자동완성 결과가 있고 highlight가 유효하면 그 값을 사용, 아니면 입력값 그대로
      if (suggestions.length > 0 && highlightIdx < suggestions.length) {
        addTag(stripPrefix(suggestions[highlightIdx].name));
      } else if (input.trim()) {
        addTag(input);
      }
      return;
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      // 입력창이 비어있을 때 백스페이스 → 마지막 chip 제거 (UX 관례)
      removeTag(value[value.length - 1]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setRawHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setRawHighlightIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  }

  const showDropdown = isFocused && debounced.length > 0 && suggestions.length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 focus-within:border-[#f48b94] focus-within:ring-1 focus-within:ring-[#f48b94]">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-[#ffd6e0] px-2.5 py-0.5 text-xs font-semibold text-[#f48b94]"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-white/60"
              aria-label={`${tag} 태그 제거`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? (placeholder ?? "태그 입력 후 Enter") : ""}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </div>

      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg">
          {suggestions.map((tag, idx) => (
            <li key={tag.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(stripPrefix(tag.name))}
                onMouseEnter={() => setRawHighlightIdx(idx)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition ${
                  idx === highlightIdx
                    ? "bg-[#fff0f3] text-[#f48b94]"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
