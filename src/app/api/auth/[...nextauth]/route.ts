import NextAuth from "next-auth"
import { authOptions as options } from "./options"

const handler = NextAuth(options)
     
export { handler as GET, handler as POST }
