import colorLib from "@kurkle/color"

const COLORS = [
  "rgb(230,57,1)",
  "rgb(255,102,0)",
  "rgb(255,201,0)",
  "rgb(143,191,0)",
  "rgb(0,101,255)",
  "rgb(153,0,255)",
  "rgb(184,0,0)",
  "rgb(0,101,255)",
  "rgb(54,54,217)",
  "rgb(204,1,153)",
  "rgb(1,174,190)",
  "",
]

export function transparentize(value, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity
  return colorLib(value).alpha(alpha).rgbString()
}

export function randomColor(index) {
  return COLORS[index % COLORS.length]
}

export const down = (ctx, value) =>
  ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined

export const nullish = (ctx, value) =>
  ctx.p0.parsed.y === 0 ? value : undefined

export const skipped = (ctx, value) =>
  ctx.p0.skip || ctx.p1.skip ? value : undefined
