import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

const ROLES = [
  { key: "super", label: "超级管理员", account: "admin@aufe.edu.cn", password: "Admin123" },
  { key: "specialist", label: "专人 · 陈专员", account: "chen@aufe.edu.cn", password: "Test123" },
  { key: "advisor", label: "管理员 · 张老师", account: "zhang@aufe.edu.cn", password: "Test123" },
];

export const Route = createFileRoute("/split")({
  head: () => ({
    meta: [
      { title: "三角色联调｜招生管理后台" },
      { name: "description", content: "同时以超级管理员、专人、管理员三个身份操作后台，测试权限与消息提醒。" },
      { property: "og:title", content: "三角色联调｜招生管理后台" },
      { property: "og:description", content: "并排测试三个身份的后台页面。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SplitPage,
});

function setVal(el: HTMLInputElement, v: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, v);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function Pane({ role, focused, onFocus }: { role: (typeof ROLES)[number]; focused: boolean; onFocus: () => void }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [nonce, setNonce] = useState(0);
  const src = `/?session=${role.key}`;

  const login = () => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const inputs = Array.from(doc.querySelectorAll("input")) as HTMLInputElement[];
    const pwd = inputs.find((i) => i.type === "password");
    const acc = inputs.find((i) => i !== pwd && i.type !== "checkbox" && i.type !== "hidden");
    if (!acc || !pwd) return alert("该窗口当前不在登录页（可能已登录）。");
    setVal(acc, role.account);
    setVal(pwd, role.password);
    const btn = (pwd.form?.querySelector('button[type="submit"], button') ??
      doc.querySelector('button[type="submit"]')) as HTMLButtonElement | null;
    setTimeout(() => btn?.click(), 50);
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-border last:border-r-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted px-3 py-2 text-xs">
        <strong className="text-sm text-foreground">{role.label}</strong>
        <span className="text-muted-foreground">{role.account} / {role.password}</span>
        <div className="ml-auto flex gap-1">
          <button className="rounded bg-primary px-2 py-1 text-primary-foreground" onClick={login}>一键登录</button>
          <button className="rounded border border-border px-2 py-1" onClick={() => setNonce((n) => n + 1)}>刷新</button>
          <button className="rounded border border-border px-2 py-1" onClick={onFocus}>{focused ? "还原" : "放大"}</button>
          <a className="rounded border border-border px-2 py-1" href={src} target="_blank" rel="noreferrer">新窗口</a>
        </div>
      </div>
      <iframe key={nonce} ref={ref} src={src} title={role.label} className="w-full flex-1 bg-background" />
    </section>
  );
}

function SplitPage() {
  const [focus, setFocus] = useState<string | null>(null);
  const reset = () => {
    if (!confirm("清空所有测试数据并恢复初始演示数据？")) return;
    Object.keys(localStorage).forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage).forEach((k) => sessionStorage.removeItem(k));
    location.reload();
  };
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border px-4 py-2 text-sm">
        <strong>三角色联调</strong>
        <span className="text-muted-foreground">三个窗口共用同一份数据，各自独立登录</span>
        <a href="/" className="ml-auto underline">返回单页</a>
        <button className="rounded border border-border px-2 py-1" onClick={reset}>重置测试数据</button>
      </header>
      <div className="flex min-h-0 flex-1">
        {ROLES.filter((r) => !focus || r.key === focus).map((r) => (
          <Pane key={r.key} role={r} focused={focus === r.key} onFocus={() => setFocus(focus === r.key ? null : r.key)} />
        ))}
      </div>
    </div>
  );
}
