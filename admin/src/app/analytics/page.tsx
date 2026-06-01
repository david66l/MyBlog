"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearToken,
  getToken,
  getVisitAnalytics,
  type VisitAnalytics,
} from "@/lib/api";

function formatTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<VisitAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    getVisitAnalytics()
      .then(setData)
      .catch(() => {
        clearToken();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="shell">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            // cms / analytics
          </p>
          <h1 style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>Visitors</h1>
        </div>
        <Link className="btn" href="/articles">
          back_
        </Link>
      </div>

      {loading && <p>loading...</p>}

      {data && (
        <>
          <div className="row" style={{ gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div className="card" style={{ minWidth: 160 }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>总访问次数</p>
              <p style={{ fontSize: "1.75rem", marginTop: 8 }}>{data.summary.totalVisits}</p>
            </div>
            <div className="card" style={{ minWidth: 160 }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>独立 IP</p>
              <p style={{ fontSize: "1.75rem", marginTop: 8 }}>{data.summary.uniqueIps}</p>
            </div>
            <div className="card" style={{ minWidth: 160 }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>今日访问</p>
              <p style={{ fontSize: "1.75rem", marginTop: 8 }}>{data.summary.todayVisits}</p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>按 IP 汇总</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>IP</th>
                  <th>访问次数</th>
                  <th>首次访问</th>
                  <th>最近访问</th>
                </tr>
              </thead>
              <tbody>
                {data.visitors.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: "rgba(255,255,255,0.35)" }}>
                      暂无访问记录
                    </td>
                  </tr>
                )}
                {data.visitors.map((visitor) => (
                  <tr key={visitor.ip}>
                    <td>{visitor.ip}</td>
                    <td>{visitor.visitCount}</td>
                    <td>{formatTime(visitor.firstSeen)}</td>
                    <td>{formatTime(visitor.lastSeen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>最近 100 条访问</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>IP</th>
                  <th>路径</th>
                  <th>Referer</th>
                  <th>User-Agent</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ color: "rgba(255,255,255,0.35)" }}>
                      暂无访问记录
                    </td>
                  </tr>
                )}
                {data.recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatTime(log.createdAt)}</td>
                    <td>{log.ip}</td>
                    <td>{log.path}</td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {log.referer || "—"}
                    </td>
                    <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {log.userAgent || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
