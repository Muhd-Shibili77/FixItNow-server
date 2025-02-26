
import transporter  from "../config/nodemailer";

export class mailService{
    static async sentOTP(email:string,otp:number | string){
        try {
          const mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: "OTP from FixItNow",
              html: this.generateOtpHtml(otp),
            };
            await transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new Error("Failed to send OTP email");
        }
    }


    static generateOtpHtml(otp:number | string) {
        return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(to right, #007BFF, #00C6FF);
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 480px;
            margin: 30px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007BFF;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .header {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #007BFF;
            background: #f4f4f4;
            padding: 15px;
            display: inline-block;
            border-radius: 8px;
            letter-spacing: 4px;
        }
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: white;
            padding: 12px 24px;
            font-size: 18px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            transition: background 0.3s ease-in-out;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 25px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">FixItNow</div>
        <div class="header">Your OTP Code</div>
        <div class="message">
            Use the OTP below to complete your verification. This code is valid for <b>10 minutes</b>.
        </div>
        <div class="otp-code">${otp}</div>
        <br>
        <a href="#" class="cta-button">Verify Now</a>
        <div class="footer">
            If you didn't request this code, please ignore this email.<br>
            Need help? Contact <a href="mailto:support@fixitnow.com">support@fixitnow.com</a>
        </div>
    </div>
</body>
</html>

        `;
    }
}