// 传入url时用
function encodeJSON(value: object): string {
  return encodeURIComponent(JSON.stringify(value))
}

// 解析url时用
function decodeJSON(value: string): object {
  return JSON.parse(decodeURIComponent(value))
}

export { encodeJSON, decodeJSON }