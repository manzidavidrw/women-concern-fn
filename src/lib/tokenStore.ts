import { getCookie } from "@/src/lib/cookies";

let accessToken: string | null = getCookie("access_token");

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
};
