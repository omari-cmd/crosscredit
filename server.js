require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/analyze", async (req, res) => {
  const { content } = req.body;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content }],
    });
    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/submit", async (req, res) => {
  const { user, report } = req.body;
  try {
    await resend.emails.send({
      from: "CrossCredit <onboarding@resend.dev>",
      to: "omari@wilondjamultigroup.com",
      subject: `New CrossCredit Submission — ${report.userName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0D3B27">New CrossCredit Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#555">Name</td><td style="padding:8px;font-weight:bold">${report.userName}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#555">Email</td><td style="padding:8px;font-weight:bold">${user.email}</td></tr>
            <tr><td style="padding:8px;color:#555">Countries</td><td style="padding:8px">${report.countries}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#555">Providers</td><td style="padding:8px">${report.providers}</td></tr>
          </table>
          <h3 style="color:#0D3B27;margin-top:24px">Report Summary</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#555">Total Sent</td><td style="padding:8px;font-weight:bold">$${Number(report.totalSent).toLocaleString()}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#555">Delivered Transfers</td><td style="padding:8px">${report.delivered} of ${report.totalTransactions}</td></tr>
            <tr><td style="padding:8px;color:#555">Active Months</td><td style="padding:8px">${report.activeMonths} months</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#555">Success Rate</td><td style="padding:8px">${report.successRate}%</td></tr>
            <tr><td style="padding:8px;color:#555">Period</td><td style="padding:8px">${report.period}</td></tr>
          </table>
          <p style="margin-top:24px;color:#888;font-size:12px">Submitted via CrossCredit · getcrosscredit.com</p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React build in production
app.use(express.static(path.join(__dirname, "build")));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`CrossCredit server running on port ${PORT}`));
