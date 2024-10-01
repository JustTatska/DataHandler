import {
  deleteCookie,
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";

const kvStore = new Map();

const secret = "your-secret-key";
const WEEK_IN_MILLISECONDS = 604800000;

const createSession = async (c, user) => {
  const sessionId = crypto.randomUUID();
  await setSignedCookie(c, "sessionId", sessionId, secret, {
      path: "/",
  });

  kvStore.set(`sessions:${sessionId}`, { user, expireAt: Date.now() + WEEK_IN_MILLISECONDS });
};

const getUserFromSession = async (c) => {
  const sessionId = await getSignedCookie(c, secret, "sessionId");
  if (!sessionId) {
      return null;
  }

  const session = kvStore.get(`sessions:${sessionId}`);
  if (!session || session.expireAt < Date.now()) {
      return null;
  }

  session.expireAt = Date.now() + WEEK_IN_MILLISECONDS;
  kvStore.set(`sessions:${sessionId}`, session);

  return session.user;
};

const deleteSession = async (c) => {
  const sessionId = await getSignedCookie(c, secret, "sessionId");
  if (!sessionId) {
      return;
  }

  deleteCookie(c, "sessionId", {
      path: "/",
  });

  kvStore.delete(`sessions:${sessionId}`);
};

export { createSession, getUserFromSession, deleteSession };