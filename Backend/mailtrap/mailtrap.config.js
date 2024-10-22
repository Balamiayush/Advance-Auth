import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.TOKEN_SECRET;

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "aryanbalami54@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);