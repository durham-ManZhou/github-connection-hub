import { createFileRoute } from "@tanstack/react-router";
import shellHtml from "../original-shell.html?raw";

// Serves the original admin app shell unchanged. The original compiled UI lives in
// public/assets and talks to POST /api/cloud (falls back to its built-in demo data).
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () =>
        new Response(shellHtml, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
  head: () => ({
    meta: [
      { title: "招生管理后台｜安徽财经大学海外教育" },
      { name: "description", content: "管理首页、留学服务、启动广告、客户跟进与到校预约的招生后台。" },
      { property: "og:title", content: "招生管理后台｜安徽财经大学海外教育" },
      { property: "og:description", content: "管理首页、留学服务、启动广告、客户跟进与到校预约的招生后台。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
