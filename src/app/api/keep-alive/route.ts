import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Perform a simple read query to keep the database active
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Keep-alive query error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    });
  } catch (err: any) {
    console.error("Keep-alive error:", err);
    return NextResponse.json(
      { success: false, error: err.message || err },
      { status: 500 }
    );
  }
}
