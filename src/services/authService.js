import axios from "axios";

const BASE_URL = "https://id.tif.uin-suska.ac.id";
const REALM = "dev";
const CLIENT_ID = "setoran-mobile-dev";
const CLIENT_SECRET = "aqJp3xnXKudgC7RM0shEQP7ZoVKwzoSl";

export const login = async (email, password) => {
  const params = new URLSearchParams();

  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", email);
  params.append("password", password);

  const res = await axios.post(
    `${BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const data = res.data;

  localStorage.setItem("token", data.access_token);

  return data;
};

export const getToken = () => localStorage.getItem("token");
export const logout = () => localStorage.removeItem("token");
