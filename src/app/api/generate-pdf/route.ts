import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // In a real application, we would use a proper HTML template with Algerian court formatting
    // For this MVP, we create a simple HTML string that tests Arabic rendering
    const htmlContent = `
      <html dir="rtl" lang="ar">
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
            body {
              font-family: 'Cairo', sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .republic {
              font-weight: 700;
              font-size: 20px;
            }
            .ministry {
              font-weight: 400;
              font-size: 16px;
            }
            .title {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin: 40px 0;
              text-decoration: underline;
            }
            .content {
              text-align: justify;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <div class="ministry">وزارة العدل</div>
          </div>
          
          <div class="title">
            ${data.documentType === 'mise_en_demeure' ? 'إعذار' : 'أمر بالأداء'}
          </div>
          
          <div class="content">
            <p>بناءً على أحكام قانون الإجراءات المدنية والإدارية (القانون رقم 08-09)...</p>
            <p>المدعي: ${data.plaintiffName}</p>
            <p>المدعى عليه: ${data.defendantName}</p>
            <br/>
            <p>الموضوع: ${data.subject}</p>
          </div>
        </body>
      </html>
    `;

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
      });
      const page = await browser.newPage();

      await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        printBackground: true
      });

      await browser.close();

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="document_legal.pdf"'
        }
      });
    } catch (pdfError) {
      console.error('PDF Generation failed, falling back to HTML:', pdfError);
      // Fallback: Return HTML content with a specific header so the client can handle it
      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'X-Fallback-Type': 'html-document',
          'Content-Disposition': 'attachment; filename="document_legal.html"'
        }
      });
    }
  } catch (error) {
    console.error('Core Logic Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


