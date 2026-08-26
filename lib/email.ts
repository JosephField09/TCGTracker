import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertEmailProps {
    to: string;
    cardName: string;
    setName: string;
    cardId: string;
    targetPrice: number;
    currentPrice: number;
    direction: "ABOVE" | "BELOW";
    currency: string;
}

export async function sendAlertEmail({
    to,
    cardName,
    setName,
    cardId,
    targetPrice,
    currentPrice,
    direction,
    currency,
}: AlertEmailProps) {
    const symbol = currency === "EUR" ? "€" : "$";
    const directionText = direction === "ABOVE" ? "risen above" : "fallen below";
    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cards/${cardId}`;

    const html = `
        <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="margin:0;padding:0;background:#F4F1FB;font-family:'DM Sans',Arial,sans-serif;">
                    <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #DDD6F0;">
                    
                    <!-- Header -->
                    <div style="background:#6C4FBF;padding:24px 32px;">
                        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">
                        TCGTracker
                        </p>
                        <p style="margin:4px 0 0;color:#EDE8F8;font-size:13px;">
                        Price Alert Triggered
                        </p>
                    </div>

                    <!-- Body -->
                    <div style="padding:32px;">
                        <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1E1A2E;">
                        ${cardName}
                        </p>
                        <p style="margin:0 0 24px;font-size:14px;color:#7B6FA0;">
                        ${setName}
                        </p>

                        <p style="margin:0 0 24px;font-size:15px;color:#3D3460;line-height:1.6;">
                        The market price has <strong>${directionText}</strong> your target of 
                        <strong>${symbol}${targetPrice.toFixed(2)}</strong>.
                        </p>

                        <!-- Price comparison -->
                        <div style="background:#F4F1FB;border-radius:12px;padding:20px;margin-bottom:24px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                            <p style="margin:0;font-size:11px;color:#7B6FA0;text-transform:uppercase;letter-spacing:0.05em;">Current price</p>
                            <p style="margin:4px 0 0;font-size:28px;font-weight:600;color:#6C4FBF;">
                                ${symbol}${currentPrice.toFixed(2)}
                            </p>
                            </div>
                            <div style="text-align:right;">
                            <p style="margin:0;font-size:11px;color:#7B6FA0;text-transform:uppercase;letter-spacing:0.05em;">Your target</p>
                            <p style="margin:4px 0 0;font-size:28px;font-weight:600;color:#3D3460;">
                                ${symbol}${targetPrice.toFixed(2)}
                            </p>
                            </div>
                        </div>
                        </div>

                        <!-- CTA -->
                        <a href="${cardUrl}" 
                        style="display:block;background:#6C4FBF;color:#ffffff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-size:14px;font-weight:600;">
                        View card →
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="padding:16px 32px;border-top:1px solid #EDE8F8;">
                        <p style="margin:0;font-size:11px;color:#A89EC4;text-align:center;">
                        You're receiving this because you set a price alert on TCGTracker.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject: `Price alert: ${cardName} has ${directionText} ${symbol}${targetPrice.toFixed(2)}`,
        html,
    });
}