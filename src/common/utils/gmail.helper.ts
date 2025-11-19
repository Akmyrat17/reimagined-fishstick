import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GmailHelper {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
    }
    return this.transporter;
  }

  public static async SendVerificationEmail(email: string, verificationUrl: string) {
    const transporter = this.getTransporter();
    
    const mailOptions = {
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">Welcome!</h2>
                <p style="margin-bottom: 30px;">Please verify your email address by clicking the button below:</p>
                
                <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                  <tr>
                    <td style="border-radius: 4px; background-color: #4CAF50;">
                      <a href="${verificationUrl}" 
                         style="display: inline-block; 
                                padding: 12px 24px; 
                                color: #ffffff; 
                                text-decoration: none; 
                                font-weight: bold;
                                font-size: 16px;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="color: #666; font-size: 12px; word-break: break-all;">
                  ${verificationUrl}
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}