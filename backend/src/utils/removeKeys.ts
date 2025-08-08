export default function removeKeys(obj: Object, keys: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  )
}