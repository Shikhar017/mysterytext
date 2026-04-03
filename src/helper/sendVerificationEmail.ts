import { BrevoClient } from '@getbrevo/brevo';
import { render } from '@react-email/render';
import verificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const htmlContent = await render(verificationEmail({ username, otp: verifyCode }));

        await client.transactionalEmails.sendTransacEmail({
            subject: "Mystery Message | Verification Code",
            to: [{ email, name: username }],
            sender: { name: "MysteryText", email: "shikharsrivastav017@gmail.com" },
            htmlContent,
        });

        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending verification email", error);
        return { success: false, message: "Failed to send verification email" };
    }
}