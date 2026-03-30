let notifStatus = {
  lastSentTimestamp: "",
  lastReminderDate: ""
};

export async function GET() {
  return Response.json(notifStatus);
}

export async function POST(req) {
  const body = await req.json();

  if (body.lastSentTimestamp !== undefined) {
    notifStatus.lastSentTimestamp = body.lastSentTimestamp;
  }

  if (body.lastReminderDate !== undefined) {
    notifStatus.lastReminderDate = body.lastReminderDate;
  }

  return Response.json({ success: true, notifStatus });
}
