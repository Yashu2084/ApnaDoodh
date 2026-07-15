import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { verifyMockPreSignedUrl } from "@/lib/services";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize Admin Session
    const cookieStore = await cookies();
    const token = cookieStore.get("apnadoodh_token")?.value;
    const session = token ? await verifyJWT(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized. Admin access required.", { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const key = searchParams.get("key");
    const expiresStr = searchParams.get("expires");
    const signature = searchParams.get("signature");

    if (!key || !expiresStr || !signature) {
      return new NextResponse("Missing signature parameters", { status: 400 });
    }

    const expires = parseInt(expiresStr);

    // 2. Validate Pre-signed Signature & 5-minute Expiration (Part 7.2)
    const isValid = verifyMockPreSignedUrl(key, expires, signature);
    if (!isValid) {
      return new NextResponse(
        `<html>
          <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; background-color: #fcf3f3; color: #c0392b;">
            <svg style="width: 64px; height: 64px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h2 style="margin-top: 15px;">Access Link Expired</h2>
            <p>This secure pre-signed document URL has expired (5-minute limit exceeded).</p>
            <p style="font-size: 12px; color: #7f8c8d;">Please refresh the Admin Board to generate a new secure link.</p>
          </body>
        </html>`,
        { status: 403, headers: { "Content-Type": "text/html" } }
      );
    }

    // 3. Serve the Document (Local File or Styled Mock Certificate)
    const APP_DATA_DIR = "C:\\Users\\MOL\\.gemini\\antigravity";
    const filePath = path.join(APP_DATA_DIR, "private_docs", key);

    try {
      // Try reading actual uploaded file
      const buffer = await fs.readFile(filePath);
      return new NextResponse(buffer, {
        headers: { "Content-Type": "application/pdf" }
      });
    } catch {
      // Fallback: If local file doesn't exist, render a beautiful official mock certificate/Govt ID
      const isFssai = key.toLowerCase().includes("fssai");
      const farmerNum = key.match(/\d+/)?.[0] || "01";
      const farmerName = farmerNum === "01" ? "Sukhdev Singh" : farmerNum === "02" ? "Manpreet Singh" : "Murrah Heights Dairy";
      
      const docHtml = isFssai 
        ? getMockFssaiHtml(farmerName, farmerNum) 
        : getMockGovIdHtml(farmerName, farmerNum);

      return new NextResponse(docHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }
  } catch (e: any) {
    return new NextResponse("Server Error: " + e.message, { status: 500 });
  }
}

function getMockFssaiHtml(farmerName: string, id: string): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; background-color: #f7f9f9; padding: 40px; }
          .certificate { max-width: 800px; margin: 0 auto; background: white; border: 12px double #1e8449; padding: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; }
          .watermark { position: absolute; top: 35%; left: 20%; font-size: 90px; color: rgba(46, 204, 113, 0.05); transform: rotate(-30deg); font-weight: bold; pointer-events: none; }
          .header { text-align: center; border-bottom: 2px solid #1e8449; padding-bottom: 20px; }
          .gov-title { font-size: 16px; font-weight: bold; color: #196f3d; uppercase; letter-spacing: 1px; }
          .fssai-logo { font-size: 32px; font-weight: 900; color: #27ae60; font-family: sans-serif; margin: 10px 0; }
          .fssai-sub { font-size: 12px; color: #7f8c8d; }
          .title { font-size: 26px; font-weight: bold; text-align: center; color: #196f3d; margin: 30px 0; text-transform: uppercase; letter-spacing: 2px; }
          .content { font-size: 14px; line-height: 1.8; color: #2c3e50; margin: 30px 0; }
          .field { font-weight: bold; color: #196f3d; }
          .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature { border-top: 1px solid #bdc3c7; width: 200px; text-align: center; padding-top: 10px; font-size: 12px; color: #7f8c8d; }
          .seal { width: 90px; height: 90px; border-radius: 50%; border: 3px dashed #1e8449; display: flex; align-items: center; justify-content: center; color: #1e8449; font-weight: bold; font-size: 12px; transform: rotate(-15deg); }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="watermark">FSSAI VERIFIED</div>
          <div class="header">
            <div class="gov-title">Food Safety and Standards Authority of India</div>
            <div class="fssai-logo">fssai</div>
            <div class="fssai-sub">Government of India • License under Food Safety and Standards Act, 2006</div>
          </div>
          <div class="title">Registration Certificate</div>
          <div class="content">
            <p>This is to certify that the food business operator listed below is registered under Section 31(1) of the Food Safety & Standards Act, 2006:</p>
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 35%;" class="field">Name of Operator:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee;"><strong>${farmerName}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" class="field">Store Name:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee;">Govardhan A2 pastures / Aravali Foothills</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" class="field">License Number:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee; font-family: monospace; font-weight: bold; letter-spacing: 1px;">22726084000${id}91</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" class="field">Premises Address:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee;">Rural Dairy Belt, Sector 62 pastoral pastures, Gurugram, Haryana</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" class="field">Category of Food:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee;">Dairy Products (Fresh Raw Milk, Curd, Ghee, Butter, Paneer)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" class="field">Validity:</td>
                <td style="padding: 8px 0; border-b: 1px solid #eee; color: #27ae60;">Active (Expires July 2028)</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <div class="signature">
              <span style="font-family: 'Brush Script MT', cursive; font-size: 24px; color: #2c3e50; display: block; margin-bottom: 5px;">Dr. R. K. Sharma</span>
              Registering Authority fssai
            </div>
            <div class="seal">
              FSSAI SEAL<br/>GURUGRAM
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getMockGovIdHtml(farmerName: string, id: string): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; background-color: #f7f9f9; padding: 40px; display: flex; justify-content: center; }
          .card { width: 500px; height: 320px; background: linear-gradient(135deg, #fff 60%, #e8f8f5 100%); border-radius: 15px; border: 1px solid #d0ece7; box-shadow: 0 10px 25px rgba(0,0,0,0.15); padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: justify; position: relative; overflow: hidden; }
          .top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #16a085; padding-bottom: 10px; margin-bottom: 15px; }
          .logo-area { display: flex; align-items: center; gap: 8px; }
          .emblem { font-size: 20px; }
          .header-text { font-size: 11px; font-weight: bold; color: #16a085; text-transform: uppercase; line-height: 1.2; }
          .main-body { display: flex; gap: 20px; flex: 1; }
          .avatar-placeholder { width: 90px; height: 110px; background-color: #eaeded; border: 2px solid #16a085; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; color: #7f8c8d; font-weight: bold; }
          .details { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #2c3e50; }
          .field { font-weight: bold; color: #7f8c8d; font-size: 10px; text-transform: uppercase; }
          .id-number { text-align: center; font-size: 18px; font-weight: bold; color: #2c3e50; letter-spacing: 2px; margin-top: 15px; border-top: 1px solid #eaeded; padding-top: 10px; }
          .footer-note { font-size: 8px; text-align: center; color: #7f8c8d; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="top-bar">
            <div class="logo-area">
              <span class="emblem">🏛️</span>
              <div class="header-text">Unique Identification Authority of India<br/><span style="color: #7f8c8d; font-size: 9px;">Government of India</span></div>
            </div>
            <span style="font-weight: 900; color: #d35400; font-size: 18px;">AADHAAR</span>
          </div>
          <div class="main-body">
            <div class="avatar-placeholder">
              <span style="font-size: 32px;">👨🏽‍🌾</span>
              <span style="margin-top: 5px;">MOCK USER</span>
            </div>
            <div class="details">
              <div>
                <span class="field">Name:</span>
                <div style="font-weight: bold; font-size: 14px;">${farmerName}</div>
              </div>
              <div>
                <span class="field">Year of Birth:</span>
                <div style="font-weight: bold;">197${id}</div>
              </div>
              <div>
                <span class="field">Gender:</span>
                <div style="font-weight: bold;">Male</div>
              </div>
              <div>
                <span class="field">Address:</span>
                <div style="font-weight: bold; font-size: 10px; line-height: 1.2;">Rural Pastures, Sector 62, near Aravali Foothills, Gurugram, Haryana - 122011</div>
              </div>
            </div>
          </div>
          <div class="id-number">
            5892 4001 278${id}
          </div>
          <div class="footer-note">
            Aadhaar is a proof of identity, not of citizenship. Secure digital verification.
          </div>
        </div>
      </body>
    </html>
  `;
}
