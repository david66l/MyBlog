"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminArticle, clearToken, getToken, listArticles } from "@/lib/api";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    listArticles()
      .then(setArticles)
      .catch(() => {
        clearToken();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="shell">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            // cms / articles
          </p>
          <h1 style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>Articles</h1>
        </div>
        <div className="row">
          <Link className="btn" href="/articles/import">
            import_md_
          </Link>
          <Link className="btn btn-primary" href="/articles/new">
            new_
          </Link>
          <button className="btn" type="button" onClick={logout}>
            logout_
          </button>
        </div>
      </div>

      {loading && <p>loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>title</th>
                <th>status</th>
                <th>updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <div>{article.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>
                      /{article.slug}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${article.status === "PUBLISHED" ? "badge-published" : "badge-draft"}`}>
                      {article.status}
                    </span>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {new Date(article.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link className="btn" href={`/articles/${article.id}`}>
                      edit_
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
