import nodemailer from "nodemailer";
import { NextResponse } from "next/server";


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Limite de taille augmentée (ex : 10 Mo)
    },
  },
};

export async function POST(request) {
  try {

    const { to, subject, html, file, filename } = await request.json();

    if (!to || !subject || !html || !file) {
      return NextResponse.json(
        { message: "Paramètres manquants pour l'envoi de l'email" },
        { status: 400 }
      );
    }
  

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"S.I.Beton" <${process.env.SMTP_USER}>`, 
      to, 
      subject,
      html, 
      attachments: [
        {
          filename: filename || "document.pdf",
          content: file, 
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };


    const info = await transporter.sendMail(mailOptions);

    console.log("Email envoyé :", info.messageId);
    return NextResponse.json({ message: "Email envoyé avec succès !", info });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email", error },
      { status: 500 }
    );
  }
}
