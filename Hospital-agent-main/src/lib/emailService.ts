import nodemailer from 'nodemailer';

export const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendAutomatedAppointmentEmail = async (
  to: string, 
  appointmentDetails: any
) => {
  try {
    if (!process.env.SMTP_USER) {
      console.warn("SMTP_USER is not set. Skipping automated email notification.");
      return;
    }

    const transporter = getTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; text-align: center;">Appointment Booking Confirmed</h2>
        <p>Dear ${appointmentDetails.patientName},</p>
        <p>Your appointment has been successfully booked in our system.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 8px 0;"><strong>Appointment ID:</strong> ${appointmentDetails.id}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed</span></p>
        </div>
        <p>Please arrive 15 minutes prior to your scheduled time. If you need to cancel or reschedule, you can do so from your Appointments dashboard.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">Thank you,<br>Hospital AI Agent System</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Hospital Admin" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Appointment Confirmed: ${appointmentDetails.id}`,
      html: htmlContent,
    });

    console.log("Automated email sent via Nodemailer: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending automated email via Nodemailer:", error);
  }
};
