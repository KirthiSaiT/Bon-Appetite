import { useUser } from "@clerk/clerk-react";
import { ADMIN_EMAIL } from "@/lib/supabase";

/**
 * True only for a signed-in user whose primary email is the verified admin address.
 * This only controls what the UI shows; the database enforces it again through RLS.
 */
export const useIsAdmin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const primary = user?.primaryEmailAddress;
  const isAdmin =
    !!isSignedIn &&
    primary?.emailAddress.toLowerCase() === ADMIN_EMAIL &&
    primary?.verification?.status === "verified";
  return { isLoaded, isSignedIn: !!isSignedIn, isAdmin };
};
