import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@yourplatform.com'
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'

// ─── Send invite email ────────────────────────────────────────────────────────

interface SendInviteEmailParams {
    to: string
    full_name: string
    role: string
    tenant_name: string
    invite_token: string
    expires_at: string
}

export async function sendInviteEmail({
    to,
    full_name,
    role,
    tenant_name,
    invite_token,
    expires_at,
}: SendInviteEmailParams) {
    const registerUrl = `https://${ROOT_DOMAIN}/register?token=${invite_token}&email=${encodeURIComponent(to)}`
    const expiryDate = new Date(expires_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    const roleLabel: Record<string, string> = {
        student: 'Student',
        teacher: 'Teacher',
        branch_admin: 'Branch Admin',
        institute_admin: 'Institute Admin',
    }

    const { error } = await resend.emails.send({
        from: FROM,
        to,
        subject: `You've been invited to ${tenant_name}`,
        html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h2>You've been invited!</h2>
          <p>Hi ${full_name},</p>
          <p>
            <strong>${tenant_name}</strong> has invited you to join their PTE practice platform
            as a <strong>${roleLabel[role] ?? role}</strong>.
          </p>
          <p>Click the button below to set up your account. This invite expires on <strong>${expiryDate}</strong>.</p>
          <a
            href="${registerUrl}"
            style="
              display: inline-block;
              background: #4f46e5;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              margin: 16px 0;
            "
          >
            Accept Invite
          </a>
          <p style="color: #666; font-size: 13px;">
            Or copy this link: ${registerUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">
            If you weren't expecting this invite, you can safely ignore this email.
          </p>
        </body>
      </html>
    `,
    })

    if (error) throw new Error(`Failed to send invite email: ${error.message}`)
}

// ─── Send welcome email (after successful registration) ───────────────────────

export async function sendWelcomeEmail(to: string, full_name: string) {
    await resend.emails.send({
        from: FROM,
        to,
        subject: 'Welcome to PTE Practice Platform',
        html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h2>Welcome, ${full_name}! 🎉</h2>
          <p>Your account is all set up. Start practising PTE today.</p>
          <a
            href="https://${ROOT_DOMAIN}/login"
            style="
              display: inline-block;
              background: #4f46e5;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              margin: 16px 0;
            "
          >
            Go to Dashboard
          </a>
        </body>
      </html>
    `,
    })
}