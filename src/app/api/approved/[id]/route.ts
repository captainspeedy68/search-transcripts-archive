import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await connectDB();
  try {
    const result = await ApprovedController.getAnApproved(id);
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Successfully expanded approved doc",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: error.message || "Failed to get expanded approved doc",
      },
      {},
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await connectDB();
  try {
    const body = await req.json();
    const result = await ApprovedController.updateApprovedDoc(id, body);

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidateTag("transcription");
    revalidateTag("dashboard");
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Successfully updated approved doc",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: error.message || "Failed to update approved doc",
      },
      {},
    );
  }
}
