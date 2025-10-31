const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

async function main() {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');

    if (!fs.existsSync(indexPath)) {
        throw new Error(`Could not find ${indexPath}`);
    }

    const outputPath = process.env.OUTPUT_PATH || path.resolve(__dirname, 'output.pdf');

    const browser = await chromium.launch({headless: true});

    const page = await browser.newPage();

    const url = 'file://' + indexPath.replace(/\\/g, '/');

    await page.goto(url, {waitUntil: 'networkidle'});

    await page.emulateMedia({ media: "screen" });

    const { width, height } = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const fullWidth = Math.max(
            body.scrollWidth,
            body.offsetWidth,
            html.clientWidth,
            html.scrollWidth,
            html.offsetWidth
        );
        const fullHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        return { width: fullWidth, height: fullHeight };
    });

    await page.pdf({
        path: outputPath,
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        scale: 1,
        preferCSSPageSize: false,
    });

    await browser.close();
    console.log(`PDF generated at ${outputPath}`);
}

main().catch(err => {
    console.error('PDF generation failed:', err);
    process.exit(1);
});
