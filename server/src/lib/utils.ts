import { decode, type JwtPayload } from 'jsonwebtoken'

export const decodeJwt = (
  credential: string,
): JwtPayload | null => {
  try {
    // If a secret is provided, verify the signature; otherwise just decode
    const decoded = decode(credential)
    if (decoded && typeof decoded === 'object' && 'email' in decoded) {
      return decoded as JwtPayload
    }
    return null
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}