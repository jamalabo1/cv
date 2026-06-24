"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const config = {
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT || 4173),
  publicDir: process.env.PUBLIC_DIR || path.resolve(__dirname, "public"),
  outputHtmlPath:
    process.env.OUTPUT_PATH || path.resolve(__dirname, "rendered.html"),
  screenshotPath: process.env.SCREENSHOT_PATH || "",
  pdfPath: process.env.PDF_PATH || "",
  waitSelector: process.env.WAIT_SELECTOR || "#__gatsby",
  waitUntil: process.env.WAIT_UNTIL || "networkidle",
  timeoutMs: Number(process.env.TIMEOUT_MS || 30000),
};

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".mjs", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".eot", "application/vnd.ms-fontobject"],
]);

function isPathInside(parent, child) {
  const relative = path.relative(parent, child);
  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function getContentType(filePath) {
  return CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";
}

function resolveFilePath(publicDir, urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname);
  const safePath = path.normalize(path.join(publicDir, decodedPath));

  if (!isPathInside(publicDir, safePath) && safePath !== publicDir) {
    return null;
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    return path.join(safePath, "index.html");
  }

  return safePath;
}

function createStaticServer(publicDir) {
  return http.createServer((req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    const url = new URL(req.url, `http://${config.host}:${config.port}`);
    const filePath = resolveFilePath(publicDir, url.pathname);

    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }

      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function startServer(publicDir, host, port) {
  if (!fs.existsSync(publicDir)) {
    throw new Error(`PUBLIC_DIR does not exist: ${publicDir}`);
  }

  const server = createStaticServer(publicDir);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  return server;
}

async function stopServer(server) {
  await new Promise((resolve) => server.close(() => resolve()));
}

function validateConfig() {
  if (!Number.isFinite(config.port) || config.port <= 0) {
    throw new Error(`Invalid PORT: ${config.port}`);
  }

  const allowedWaitUntil = new Set(["load", "domcontentloaded", "networkidle"]);
  if (!allowedWaitUntil.has(config.waitUntil)) {
    throw new Error(
      `Invalid WAIT_UNTIL: ${config.waitUntil}. Allowed: load, domcontentloaded, networkidle`
    );
  }
}

async function main() {
  validateConfig();

  const server = await startServer(config.publicDir, config.host, config.port);
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    const url = `http://${config.host}:${config.port}/`;

    await page.goto(url, {
      waitUntil: config.waitUntil,
      timeout: config.timeoutMs,
    });

    if (config.waitSelector) {
      await page.waitForSelector(config.waitSelector, {
        timeout: config.timeoutMs,
      });
    }

    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => document.fonts.ready);

    const renderedHtml = await page.content();
    fs.writeFileSync(config.outputHtmlPath, renderedHtml, "utf-8");

    if (config.screenshotPath) {
      await page.screenshot({ path: config.screenshotPath, fullPage: true });
    }

    if (config.pdfPath) {
      await page.pdf({
        path: config.pdfPath,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });
    }

    await page.close();
    console.log(`Rendered HTML saved to ${config.outputHtmlPath}`);

    if (config.screenshotPath) {
      console.log(`Screenshot saved to ${config.screenshotPath}`);
    }

    if (config.pdfPath) {
      console.log(`PDF saved to ${config.pdfPath}`);
    }
  } finally {
    await browser.close();
    await stopServer(server);
  }
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
