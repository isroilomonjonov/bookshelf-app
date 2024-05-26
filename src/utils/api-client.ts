import { Method } from "axios";
import CryptoJS from "crypto-js";
import axiosInstance from "./axios-instance";

const getSignature = (
  method: Method,
  url: string,
  body: string,
  secret: string
): string => {
  const signstr = method + url + body + secret;
  return CryptoJS.MD5(signstr).toString();
};

export const apiClient = async (
  method: Method,
  endpoint: string,
  data: string = ""
) => {
  const key = localStorage.getItem("key");
  const secret = localStorage.getItem("secret");
  if (!key || !secret) {
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
    data,
  });
  console.log(response);

  return response.data.data;
};
