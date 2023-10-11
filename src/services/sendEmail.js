import nodemailer from 'nodemailer';
export async function sendEmail (to,subject,html,attachment){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from:`${process.env.EMAIL}<Eng:Lara Samara>`,
        to,
        subject,
        html,
        attachments:attachment
    });
}