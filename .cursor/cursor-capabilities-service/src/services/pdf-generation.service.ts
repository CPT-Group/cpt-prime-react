import * as fs from "fs";
import { marked } from "marked";
import * as path from "path";
import PDFDocument from "pdfkit";
import puppeteer from "puppeteer";
// @ts-ignore - svg-to-pdfkit has no type definitions
import SVGtoPDF from "svg-to-pdfkit";

/**
 * PDF Generation Service
 *
 * Generates PDF documents on-demand from structured data.
 * Supports multiple templates for different document types.
 */
export class PDFGenerationService {
  /**
   * Generate a PDF document
   */
  async generatePDF(
    template: string,
    data: any,
    outputPath: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Configurable document options (defaults can be overridden via data.pdfOptions)
        const pdfOptions = {
          size: data.pdfOptions?.size || "LETTER",
          layout: data.pdfOptions?.layout || "portrait", // portrait or landscape
          margins: data.pdfOptions?.margins || {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        };

        const doc = new PDFDocument(pdfOptions);

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Render based on template (with async support)
        switch (template) {
          case "technical-documentation":
            await this.renderTechnicalDoc(doc, data);
            break;
          case "architecture-design":
            this.renderArchitectureDoc(doc, data);
            break;
          case "code-documentation":
            this.renderCodeDoc(doc, data);
            break;
          default:
            this.renderGenericDoc(doc, data);
        }

        doc.end();

        stream.on("finish", () => {
          console.log(`✅ PDF generated: ${outputPath}`);
          resolve(outputPath);
        });

        stream.on("error", (error) => {
          console.error(`❌ PDF generation failed:`, error);
          reject(error);
        });
      } catch (error) {
        console.error(`❌ PDF generation error:`, error);
        reject(error);
      }
    });
  }

  /**
   * Render technical documentation PDF
   */
  private async renderTechnicalDoc(
    doc: PDFKit.PDFDocument,
    data: any
  ): Promise<void> {
    // If sourceFile is provided, read and parse Markdown
    if (data.sourceFile && fs.existsSync(data.sourceFile)) {
      const markdownContent = fs.readFileSync(data.sourceFile, "utf-8");
      await this.renderMarkdownPDF(doc, markdownContent, data);
      return;
    }

    // Fallback to original structured data rendering
    // Title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(data.title || "Technical Documentation", { align: "center" });

    doc.moveDown(2);

    // Metadata
    if (data.date || data.version || data.author) {
      doc.fontSize(10).font("Helvetica");
      if (data.date) doc.text(`Date: ${data.date}`);
      if (data.version) doc.text(`Version: ${data.version}`);
      if (data.author) doc.text(`Author: ${data.author}`);
      doc.moveDown(2);
    }

    // Sections
    if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section: any) => {
        // Section heading
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text(section.heading || "Section");

        doc.moveDown(0.5);

        // Section content
        doc
          .fontSize(11)
          .font("Helvetica")
          .text(section.content || "", { align: "left" });

        doc.moveDown(1.5);

        // Code blocks
        if (section.code) {
          doc
            .fontSize(9)
            .font("Courier")
            .fillColor("#333")
            .text(section.code, {
              indent: 20,
              width: doc.page.width - 120,
            });

          doc.fillColor("#000");
          doc.moveDown(1.5);
        }
      });
    }

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .font("Helvetica")
        .text(`Page ${i + 1} of ${pageCount}`, 0, doc.page.height - 30, {
          align: "center",
        });
    }
  }

  /**
   * Render Markdown content to PDF (NEW)
   */
  private async renderMarkdownPDF(
    doc: PDFKit.PDFDocument,
    markdown: string,
    metadata: any
  ): Promise<void> {
    // Strip YAML frontmatter if present
    const yamlFrontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const cleanMarkdown = markdown.replace(yamlFrontmatterRegex, "");

    // Title page
    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .text(metadata.title || "Document", { align: "center" });

    doc.moveDown(0.5);

    if (metadata.subtitle) {
      doc
        .fontSize(16)
        .font("Helvetica")
        .text(metadata.subtitle, { align: "center" });
      doc.moveDown(0.5);
    }

    // Metadata
    doc.fontSize(11).font("Helvetica");
    if (metadata.date) doc.text(`Date: ${metadata.date}`, { align: "center" });
    if (metadata.author)
      doc.text(`Author: ${metadata.author}`, { align: "center" });

    doc.moveDown(2);

    // Parse Markdown into tokens
    const tokens = marked.lexer(cleanMarkdown);

    // Render tokens (now async)
    await this.renderTokens(doc, tokens);

    // Page numbers are added via onPageAdded event (see doc.on('pageAdded') below)
    // Note: PDFKit doesn't support adding page numbers to already-rendered pages
    // so we skip retroactive page numbering
  }

  /**
   * Render parsed Markdown tokens to PDF
   */
  private async renderTokens(
    doc: PDFKit.PDFDocument,
    tokens: any[]
  ): Promise<void> {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      const prevToken = tokens[i - 1];

      switch (token.type) {
        case "heading":
          // Look backwards past any space tokens to see if there's an HR
          let lookBackIndex = i - 1;
          while (lookBackIndex >= 0 && tokens[lookBackIndex].type === "space") {
            lookBackIndex--;
          }
          const prevNonSpaceToken =
            lookBackIndex >= 0 ? tokens[lookBackIndex] : null;
          const prevWasHR = prevNonSpaceToken?.type === "hr";

          // Check if next token is a Mermaid diagram - keep them together
          const nextIsMermaid =
            nextToken?.type === "code" && nextToken?.lang === "mermaid";
          this.renderHeading(doc, token, nextIsMermaid, prevWasHR);
          break;
        case "paragraph":
          this.renderParagraph(doc, token);
          break;
        case "list":
          this.renderList(doc, token);
          break;
        case "table":
          this.renderTable(doc, token);
          break;
        case "code":
          await this.renderCode(doc, token); // Now async
          break;
        case "blockquote":
          this.renderBlockquote(doc, token);
          break;
        case "hr":
          // Look ahead past any space tokens to see if there's an H2 heading
          let lookAheadIndex = i + 1;
          while (
            lookAheadIndex < tokens.length &&
            tokens[lookAheadIndex].type === "space"
          ) {
            lookAheadIndex++;
          }
          const nextNonSpaceToken = tokens[lookAheadIndex];
          const nextIsH2 =
            nextNonSpaceToken?.type === "heading" &&
            nextNonSpaceToken?.depth === 2;

          if (!nextIsH2) {
            // Regular HR - just draw it
            doc.moveDown(0.3);
            doc
              .moveTo(50, doc.y)
              .lineTo(doc.page.width - 50, doc.y)
              .stroke("#ccc");
            doc.moveDown(0.3);
          }
          // If next is H2, skip - it will be rendered on new page
          break;
        case "html":
          // Handle page breaks
          if (token.raw.includes("page-break")) {
            doc.addPage();
          }
          break;
        case "space":
          doc.moveDown(0.5);
          break;
      }
    }
  }

  private renderHeading(
    doc: PDFKit.PDFDocument,
    token: any,
    nextIsMermaid: boolean = false,
    prevWasHR: boolean = false
  ): void {
    const sizes = [0, 22, 18, 14, 12, 11, 10];
    const size = sizes[Math.min(token.depth, 6)];

    // Calculate heading height
    const textHeight = doc.heightOfString(token.text, {
      width: doc.page.width - 100,
    });

    // If next is Mermaid diagram, reserve space for heading + diagram (500pt total)
    const requiredSpace = nextIsMermaid ? 500 : textHeight + 100;

    // H2 headings (sections) ALWAYS start on a fresh page UNLESS at top already
    if (token.depth === 2 && doc.y > 100) {
      doc.addPage(); // Always start sections on new page

      // ALWAYS render horizontal line at top of section page
      const lineY = 55;
      doc
        .moveTo(50, lineY)
        .lineTo(doc.page.width - 50, lineY)
        .stroke("#ccc");
      // Position cursor just below the line
      doc.y = lineY + 15;
    } else if (token.depth === 2 && doc.y <= 100) {
      // Already at top of page - draw line here too
      const lineY = 55;
      doc
        .moveTo(50, lineY)
        .lineTo(doc.page.width - 50, lineY)
        .stroke("#ccc");
      // Position cursor just below the line
      doc.y = lineY + 15;
    } else if (
      token.depth > 2 &&
      doc.y + requiredSpace > doc.page.height - 100
    ) {
      // For H3+ only add page if not enough space
      doc.addPage();
    } else if (nextIsMermaid && doc.y + requiredSpace > doc.page.height - 100) {
      // Ensure heading + diagram stay together
      doc.addPage();
    }

    doc
      .fontSize(size)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text(token.text, { align: token.depth === 1 ? "center" : "left" });

    // Minimal spacing after headings (no empty space under sections)
    doc.moveDown(token.depth === 1 ? 0.8 : 0.3);
  }

  private renderParagraph(doc: PDFKit.PDFDocument, token: any): void {
    // Strip HTML tags and parse bold/italic
    const text = this.stripHtml(token.text);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#000")
      .text(text, { align: "left", lineGap: 2 });

    doc.moveDown(0.8);
  }

  private renderList(doc: PDFKit.PDFDocument, token: any): void {
    token.items.forEach((item: any, index: number) => {
      const bullet = token.ordered ? `${index + 1}.` : "•";
      const text = this.stripHtml(item.text);

      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#000")
        .text(`${bullet} ${text}`, { indent: 20, lineGap: 1 });
    });

    doc.moveDown(0.8);
  }

  private renderTable(doc: PDFKit.PDFDocument, token: any): void {
    const pageWidth = doc.page.width;
    const pageMargin = 60;
    const availableWidth = pageWidth - pageMargin * 2;
    const colCount = token.header.length;

    // Calculate optimal column widths based on content
    const colWidths = this.calculateColumnWidths(
      token,
      availableWidth,
      colCount
    );

    // Dynamic row height based on font size
    const headerFontSize = 10;
    const bodyFontSize = 9;
    const minRowHeight = 25;

    // Check if table fits on current page
    const estimatedTableHeight = (token.rows.length + 2) * minRowHeight;
    if (doc.y + estimatedTableHeight > doc.page.height - 100) {
      doc.addPage();
    }

    const startX = pageMargin;
    let currentX = startX;

    // Table header
    doc.fontSize(headerFontSize).font("Helvetica-Bold").fillColor("#000");
    const headerY = doc.y;

    token.header.forEach((cell: any, i: number) => {
      const cellWidth = colWidths[i];
      doc
        .rect(currentX, headerY, cellWidth, minRowHeight)
        .fillAndStroke("#f0f0f0", "#999");

      const cellText = this.stripHtml(cell.text);
      // Save current Y, render text, then restore Y (to avoid Y position drift)
      const savedY = doc.y;
      doc.fillColor("#000").text(cellText, currentX + 5, headerY + 8, {
        width: cellWidth - 10,
        align: "left",
        lineBreak: false, // Prevent automatic line advancement
      });
      doc.y = savedY; // Restore Y position

      currentX += cellWidth;
    });

    // Manually advance Y position after header
    doc.y = headerY + minRowHeight + 5;

    // Table rows
    doc.font("Helvetica").fontSize(bodyFontSize);
    token.rows.forEach((row: any) => {
      const rowY = doc.y;
      currentX = startX;

      // Calculate row height based on content
      let maxHeight = minRowHeight;
      row.forEach((cell: any, i: number) => {
        const cellText = this.stripHtml(cell.text);
        const cellWidth = colWidths[i];
        const textHeight = doc.heightOfString(cellText, {
          width: cellWidth - 10,
        });
        maxHeight = Math.max(maxHeight, textHeight + 16);
      });

      // Check if row fits on page
      if (rowY + maxHeight > doc.page.height - 80) {
        doc.addPage();
        currentX = startX;
        const newRowY = doc.y;

        row.forEach((cell: any, i: number) => {
          const cellWidth = colWidths[i];
          doc.rect(currentX, newRowY, cellWidth, maxHeight).stroke("#ddd");

          const cellText = this.stripHtml(cell.text);
          const savedY = doc.y;
          doc.fillColor("#000").text(cellText, currentX + 5, newRowY + 8, {
            width: cellWidth - 10,
            align: "left",
            lineBreak: false, // Prevent Y drift
          });
          doc.y = savedY; // Restore Y

          currentX += cellWidth;
        });
        doc.y = newRowY + maxHeight;
      } else {
        row.forEach((cell: any, i: number) => {
          const cellWidth = colWidths[i];
          doc.rect(currentX, rowY, cellWidth, maxHeight).stroke("#ddd");

          const cellText = this.stripHtml(cell.text);
          const savedY = doc.y;
          doc.fillColor("#000").text(cellText, currentX + 5, rowY + 8, {
            width: cellWidth - 10,
            align: "left",
            lineBreak: false, // Prevent Y drift
          });
          doc.y = savedY; // Restore Y

          currentX += cellWidth;
        });
        doc.y = rowY + maxHeight;
      }
    });

    // Add spacing after table and reset text state
    doc.y += 15; // Fixed spacing after table

    // CRITICAL: Reset to default text mode for content after table
    doc.fontSize(11).font("Helvetica").fillColor("#000");
    doc.x = pageMargin; // Reset X to left margin
  }

  /**
   * Calculate optimal column widths based on content length
   */
  private calculateColumnWidths(
    token: any,
    availableWidth: number,
    colCount: number
  ): number[] {
    // Calculate relative weights based on content length
    const weights: number[] = [];

    for (let i = 0; i < colCount; i++) {
      let maxLen = this.stripHtml(token.header[i].text).length;

      token.rows.forEach((row: any) => {
        const cellLen = this.stripHtml(row[i].text).length;
        maxLen = Math.max(maxLen, cellLen);
      });

      weights.push(maxLen);
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Distribute width proportionally, with min/max constraints
    const minColWidth = 80;
    const maxColWidth = availableWidth * 0.4; // No column more than 40% of width

    const widths = weights.map((w) => {
      const proportionalWidth = (w / totalWeight) * availableWidth;
      return Math.max(minColWidth, Math.min(maxColWidth, proportionalWidth));
    });

    // Adjust if total exceeds available width
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);
    if (totalWidth > availableWidth) {
      const scale = availableWidth / totalWidth;
      return widths.map((w) => w * scale);
    }

    return widths;
  }

  private async renderCode(doc: PDFKit.PDFDocument, token: any): Promise<void> {
    // Mermaid diagrams - choose rendering method based on diagram type
    if (token.lang === "mermaid") {
      try {
        const isSequenceDiagram = token.text
          .trim()
          .startsWith("sequenceDiagram");

        if (isSequenceDiagram) {
          // Sequence diagrams = SVG (LOOK AWESOME)
          const svgContent = await this.renderMermaidToSVG(token.text);

          if (doc.y > doc.page.height - 400) {
            doc.addPage();
          }

          const maxWidth = doc.page.width - 100;
          const currentX = 50;
          const currentY = doc.y;

          SVGtoPDF(doc, svgContent, currentX, currentY, {
            width: maxWidth,
            preserveAspectRatio: "xMidYMid meet",
          });

          doc.moveDown(2);
        } else {
          // Flowcharts/graphs = PNG (OLD WAY THAT WORKED)
          const imageBuffer = await this.renderMermaidToPNG(token.text);

          const maxWidth = doc.page.width - 100;

          if (doc.y > doc.page.height - 400) {
            doc.addPage();
          }

          doc.image(imageBuffer, {
            fit: [maxWidth, 400],
            align: "center",
          });
          doc.moveDown(1);
        }
      } catch (error) {
        console.error("Failed to render Mermaid diagram:", error);
        doc
          .fontSize(10)
          .font("Helvetica-Oblique")
          .fillColor("#666")
          .text("[Mermaid Diagram - Rendering failed]", { align: "center" });
        doc.moveDown(1);
      }
      return;
    }

    // Regular code block
    doc
      .fontSize(9)
      .font("Courier")
      .fillColor("#333")
      .text(token.text, {
        indent: 20,
        width: doc.page.width - 120,
      });

    doc.fillColor("#000");
    doc.moveDown(1.5);
  }

  /**
   * Render Mermaid diagram to SVG (for sequence diagrams)
   */
  private async renderMermaidToSVG(mermaidCode: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ 
              startOnLoad: true, 
              theme: 'default',
              themeVariables: {
                fontSize: '18px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              },
              sequence: {
                useMaxWidth: false
              }
            });
          </script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: white; 
            }
            .mermaid { 
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="mermaid">
${mermaidCode}
          </div>
        </body>
        </html>
      `;

      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.waitForSelector(".mermaid svg", { timeout: 5000 });

      const svgContent = await page.evaluate(() => {
        const svgElement = document.querySelector(".mermaid svg");
        if (!svgElement) return null;

        const bbox = svgElement.getBoundingClientRect();
        svgElement.setAttribute("width", Math.ceil(bbox.width).toString());
        svgElement.setAttribute("height", Math.ceil(bbox.height).toString());

        return svgElement.outerHTML;
      });

      if (!svgContent) {
        throw new Error("Mermaid SVG not found");
      }

      return svgContent;
    } finally {
      await browser.close();
    }
  }

  /**
   * Render Mermaid diagram to PNG (for flowcharts/graphs)
   */
  private async renderMermaidToPNG(mermaidCode: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Create HTML with Mermaid (larger fonts for readability)
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ 
              startOnLoad: true, 
              theme: 'default',
              themeVariables: {
                fontSize: '18px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              },
              flowchart: { 
                useMaxWidth: false,
                htmlLabels: true,
                curve: 'basis',
                padding: 20
              }
            });
          </script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: white; 
            }
            .mermaid { 
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="mermaid">
${mermaidCode}
          </div>
        </body>
        </html>
      `;

      await page.setContent(html, { waitUntil: "networkidle0" });

      // Wait for Mermaid to render
      await page.waitForSelector(".mermaid svg", { timeout: 5000 });

      // Get the SVG element and take high-res screenshot
      const element = await page.$(".mermaid svg");
      if (!element) {
        throw new Error("Mermaid SVG not found");
      }

      // Take screenshot of the SVG at high resolution
      const screenshot = await element.screenshot({
        type: "png",
        omitBackground: false,
      });

      return screenshot as Buffer;
    } finally {
      await browser.close();
    }
  }

  private renderBlockquote(doc: PDFKit.PDFDocument, token: any): void {
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .fillColor("#555")
      .text(this.stripHtml(token.text), { indent: 30 });

    doc.fillColor("#000");
    doc.moveDown(1);
  }

  private stripHtml(text: string): string {
    return text
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
      .replace(/__(.+?)__/g, "$1") // Bold
      .replace(/\*(.+?)\*/g, "$1") // Italic
      .replace(/_(.+?)_/g, "$1"); // Italic
  }

  /**
   * Render architecture design PDF
   */
  private renderArchitectureDoc(doc: PDFKit.PDFDocument, data: any): void {
    // Title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(data.title || "Architecture Design", { align: "center" });

    doc.moveDown(2);

    // Overview
    if (data.overview) {
      doc.fontSize(16).font("Helvetica-Bold").text("Overview");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica").text(data.overview);
      doc.moveDown(2);
    }

    // Components
    if (data.components && Array.isArray(data.components)) {
      doc.fontSize(16).font("Helvetica-Bold").text("Components");
      doc.moveDown(1);

      data.components.forEach((component: any) => {
        doc
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(component.name || "Component");
        doc.moveDown(0.3);
        doc
          .fontSize(11)
          .font("Helvetica")
          .text(component.description || "");

        if (component.responsibilities) {
          doc.fontSize(10).font("Helvetica-Bold").text("Responsibilities:");
          component.responsibilities.forEach((resp: string) => {
            doc
              .fontSize(10)
              .font("Helvetica")
              .text(`• ${resp}`, { indent: 10 });
          });
        }

        doc.moveDown(1);
      });
    }

    // Data flow
    if (data.dataFlow) {
      doc.fontSize(16).font("Helvetica-Bold").text("Data Flow");
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica").text(data.dataFlow);
      doc.moveDown(2);
    }
  }

  /**
   * Render code documentation PDF
   */
  private renderCodeDoc(doc: PDFKit.PDFDocument, data: any): void {
    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(data.title || "Code Documentation", { align: "center" });

    doc.moveDown(2);

    // Classes/Functions
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        // Item name
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(item.name || "Item");
        doc.moveDown(0.5);

        // Description
        if (item.description) {
          doc.fontSize(11).font("Helvetica").text(item.description);
          doc.moveDown(0.5);
        }

        // Signature/Code
        if (item.signature) {
          doc
            .fontSize(9)
            .font("Courier")
            .fillColor("#0066cc")
            .text(item.signature);
          doc.fillColor("#000");
          doc.moveDown(0.5);
        }

        // Parameters
        if (item.parameters && Array.isArray(item.parameters)) {
          doc.fontSize(11).font("Helvetica-Bold").text("Parameters:");
          item.parameters.forEach((param: any) => {
            doc
              .fontSize(10)
              .font("Helvetica")
              .text(
                `• ${param.name}: ${param.type} - ${param.description || ""}`,
                { indent: 10 }
              );
          });
          doc.moveDown(0.5);
        }

        // Returns
        if (item.returns) {
          doc.fontSize(11).font("Helvetica-Bold").text("Returns:");
          doc.fontSize(10).font("Helvetica").text(item.returns, { indent: 10 });
        }

        doc.moveDown(1.5);
      });
    }
  }

  /**
   * Render generic document
   */
  private renderGenericDoc(doc: PDFKit.PDFDocument, data: any): void {
    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(data.title || "Document", { align: "center" });

    doc.moveDown(2);

    // Content
    doc
      .fontSize(11)
      .font("Helvetica")
      .text(data.content || "No content provided.");
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      supportedTemplates: [
        "technical-documentation",
        "architecture-design",
        "code-documentation",
        "generic",
      ],
      ready: true,
    };
  }
}
