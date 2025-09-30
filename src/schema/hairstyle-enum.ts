import { pgEnum } from "drizzle-orm/pg-core";

export const hairLengthEnum = pgEnum("hair_length", [
  "AboveEar",
  "EarToJaw",
  "BelowJaw",
  "Shoulder",
  "Collarbone",
  "Bust",
  "MidBack",
  "Waist",
]);
export const cutTypeEnum = pgEnum("cut_type", [
  "Bob",
  "Pixie",
  "Layered",
  "Shag",
  "OneLength",
]);
export const permTypeEnum = pgEnum("perm_type", [
  "C_Curl",
  "S_Curl",
  "Hippie",
  "Glam",
  "Digital",
  "Sand",
]);
export const straightTypeEnum = pgEnum("straight_type", [
  "NaturalStraight",
  "VolumeMagic",
]);
export const updoTypeEnum = pgEnum("updo_type", [
  "Ponytail",
  "Bun",
  "HalfUp",
  "AllBack",
]);
export const curlPatternEnum = pgEnum("curl_pattern", [
  "Loose",
  "Medium",
  "Tight",
  "Irregular",
]);
export const bangsTypeEnum = pgEnum("bangs_type", [
  "SeeThrough",
  "Full",
  "Choppy",
  "CenterPart",
  "SidePart",
  "SlickBack",
]);
export const volumeTypeEnum = pgEnum("volume_type", [
  "Flat",
  "Root",
  "Sides",
  "Overall",
]);
export const layeringTypeEnum = pgEnum("layering_type", [
  "Light",
  "Medium",
  "Heavy",
]);
export const finishTextureEnum = pgEnum("finish_texture", [
  "Glossy",
  "Natural",
  "Matte",
]);
