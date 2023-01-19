import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createUser, createContactInfo } from "prisma/seed-utils";
import { commitSession, getSession } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";
import { parse } from "cookie";
