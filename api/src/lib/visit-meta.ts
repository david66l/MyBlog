import { createRequire } from "node:module";
import geoip from "geoip-lite";
import UAParser = require("ua-parser-js");

const require = createRequire(import.meta.url);
const IP2Region = require("ip2region").default as new () => { search: (ip: string) => Ip2RegionHit | null };

type Ip2RegionHit = {
  country?: string;
  province?: string;
  city?: string;
  isp?: string;
};

type IpGeo = {
  country: string;
  region: string;
  city: string;
  isp: string;
};

let ip2regionQuery: InstanceType<typeof IP2Region> | null = null;

const geoCache = new Map<string, { expires: number; geo: IpGeo }>();
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const GEO_CACHE_MAX = 2000;

const COUNTRY_NAMES: Record<string, string> = {
  CN: "中国",
  US: "美国",
  JP: "日本",
  KR: "韩国",
  TW: "中国台湾",
  HK: "中国香港",
  MO: "中国澳门",
  SG: "新加坡",
  GB: "英国",
  DE: "德国",
  FR: "法国",
  CA: "加拿大",
  AU: "澳大利亚",
  IN: "印度",
  RU: "俄罗斯",
  BR: "巴西",
  IT: "意大利",
  ES: "西班牙",
  NL: "荷兰",
  SE: "瑞典",
  CH: "瑞士",
  TH: "泰国",
  VN: "越南",
  MY: "马来西亚",
  ID: "印度尼西亚",
  PH: "菲律宾",
  NZ: "新西兰",
  MX: "墨西哥",
  AE: "阿联酋",
};

const US_STATE_NAMES: Record<string, string> = {
  AL: "阿拉巴马州",
  AK: "阿拉斯加州",
  AZ: "亚利桑那州",
  AR: "阿肯色州",
  CA: "加利福尼亚州",
  CO: "科罗拉多州",
  CT: "康涅狄格州",
  DE: "特拉华州",
  FL: "佛罗里达州",
  GA: "佐治亚州",
  HI: "夏威夷州",
  ID: "爱达荷州",
  IL: "伊利诺伊州",
  IN: "印第安纳州",
  IA: "艾奥瓦州",
  KS: "堪萨斯州",
  KY: "肯塔基州",
  LA: "路易斯安那州",
  ME: "缅因州",
  MD: "马里兰州",
  MA: "马萨诸塞州",
  MI: "密歇根州",
  MN: "明尼苏达州",
  MS: "密西西比州",
  MO: "密苏里州",
  MT: "蒙大拿州",
  NE: "内布拉斯加州",
  NV: "内华达州",
  NH: "新罕布什尔州",
  NJ: "新泽西州",
  NM: "新墨西哥州",
  NY: "纽约州",
  NC: "北卡罗来纳州",
  ND: "北达科他州",
  OH: "俄亥俄州",
  OK: "俄克拉荷马州",
  OR: "俄勒冈州",
  PA: "宾夕法尼亚州",
  RI: "罗得岛州",
  SC: "南卡罗来纳州",
  SD: "南达科他州",
  TN: "田纳西州",
  TX: "得克萨斯州",
  UT: "犹他州",
  VT: "佛蒙特州",
  VA: "弗吉尼亚州",
  WA: "华盛顿州",
  WV: "西弗吉尼亚州",
  WI: "威斯康星州",
  WY: "怀俄明州",
  DC: "华盛顿特区",
};

const CN_REGION_CODES: Record<string, string> = {
  "11": "北京",
  "12": "天津",
  "13": "河北",
  "14": "山西",
  "15": "内蒙古",
  "21": "辽宁",
  "22": "吉林",
  "23": "黑龙江",
  "31": "上海",
  "32": "江苏",
  "33": "浙江",
  "34": "安徽",
  "35": "福建",
  "36": "江西",
  "37": "山东",
  "41": "河南",
  "42": "湖北",
  "43": "湖南",
  "44": "广东",
  "45": "广西",
  "46": "海南",
  "50": "重庆",
  "51": "四川",
  "52": "贵州",
  "53": "云南",
  "54": "西藏",
  "61": "陕西",
  "62": "甘肃",
  "63": "青海",
  "64": "宁夏",
  "65": "新疆",
  BJ: "北京",
  SH: "上海",
  TJ: "天津",
  CQ: "重庆",
};

function getIp2Region() {
  if (!ip2regionQuery) {
    ip2regionQuery = new IP2Region();
  }
  return ip2regionQuery;
}

function clean(value: string | undefined): string {
  const text = value?.trim();
  if (!text || text === "0") return "";
  return text;
}

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "unknown" || ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (ip.startsWith("172.")) {
    const second = Number.parseInt(ip.split(".")[1] ?? "0", 10);
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) return true;
  return false;
}

function parseIp2RegionRaw(raw: string): Ip2RegionHit {
  const [country, , province, city, isp] = raw.split("|");
  return {
    country: country?.trim(),
    province: province?.trim(),
    city: city?.trim(),
    isp: isp?.trim(),
  };
}

function lookupIp2Region(ip: string): Ip2RegionHit | null {
  try {
    const result = getIp2Region().search(ip.trim());
    if (!result) return null;
    if (typeof result === "string") {
      return parseIp2RegionRaw(result);
    }
    return result;
  } catch {
    return null;
  }
}

function formatCountryCode(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

function formatGeoRegion(countryCode: string, region: string): string {
  if (!region) return "";
  if (countryCode === "CN") {
    return CN_REGION_CODES[region] ?? region;
  }
  if (countryCode === "US") {
    return US_STATE_NAMES[region] ?? region;
  }
  return region;
}

function looksChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

function inferChinaFromIp2(hit: Ip2RegionHit): boolean {
  const country = clean(hit.country);
  if (country === "中国") return true;
  const region = clean(hit.province);
  const city = clean(hit.city);
  return looksChinese(region) || looksChinese(city);
}

function normalizeIp2Region(hit: Ip2RegionHit): IpGeo {
  let country = clean(hit.country);
  const region = clean(hit.province);
  const city = clean(hit.city);
  const isp = clean(hit.isp);

  if (!country && inferChinaFromIp2(hit)) {
    country = "中国";
  }

  return { country, region, city, isp };
}

function fromGeoIpLite(ip: string): IpGeo | null {
  const geo = geoip.lookup(ip.trim());
  if (!geo) return null;

  const country = formatCountryCode(geo.country);
  const region = formatGeoRegion(geo.country, geo.region);
  const city = geo.city ?? "";

  return {
    country,
    region,
    city,
    isp: "",
  };
}

function mergeGeo(ip2: IpGeo | null, lite: IpGeo | null): IpGeo | null {
  if (!ip2 && !lite) return null;
  if (!ip2) return lite;
  if (!lite) return ip2;

  const country = ip2.country || lite.country;
  const isChina = country === "中国";

  if (isChina) {
    return {
      country,
      region: ip2.region || lite.region,
      city: ip2.city || lite.city,
      isp: ip2.isp || lite.isp,
    };
  }

  return {
    country,
    region: lite.region || ip2.region,
    city: lite.city || ip2.city,
    isp: ip2.isp || lite.isp,
  };
}

function needsGeoEnrichment(geo: IpGeo): boolean {
  return !geo.region && !geo.city;
}

function rememberGeo(ip: string, geo: IpGeo) {
  if (geoCache.size >= GEO_CACHE_MAX) {
    const firstKey = geoCache.keys().next().value;
    if (firstKey) geoCache.delete(firstKey);
  }
  geoCache.set(ip, { geo, expires: Date.now() + GEO_CACHE_TTL_MS });
}

async function lookupIpApi(ip: string): Promise<IpGeo | null> {
  const cached = geoCache.get(ip);
  if (cached && cached.expires > Date.now()) {
    return cached.geo;
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,query&lang=zh-CN`,
      { signal: AbortSignal.timeout(2500) },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      status?: string;
      country?: string;
      regionName?: string;
      city?: string;
      isp?: string;
    };

    if (data.status !== "success") return null;

    const geo: IpGeo = {
      country: clean(data.country),
      region: clean(data.regionName),
      city: clean(data.city),
      isp: clean(data.isp),
    };

    if (!geo.country && !geo.region && !geo.city) return null;

    rememberGeo(ip, geo);
    return geo;
  } catch {
    return null;
  }
}

async function lookupIpGeo(ip: string): Promise<IpGeo | null> {
  const ip2Hit = lookupIp2Region(ip);
  const ip2Geo = ip2Hit ? normalizeIp2Region(ip2Hit) : null;
  const geoLite = fromGeoIpLite(ip);
  let merged = mergeGeo(ip2Geo, geoLite);

  if (!merged) {
    return lookupIpApi(ip);
  }

  if (needsGeoEnrichment(merged)) {
    const remote = await lookupIpApi(ip);
    if (remote) {
      merged = mergeGeo(merged, remote);
    }
  }

  return merged;
}

function uniqueParts(...values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const value of values) {
    const text = value?.trim();
    if (!text || text === "0" || seen.has(text)) continue;
    seen.add(text);
    parts.push(text);
  }
  return parts;
}

export function formatLocation(
  country: string,
  region: string,
  city: string,
  isp = "",
): string {
  if (country === "内网") return "内网";

  if (country === "中国") {
    const parts = uniqueParts(region, city, isp);
    return parts.length > 0 ? parts.join(" · ") : "中国";
  }

  const parts = uniqueParts(country, region, city, isp);
  return parts.length > 0 ? parts.join(" · ") : "未知";
}

function formatDeviceType(type: string | undefined): string {
  switch (type) {
    case "mobile":
      return "手机";
    case "tablet":
      return "平板";
    case "console":
      return "游戏机";
    case "smarttv":
      return "电视";
    case "wearable":
      return "可穿戴";
    case "embedded":
      return "嵌入式";
    default:
      return "电脑";
  }
}

export type VisitMeta = {
  country: string;
  region: string;
  city: string;
  isp: string;
  location: string;
  browser: string;
  os: string;
  device: string;
  deviceBrand: string;
  deviceModel: string;
};

export async function parseVisitMeta(ip: string, userAgent: string): Promise<VisitMeta> {
  const parser = new UAParser.UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const browserName = browser.name ?? "未知浏览器";
  const browserMajor = browser.version?.split(".")[0];
  const browserLabel = browserMajor ? `${browserName} ${browserMajor}` : browserName;

  const osName = os.name ?? "未知系统";
  const osMajor = os.version?.split(".")[0];
  const osLabel = osMajor ? `${osName} ${osMajor}` : osName;

  const deviceBrand = device.vendor ?? "";
  const deviceModel = device.model ?? "";
  const deviceType = formatDeviceType(device.type);

  if (isPrivateIp(ip)) {
    return {
      country: "内网",
      region: "",
      city: "",
      isp: "",
      location: "内网",
      browser: browserLabel,
      os: osLabel,
      device: deviceType,
      deviceBrand,
      deviceModel,
    };
  }

  const geo = await lookupIpGeo(ip);
  if (!geo) {
    return {
      country: "",
      region: "",
      city: "",
      isp: "",
      location: "未知",
      browser: browserLabel,
      os: osLabel,
      device: deviceType,
      deviceBrand,
      deviceModel,
    };
  }

  return {
    country: geo.country,
    region: geo.region,
    city: geo.city,
    isp: geo.isp,
    location: formatLocation(geo.country, geo.region, geo.city, geo.isp),
    browser: browserLabel,
    os: osLabel,
    device: deviceType,
    deviceBrand,
    deviceModel,
  };
}

export function formatDeviceLabel(meta: Pick<VisitMeta, "device" | "deviceBrand" | "deviceModel">): string {
  const model = [meta.deviceBrand, meta.deviceModel].filter(Boolean).join(" ");
  if (model) return `${meta.device} · ${model}`;
  return meta.device;
}
