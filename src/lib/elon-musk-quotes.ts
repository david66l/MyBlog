export interface MuskQuote {
  en: string;
  zh: string;
}

export interface MuskQuoteCategory {
  id: string;
  title: string;
  quotes: MuskQuote[];
}

export const elonMuskQuoteCategories: MuskQuoteCategory[] = [
  {
    id: "persistence",
    title: "坚持与行动",
    quotes: [
      {
        en: "When something is important enough, you do it even if the odds are not in your favor.",
        zh: "当一件事足够重要时，即使胜算不高，你也要去做。",
      },
      {
        en: "Persistence is very important. You should not give up unless you are forced to give up.",
        zh: "坚持非常重要。除非被逼无奈，否则绝不放弃。",
      },
      {
        en: "No, I don't ever give up. I'd have to be dead or completely incapacitated.",
        zh: "不，我从不放弃。除非我死了或完全失去行动能力。",
      },
    ],
  },
  {
    id: "innovation",
    title: "创新与失败",
    quotes: [
      {
        en: "Failure is an option here. If things are not failing, you are not innovating enough.",
        zh: "失败是一种选择。如果没有失败，说明你创新得不够。",
      },
      {
        en: "The first step is to establish that something is possible, then probability will occur.",
        zh: "第一步是先相信一件事是可能的，然后可能性才会发生。",
      },
      {
        en: "You should take the approach that you're wrong. Your goal is to be less wrong.",
        zh: "你要假设自己是错的，目标是少犯错误。",
      },
    ],
  },
  {
    id: "work",
    title: "工作与努力",
    quotes: [
      {
        en: "Work like hell. I mean you just have to put in 80 to 100 hour weeks every week.",
        zh: "像地狱一样工作。每周要投入 80 到 100 小时。",
      },
      {
        en: "You get paid in direct proportion to the difficulty of problems you solve.",
        zh: "你的收入与你解决问题的难度成正比。",
      },
    ],
  },
  {
    id: "life",
    title: "人生与未来",
    quotes: [
      {
        en: "It is possible for ordinary people to choose to be extraordinary.",
        zh: "普通人也可以选择变得非凡。",
      },
      {
        en: "Life needs to be more than just solving problems every day. You need to wake up and be excited about the future.",
        zh: "生活不能只是每天解决问题。你要醒来时对未来充满兴奋。",
      },
      {
        en: "Some people don't like change, but you need to embrace change if the alternative is disaster.",
        zh: "有些人不喜欢改变，但如果不改变就是灾难，那你就必须拥抱改变。",
      },
    ],
  },
  {
    id: "other",
    title: "其他经典语录",
    quotes: [
      {
        en: "Constantly seek criticism. A well thought out critique of whatever you're doing is as valuable as gold.",
        zh: "不断寻求批评。对你所做事情的深思熟虑的批评，如同黄金般珍贵。",
      },
      {
        en: "Question every requirement.",
        zh: "质疑每一个需求。",
      },
      {
        en: "I could either watch it happen or be a part of it.",
        zh: "我可以坐视它发生，也可以参与其中。",
      },
      {
        en: "Good ideas are always crazy until they're not.",
        zh: "好主意在实现之前总是看起来很疯狂。",
      },
    ],
  },
];

/** Flat list in the same order as docs/elon-musk-quotes.md */
export const allElonMuskQuotesInOrder: MuskQuote[] = elonMuskQuoteCategories.flatMap(
  (category) => category.quotes,
);

export const elonMuskQuoteAuthor = "Elon Musk";

const QUOTE_INDEX_STORAGE_KEY = "louis-dev-musk-quote-index";

let lastSequentialPick: { quote: MuskQuote; at: number } | null = null;

/** Pick the next quote in sequence and advance the stored index. */
export function pickSequentialMuskQuote(): MuskQuote {
  const total = allElonMuskQuotesInOrder.length;
  if (total === 0) {
    return { en: "", zh: "" };
  }

  if (typeof window === "undefined") {
    return allElonMuskQuotesInOrder[0];
  }

  const now = Date.now();
  if (lastSequentialPick && now - lastSequentialPick.at < 1000) {
    return lastSequentialPick.quote;
  }

  const stored = Number.parseInt(localStorage.getItem(QUOTE_INDEX_STORAGE_KEY) ?? "0", 10);
  const index = Number.isFinite(stored) ? ((stored % total) + total) % total : 0;
  const quote = allElonMuskQuotesInOrder[index];
  localStorage.setItem(QUOTE_INDEX_STORAGE_KEY, String((index + 1) % total));
  lastSequentialPick = { quote, at: now };
  return quote;
}
