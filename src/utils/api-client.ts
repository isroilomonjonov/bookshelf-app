import { Method } from "axios";
import CryptoJS from "crypto-js";
import axiosInstance from "./axios-instance";
import { BookType } from "../components/Books/books";
interface Body {
  isbn?: number;
  book?: BookType;
}
const getSignature = (
  method: Method,
  url: string,
  body: Body,
  secret: string
): string => {
  console.log(body);
  let newBody;
  if (body?.isbn || body?.book) {
    newBody = JSON.stringify(body);
  } else {
    newBody = "";
  }
  const signstr = method + url + newBody + secret;
  return CryptoJS.MD5(signstr).toString();
};

export const apiClient = async (
  method: Method,
  endpoint: string,
  data: object = {},
  navigate?: (path: string) => void
) => {
  const key = localStorage.getItem("key");
  const secret = localStorage.getItem("secret");
  if (!key || !secret) {
    navigate && navigate("/login");
    throw new Error("Missing key or secret");
  }
  const url = `${endpoint}`;
  console.log(url, method, data);

  const sign = getSignature(method, url, data, secret);

  const headers = {
    "Content-Type": "application/json",
    key,
    sign,
  };

  const response = await axiosInstance({
    method,
    url,
    headers,
    data: data,
  });
  console.log(response);

  return response.data.data;
};
