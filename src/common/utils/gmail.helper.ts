import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CheckStatusEnum } from '../enums';
import {
  GMAIL_SENDER_NAME,
  GMAIL_SUBJECTS,
  GMAIL_STATUS_COLORS,
  GMAIL_STATUS_LABELS,
  GMAIL_TEXTS,
} from './gmail.constants';

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

  private static getSender() {
    return `"${GMAIL_SENDER_NAME}" <${process.env.GMAIL_USER}>`;
  }

  public static async SendVerificationEmail(email: string, verificationUrl: string) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.VERIFICATION;

    const mailOptions = {
      from: this.getSender(),
      to: email,
      subject: GMAIL_SUBJECTS.VERIFICATION,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                <p style="margin-bottom: 30px;">${t.BODY}</p>
                <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                  <tr>
                    <td style="border-radius: 4px; background-color: #4CAF50;">
                      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                        ${t.BUTTON}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FALLBACK}</p>
                <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendFeedbackReplyEmail(email: string, originalFeedback: string, reply: string) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.FEEDBACK_REPLY;

    const mailOptions = {
      from: this.getSender(),
      to: email,
      subject: GMAIL_SUBJECTS.FEEDBACK_REPLY,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                <p style="margin-bottom: 20px;">${t.BODY}</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">${t.YOUR_FEEDBACK_LABEL}</p>
                  <p style="margin: 10px 0 0 0; color: #333;">${originalFeedback}</p>
                </div>
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #2e7d32; font-size: 14px; font-weight: bold;">${t.OUR_RESPONSE_LABEL}</p>
                  <p style="margin: 10px 0 0 0; color: #333;">${reply}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendQuestionStatusChangeEmail(
    email: string,
    questionTitle: string,
    oldStatus: CheckStatusEnum,
    newStatus: CheckStatusEnum,
  ) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.QUESTION_STATUS_CHANGE;

    const mailOptions = {
      from: this.getSender(),
      to: email,
      subject: GMAIL_SUBJECTS.QUESTION_STATUS_CHANGE,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                <p style="margin-bottom: 20px;">${t.BODY}</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">${t.QUESTION_LABEL}</p>
                  <p style="margin: 10px 0 0 0; color: #333; font-weight: bold;">${questionTitle}</p>
                </div>
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${t.STATUS_FROM_LABEL}</p>
                  <span style="display: inline-block; padding: 6px 12px; background-color: ${GMAIL_STATUS_COLORS[oldStatus]}; color: white; border-radius: 4px; font-size: 14px; font-weight: bold;">
                    ${GMAIL_STATUS_LABELS[oldStatus]}
                  </span>
                  <span style="margin: 0 10px; color: #666;">→</span>
                  <span style="display: inline-block; padding: 6px 12px; background-color: ${GMAIL_STATUS_COLORS[newStatus]}; color: white; border-radius: 4px; font-size: 14px; font-weight: bold;">
                    ${GMAIL_STATUS_LABELS[newStatus]}
                  </span>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendNewQuestionNotificationToUsers(
    emails: string[],
    questionTitle: string,
    questionContent: string,
    tags: string[],
  ) {
    if (!emails || emails.length === 0) return;

    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.NEW_QUESTION_NOTIFICATION;

    const mailOptions = {
      from: this.getSender(),
      bcc: emails,
      subject: GMAIL_SUBJECTS.NEW_QUESTION_NOTIFICATION,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                <p style="margin-bottom: 20px;">${t.BODY}</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">${t.QUESTION_LABEL}</p>
                  <p style="margin: 10px 0 0 0; color: #333; font-weight: bold; font-size: 16px;">${questionTitle}</p>
                </div>
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
                  <p style="margin: 0; color: #333;">${questionContent.substring(0, 200)}${questionContent.length > 200 ? '...' : ''}</p>
                </div>
                ${tags.length > 0 ? `
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${t.TAGS_LABEL}</p>
                  <div>
                    ${tags.map(tag => `
                      <span style="display: inline-block; padding: 4px 10px; background-color: #e3f2fd; color: #1976d2; border-radius: 12px; font-size: 12px; margin: 0 5px 5px 0;">
                        ${tag}
                      </span>
                    `).join('')}
                  </div>
                </div>
                ` : ''}
                <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendGeneralNotificationEmail(emails: string[], title: string, body: string) {
    if (!emails || emails.length === 0) return;

    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.GENERAL_NOTIFICATION;

    const mailOptions = {
      from: this.getSender(),
      bcc: emails,
      subject: title,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #333; white-space: pre-wrap;">${body}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
  public static async SendPasswordResetEmail(email: string, resetUrl: string) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.PASSWORD_RESET;

    const mailOptions = {
      from: this.getSender(),
      to: email,
      subject: GMAIL_SUBJECTS.PASSWORD_RESET,
      html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                            <p style="margin-bottom: 30px;">${t.BODY}</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="border-radius: 4px; background-color: #f44336;">
                                        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            ${t.BUTTON}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FALLBACK}</p>
                            <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
                            <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendNotificationToSpecificEmail(email: string, title: string, body: string) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.GENERAL_NOTIFICATION;

    const mailOptions = {
      from: this.getSender(),
      to: email,  // ✅ single email, not bcc
      subject: title,
      html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
                            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #333; white-space: pre-wrap;">${body}</p>
                            </div>
                            <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  }

  public static async SendAnswerStatusChangeEmail(email: string, questionTitle: string, oldStatus: CheckStatusEnum, newStatus: CheckStatusEnum, reportedReason?: string) {
    const transporter = this.getTransporter();
    const t = GMAIL_TEXTS.ANSWER_STATUS_CHANGE;

    const mailOptions = {
      from: this.getSender(),
      to: email,
      subject: GMAIL_SUBJECTS.ANSWER_STATUS_CHANGE,
      html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="color: #333; margin-bottom: 20px;">${t.HEADING}</h2>
                            <p style="margin-bottom: 20px;">${t.BODY}</p>
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">${t.QUESTION_LABEL}</p>
                                <p style="margin: 10px 0 0 0; color: #333; font-weight: bold;">${questionTitle}</p>
                            </div>
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${t.STATUS_FROM_LABEL}</p>
                                <span style="display: inline-block; padding: 6px 12px; background-color: ${GMAIL_STATUS_COLORS[oldStatus]}; color: white; border-radius: 4px; font-size: 14px; font-weight: bold;">
                                    ${GMAIL_STATUS_LABELS[oldStatus]}
                                </span>
                                <span style="margin: 0 10px; color: #666;">→</span>
                                <span style="display: inline-block; padding: 6px 12px; background-color: ${GMAIL_STATUS_COLORS[newStatus]}; color: white; border-radius: 4px; font-size: 14px; font-weight: bold;">
                                    ${GMAIL_STATUS_LABELS[newStatus]}
                                </span>
                            </div>
                            ${newStatus === CheckStatusEnum.REPORTED && reportedReason ? `
                            <div style="background-color: #fff3f3; border-left: 4px solid #f44336; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #c62828; font-size: 14px; font-weight: bold;">${t.REPORTED_REASON_LABEL}</p>
                                <p style="margin: 10px 0 0 0; color: #333;">${reportedReason}</p>
                            </div>
                            ` : ''}
                            <p style="color: #666; font-size: 12px; margin-top: 30px;">${t.FOOTER}</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  }
  public static MaskEmail(email: string): string {
    const [name, domain] = email.split('@');

    if (!name || !domain) return email;

    if (name.length <= 2) {
      return `${name[0] || ''}*@${domain}`;
    }

    const visible = name.slice(0, 2);
    const hidden = '*'.repeat(name.length - 2);

    return `${visible}${hidden}@${domain}`;
  }
}
