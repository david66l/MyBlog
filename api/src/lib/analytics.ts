import type { PrismaClient } from "@prisma/client";

type CollectVisitInput = {
  ip: string;
  path: string;
  userAgent: string;
  referer: string;
};

export async function collectVisit(prisma: PrismaClient, input: CollectVisitInput) {
  const path = input.path.slice(0, 512);
  const userAgent = input.userAgent.slice(0, 512);
  const referer = input.referer.slice(0, 512);
  const ip = input.ip.slice(0, 64);

  await prisma.visitLog.create({
    data: { ip, path, userAgent, referer },
  });
}

function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getVisitAnalytics(prisma: PrismaClient) {
  const todayStart = startOfTodayUtc();

  const [totalVisits, todayVisits, uniqueVisitorsRaw, recentLogs] = await Promise.all([
    prisma.visitLog.count(),
    prisma.visitLog.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.visitLog.groupBy({
      by: ["ip"],
      _count: { _all: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
    }),
    prisma.visitLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const uniqueVisitors = [...uniqueVisitorsRaw].sort(
    (a, b) => b._count._all - a._count._all,
  );

  const visitors = uniqueVisitors.map((row) => ({
    ip: row.ip,
    visitCount: row._count._all,
    firstSeen: row._min.createdAt,
    lastSeen: row._max.createdAt,
  }));

  return {
    summary: {
      totalVisits,
      uniqueIps: uniqueVisitors.length,
      todayVisits,
    },
    visitors,
    recentLogs: recentLogs.map((log) => ({
      id: log.id,
      ip: log.ip,
      path: log.path,
      userAgent: log.userAgent,
      referer: log.referer,
      createdAt: log.createdAt,
    })),
  };
}
