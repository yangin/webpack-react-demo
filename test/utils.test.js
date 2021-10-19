import { encodeJSON, decodeJSON } from '../src/utils/base64'

describe('Base64 test', () => {
  test('EncodeJSON', () => {
    const testData = {
      mode: 'solo',
      payEntrance: '立即购买',
      from: 'pricing'
    }
    const testSuccess = '%7B%22mode%22%3A%22solo%22%2C%22payEntrance%22%3A%22%E7%AB%8B%E5%8D%B3%E8%B4%AD%E4%B9%B0%22%2C%22from%22%3A%22pricing%22%7D'

    expect(encodeJSON(testData)).toBe(testSuccess)
  })
  test('DecodeJSON', () => {
    const testData = '%7B"mode"%3A"solo"%2C"payEntrance"%3A"立即购买"%2C"from"%3A"pricing"%7D'
    const testSuccess = {
      from: 'pricing',
      mode: 'solo',
      payEntrance: '立即购买'
    }

    expect(decodeJSON(testData)).toEqual(testSuccess)
  })
})
