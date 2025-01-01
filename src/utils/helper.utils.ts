import { Request } from "express";
import jsonWebToken from "jsonwebtoken";
import { config } from "../config";
import { AuthPayload } from "../services/types/app.types";

export default class Utils {
  static signToken = (object: Object): string => {
    const token = jsonWebToken.sign(object, config.TOKEN_SECRET);
    return token;
  };

  static verifyToken = (token: string): AuthPayload => {
    const result: AuthPayload = jsonWebToken.verify(
      token,
      config.TOKEN_SECRET
    ) as AuthPayload;
    return result;
  };

  static generateString = ({ alpha = false, number = false }) => {
    let characters: string = "",
      length: number = 11;
    let alphaChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      numberChars = "0123456789";
    if (alpha) {
      characters = characters + alphaChars;
    }
    if (number) {
      characters = characters + numberChars;
    }
    if (number && !alpha) {
      length = 6;
    }
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  static paginateOptions = (query: { page: number | string; perPage: number | string }) => {
    const page = Number(query.page) || 1;
    const perPage = Number(query.perPage) || 10;
    const skip = (page - 1) * perPage;
    
    return { page, perPage, skip };
  }

  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static fakeTranfer(success: boolean){
    if(success){
      return true
    }else{
      return false
    }
  }
}
