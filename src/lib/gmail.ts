import { getAccessToken } from './firebase';

export async function sendEmail(to: string, subject: string, text: string) {
  const token = await getAccessToken();
  if (!token) {
    console.error('No Google Access Token available. Cannot send email.');
    return;
  }

  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    '',
    text,
  ];

  const rawEmail = btoa(emailLines.join('\r\n')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawEmail }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error.message);
    }
  } catch (error) {
    console.error('Failed to send email via Gmail API:', error);
    throw error;
  }
}
