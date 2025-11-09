import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class GmailHelper {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  public static async SendVerificationEmail(email: string, verificationUrl: string) {
    const mailOptions = {
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome!</h2>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
      `,
    };

    await GmailHelper.transporter.sendMail(mailOptions);
  }
}
