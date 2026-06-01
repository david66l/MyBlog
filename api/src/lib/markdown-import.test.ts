import assert from "node:assert/strict";
import { parseMarkdownDocument } from "./markdown-import.js";

const sample = `---
title: 木卫二冰下海洋
slug: europa-ocean
category: astrobiology
excerpt: 自定义摘要
readTime: 10 min
---

## 冰下不是死寂

木卫二表面是裂缝纵横的冰壳。
`;

const parsed = parseMarkdownDocument(sample, "fallback.md");

assert.equal(parsed.title, "木卫二冰下海洋");
assert.equal(parsed.slug, "europa-ocean");
assert.equal(parsed.category, "astrobiology");
assert.equal(parsed.categoryLabel, "天体生物学");
assert.equal(parsed.excerpt, "自定义摘要");
assert.equal(parsed.readTime, "10 min");
assert.match(parsed.content, /^## 冰下不是死寂/);

console.log("markdown-import tests passed");
