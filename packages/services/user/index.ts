import { db, eq } from "@repo/database"
import { usersTable } from "@repo/database"

class UserService {
  public async getUserInfoById(id: string) {
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name
    }).from(usersTable).where(eq(usersTable.id, id))

    if (!user || user.length === 0) throw new Error(`User with Id ${id} does not exist`)
    return user[0]!
  }
}

export default UserService