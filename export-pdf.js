const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');

    if (!fs.existsSync(indexPath)) {
        throw new Error(`Could not find ${indexPath}`);
    }

    const outputPath = process.env.OUTPUT_PATH || path.resolve(__dirname, 'output.pdf');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // const url = 'file://' + indexPath.replace(/\\/g, '/');
    const baseUrl = process.env.BASE_URL || "http://localhost:4173";

    // await page.setViewportSize({ width: 794 , height: 1032  });
    await page.setViewportSize({ width: 1191, height: 1684 });

    // Wait for network to settle (React/Gatsby hydration)
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    // wait for react
    await page.waitForFunction(() => window.__PDF_READY__ === true);


    // Force CSS media type to screen to retain Tailwind styling
    await page.emulateMedia({ media: 'screen' });

    // Explicitly wait for all web fonts to load to prevent vector/ligature errors
    await page.evaluate(() => document.fonts.ready);

    // Export as standard A4 for ATS compatibility
    await page.pdf({
        path: outputPath,
        format: 'A3',
        printBackground: true,
        preferCSSPageSize: true,
    });

    await browser.close();
    console.log(`PDF generated at ${outputPath}`);
}

main().catch(err => {
    console.error('PDF generation failed:', err);
    process.exit(1);
});