import { NextResponse } from "next/server";
import { createSheetsRepository } from "../../../server/sheetsRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const repository = createSheetsRepository();

  try {
    if (body.action === "listPeople") {
      return NextResponse.json(await repository.listPeople());
    }
    if (body.action === "ensureTodayChecklist") {
      return NextResponse.json(await repository.ensureTodayChecklist(body.date));
    }
    if (body.action === "toggleEntry") {
      await repository.toggleEntry(body.entryId, body.isDone);
      return NextResponse.json(null);
    }
    if (body.action === "listSevenDayHistory") {
      return NextResponse.json(await repository.listSevenDayHistory(body.today));
    }
    if (body.action === "listMoneySummary") {
      return NextResponse.json(await repository.listMoneySummary());
    }
    if (body.action === "recordPayment") {
      await repository.recordPayment(body.personId, body.amount, body.note);
      return NextResponse.json(null);
    }
    if (body.action === "closePastDays") {
      await repository.closePastDays(body.today);
      return NextResponse.json(null);
    }
    if (body.action === "listHabits") {
      return NextResponse.json(await repository.listHabits(body.personId));
    }
    if (body.action === "addHabit") {
      return NextResponse.json(await repository.addHabit(body.personId, body.title));
    }
    if (body.action === "renameHabit") {
      await repository.renameHabit(body.habitId, body.title);
      return NextResponse.json(null);
    }
    if (body.action === "deactivateHabit") {
      await repository.deactivateHabit(body.habitId);
      return NextResponse.json(null);
    }
    if (body.action === "moveHabit") {
      await repository.moveHabit(body.habitId, body.sortOrder);
      return NextResponse.json(null);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google Sheets sync failed." },
      { status: 500 }
    );
  }
}
