import type { PrismaClient } from "@prisma/client";
import { formatDeviceLabel, parseVisitMeta } from "./visit-meta.js";

type CollectVisitInput = {
  ip: string;
  path: string;
  userAgent: string;
  referer: string;
};

function mapLog(log: {
  id: string;
  ip: string;
  path: string;
  userAgent: string;
  referer: string;
  country: string;
  region: string;
  city: string;
  location: string;
  isp: string;
  browser: string;
  os: string;
  device: string;
  deviceBrand: string;
  deviceModel: string;
  createdAt: Date;
}) {
  return {
    id: log.id,
    ip: log.ip,
    path: log.path,
    userAgent: log.userAgent,
    referer: log.referer,
    country: log.country,
    region: log.region,
    city: log.city,
    location: log.location,
    isp: log.isp,
    browser: log.browser,
    os: log.os,
    device: log.device,
    deviceBrand: log.deviceBrand,
    deviceModel: log.deviceModel,
    deviceLabel: formatDeviceLabel(log),
    createdAt: log.createdAt,
  };
}

export async function collectVisit(prisma: PrismaClient, input: CollectVisitInput) {
  const path = input.path.slice(0, 512);
  const userAgent = input.userAgent.slice(0, 512);
  const referer = input.referer.slice(0, 512);
  const ip = input.ip.slice(0, 64);
  const meta = await parseVisitMeta(ip, userAgent);

  await prisma.visitLog.create({
    data: {
      ip,
      path,
      userAgent,
      referer,
      country: meta.country.slice(0, 64),
      region: meta.region.slice(0, 64),
      city: meta.city.slice(0, 64),
      location: meta.location.slice(0, 128),
      isp: meta.isp.slice(0, 64),
      browser: meta.browser.slice(0, 64),
      os: meta.os.slice(0, 64),
      device: meta.device.slice(0, 32),
      deviceBrand: meta.deviceBrand.slice(0, 64),
      deviceModel: meta.deviceModel.slice(0, 64),
    },
  });
}

function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function buildLatestByIp<T extends { ip: string }>(logs: T[]): Map<string, T> {
  const latestByIp = new Map<string, T>();
  for (const log of logs) {
    if (!latestByIp.has(log.ip)) {
      latestByIp.set(log.ip, log);
    }
  }
  return latestByIp;
}

export async function getVisitAnalytics(prisma: PrismaClient) {
  const todayStart = startOfTodayUtc();

  const [totalVisits, todayVisits, uniqueVisitorsRaw, recentLogs, latestLogs] = await Promise.all([
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
    prisma.visitLog.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        ip: true,
        location: true,
        isp: true,
        browser: true,
        os: true,
        device: true,
        deviceBrand: true,
        deviceModel: true,
      },
    }),
  ]);

  const uniqueVisitors = [...uniqueVisitorsRaw].sort(
    (a, b) => b._count._all - a._count._all,
  );
  const latestByIp = buildLatestByIp(latestLogs);

  const visitors = uniqueVisitors.map((row) => {
    const latest = latestByIp.get(row.ip);
    return {
      ip: row.ip,
      visitCount: row._count._all,
      firstSeen: row._min.createdAt,
      lastSeen: row._max.createdAt,
      location: latest?.location ?? "—",
      isp: latest?.isp ?? "—",
      browser: latest?.browser ?? "—",
      os: latest?.os ?? "—",
      device: latest?.device ?? "—",
      deviceLabel: latest
        ? formatDeviceLabel(latest)
        : "—",
    };
  });

  return {
    summary: {
      totalVisits,
      uniqueIps: uniqueVisitors.length,
      todayVisits,
    },
    visitors,
    recentLogs: recentLogs.map(mapLog),
  };
}
