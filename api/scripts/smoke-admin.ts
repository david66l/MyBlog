const API = process.env.API_URL ?? "http://localhost:4000";

async function request(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<{ status: number; body: string }> {
  const headers = new Headers(init.headers ?? {});
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API}${path}`, {
    ...init,
    headers,
  });
  const body = await response.text();
  return { status: response.status, body };
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

async function main() {
  const login = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@louis-dev.cloud", password: "admin123" }),
  });
  assert(login.status === 200, `login failed: ${login.status} ${login.body}`);
  const { token } = JSON.parse(login.body) as { token: string };

  const list = await request("/admin/articles", {}, token);
  assert(list.status === 200, `list failed: ${list.status} ${list.body}`);
  const articles = JSON.parse(list.body) as Array<{ id: string; slug: string }>;
  assert(articles.length > 0, "no articles in db");

  const slug = `smoke-${Date.now()}`;
  const create = await request(
    "/admin/articles",
    {
      method: "POST",
      body: JSON.stringify({
        slug,
        title: "Smoke test",
        excerpt: "excerpt",
        content: "## hello",
        category: "thoughts",
        categoryLabel: "随笔",
        readTime: "5 min",
        status: "DRAFT",
      }),
    },
    token,
  );
  assert(create.status === 201, `create failed: ${create.status} ${create.body}`);
  const created = JSON.parse(create.body) as { id: string };

  const update = await request(
    `/admin/articles/${created.id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: "Smoke test updated",
        excerpt: "updated excerpt",
        content: "## updated",
        category: "engineering",
        categoryLabel: "工程实践",
        readTime: "6 min",
      }),
    },
    token,
  );
  assert(update.status === 200, `update failed: ${update.status} ${update.body}`);

  const publish = await request(
    `/admin/articles/${created.id}/publish`,
    { method: "POST" },
    token,
  );
  assert(publish.status === 200, `publish failed: ${publish.status} ${publish.body}`);

  const pubList = await request("/api/articles");
  assert(pubList.status === 200, `public list failed: ${pubList.status}`);
  const published = JSON.parse(pubList.body) as Array<{ slug: string }>;
  assert(
    published.some((item) => item.slug === slug),
    "published article missing from public API",
  );

  const pubDetail = await request(`/api/articles/${slug}`);
  assert(pubDetail.status === 200, `public detail failed: ${pubDetail.status}`);

  const unpublish = await request(
    `/admin/articles/${created.id}/unpublish`,
    { method: "POST" },
    token,
  );
  assert(unpublish.status === 200, `unpublish failed: ${unpublish.status} ${unpublish.body}`);

  const del = await request(
    `/admin/articles/${created.id}`,
    { method: "DELETE" },
    token,
  );
  assert(del.status === 204, `delete failed: ${del.status} ${del.body}`);

  const parseMd = await request(
    "/admin/articles/parse-markdown",
    {
      method: "POST",
      body: JSON.stringify({
        markdown: "---\ntitle: Test\n---\n\nBody",
        filename: "test.md",
      }),
    },
    token,
  );
  assert(parseMd.status === 200, `parse-md failed: ${parseMd.status} ${parseMd.body}`);

  console.log("smoke-admin: all checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
