// relay.yixr.uno — 稳定版：支持二进制 / 文本 / YAML / Base64 内容安全中转
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("target");

    // === 参数检查 ===
    if (!target) {
      return new Response("Missing ?target= parameter", { status: 400 });
    }
    if (!/^https?:\/\//i.test(target)) {
      return new Response("Invalid target URL", { status: 400 });
    }

    // === 安全限制 ===
    // 禁止访问本地地址和内网段，防止 SSRF 滥用
    const targetUrl = new URL(target);
    const hostname = targetUrl.hostname.toLowerCase();
    const isIPv4Private = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(hostname);
    const isLocalhost = hostname === "localhost" || hostname === "::1";
    // 粗略判断 IPv6 私网/本地：::1, fc00::/7, fe80::/10
    const isIPv6 = hostname.includes(":");
    const isIPv6Private = isIPv6 && (/^(::1)$/.test(hostname) || /^(fc|fd|fe80)/i.test(hostname));
    // 常见本地域名后缀（保守阻断）
    const isLocalSuffix = hostname.endsWith(".local") || hostname.endsWith(".localhost") || hostname.endsWith(".internal");
    if (isIPv4Private || isIPv6Private || isLocalhost || isLocalSuffix) {
      return new Response("Access to local network IPs is not allowed.", { status: 403 });
    }

    console.log(`Relay fetching target: ${target}`);

    try {
      // 发起真实请求（增加超时防护）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const resp = await fetch(target, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "RelayWorker/1.1",
          "Accept": "*/*",
        },
      });
      clearTimeout(timeoutId);

      // 保留所有原始头部信息
      const headers = new Headers(resp.headers);
      headers.set("access-control-allow-origin", "*");
      headers.delete("content-security-policy");
      headers.delete("x-frame-options");
      headers.delete("report-to");

      // 检测响应类型
      const contentType = headers.get("content-type") || "";
      let body;

      if (contentType.includes("application/octet-stream") || contentType.includes("gzip")) {
        // 二进制内容（例如 Clash、SingBox 订阅）
        body = await resp.arrayBuffer();
        console.log("Relay returned binary data");
      } else {
        // 文本内容（YAML、Base64 等）
        body = await resp.text();
        console.log(`Relay returned text data, length: ${body.length}`);
      }

      return new Response(body, {
        status: resp.status,
        headers,
      });
    } catch (err) {
      console.error(`Relay fetch failed: ${err.message}`);
      return new Response("Relay error: " + err.message, { status: 502 });
    }
  },
};
