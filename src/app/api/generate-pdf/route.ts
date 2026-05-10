import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const isLegalNotice = data.documentType === 'catLegalNotice';

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
              color: #1a1a1b;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .republic {
              font-weight: 700;
              font-size: 18px;
              margin-bottom: 5px;
            }
            .ministry {
              font-weight: 400;
              font-size: 14px;
            }
            .title {
              text-align: center;
              font-size: 26px;
              font-weight: 900;
              margin: 40px 0;
              text-decoration: underline;
              text-transform: uppercase;
            }
            .parties {
              margin-bottom: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .party-row {
              margin-bottom: 10px;
              font-size: 16px;
            }
            .label {
              font-weight: 700;
              min-width: 100px;
              display: inline-block;
            }
            .content {
              text-align: justify;
              font-size: 16px;
              margin-top: 20px;
            }
            .deadline {
              font-weight: 700;
              color: #dc2626;
              margin: 20px 0;
              text-align: center;
              border: 1px solid #dc2626;
              padding: 10px;
            }
            .signature {
              margin-top: 60px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <div class="ministry">وزارة العدل</div>
          </div>
          
          <div class="official-meta" style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
            <div>رقم المرجع: ${data.referenceNumber || 'DHK-' + Date.now().toString().slice(-6)}</div>
            <div>تاريخ الصدور: ${new Date().toLocaleDateString('ar-DZ')}</div>
          </div>

          <div class="title" style="margin-top: 20px;">
            ${isLegalNotice ? (
        data.noticeType === 'RENT' ? 'إعذار رسمي بدفع مؤخرات الإيجار' :
          data.noticeType === 'DEBT' ? 'إعذار رسمي بلزوم الوفاء بدين' :
            data.noticeType === 'CONTRACT' ? 'إعذار رسمي بتنفيذ التزامات تعاقدية' :
              'إعذار رسمي بلزوم الوفاء'
      ) : 'طلب أمر بالأداء'}
          </div>
          
          <div class="parties">
            <div class="party-row">
              <span class="label">لفائدة:</span> ${data.plaintiffName}
              ${data.plaintiffAddress ? `<br/><span class="label" style="font-size: 14px; margin-right: 20px;">العنوان:</span> ${data.plaintiffAddress}` : ''}
              ${data.plaintiffPhone ? `<br/><span class="label" style="font-size: 14px; margin-right: 20px;">الهاتف:</span> ${data.plaintiffPhone}` : ''}
            </div>
            <div class="party-row">
              <span class="label">ضد:</span> ${data.defendantName} (${data.defendantType === 'CORPORATE' ? 'شخص معنوي' : 'شخص طبيعي'})
              ${data.defendantAddress ? `<br/><span class="label" style="font-size: 14px; margin-right: 20px;">العنوان:</span> ${data.defendantAddress}` : ''}
              ${data.defendantPhone ? `<br/><span class="label" style="font-size: 14px; margin-right: 20px;">الهاتف:</span> ${data.defendantPhone}` : ''}
            </div>
          </div>

          <div class="content">
            ${isLegalNotice ? `
              <p>بناءً على أحكام قانون الإجراءات المدنية والإدارية، لاسيما المادة 18 وما يليها منها.</p>
              
              ${data.noticeType === 'RENT' ? `
                <p>حيث أنكم تشغلون الأمكنة المملوكة للموكل بموجب عقد إيجار، وحيث تخلفتم عن دفع المستحقات للفترة المحددة.</p>
              ` : data.noticeType === 'DEBT' ? `
                <p>حيث يتبين من الوقائع والوثائق المرفقة أنكم مدينون للموكل بالمبلغ المذكور أدناه، والذي لم يتم تسويته رغم المحاولات الودية.</p>
              ` : `
                <p>حيث يتبين من الوقائع أنكم مدينون للموكل بالمبلغ المذكور أدناه الناتج عن التزاماتكم التعاقدية.</p>
              `}

              <p>الموضوع: <strong>${data.subject}</strong></p>
              <p>المبلغ المطلوب: <strong>${data.amount || 'غير محدد'} دج</strong></p>
              
              <div class="deadline">
                يمنح لكم أجل قدره ${data.deadlineDays || 15} يوماً من تاريخ التبليغ لتسوية وضعيتكم ودفع المبالغ المستحقة.
              </div>
              
              <p>وفي حالة انقضاء الأجل المذكور دون جدوى، سيضطر الموكل للجوء إلى الجهات القضائية المختصة للمطالبة بحقوقه، مع تحميلكم كافة المصاريف القضائية والتعويضات عن التأخير.</p>
              

            ` : `
              <p>بناءً على أحكام قانون الإجراءات المدنية والإدارية، نلتمس من السيد رئيس المحكمة إصدار أمر بالأداء ضد الخصم.</p>
              <p>الموضوع: ${data.subject}</p>
              <p>المبلغ المطلوب: ${data.amount} دج</p>
            `}
          </div>


          <div class="signature">
            حرر في: ${new Date().toLocaleDateString('ar-DZ')}
            <br/><br/>
            توقيع المعني
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


