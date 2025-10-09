import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { verifyKey } from "~/server/keys";
import { ratelimiter } from "~/server/ratelimits";

