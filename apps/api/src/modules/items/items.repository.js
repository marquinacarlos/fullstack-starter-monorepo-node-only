// Raw SQL through the Prisma client (tagged templates are parameterized, so they are injection safe).
// The table comes from prisma/schema.prisma: keep names in sync (items, created_at).
// SQLite returns created_at as UTC; Prisma gives a Date, which JSON turns into an ISO string.

export function createItemsRepository(prisma) {
  const get = async (id) => {
    const rows = await prisma.$queryRaw`
      SELECT id, name, description, created_at AS createdAt FROM items WHERE id = ${id}`;
    return rows[0] ?? null;
  };

  return {
    list: () =>
      prisma.$queryRaw`
        SELECT id, name, description, created_at AS createdAt FROM items ORDER BY id`,

    get,

    async create({ name, description = null }) {
      const rows = await prisma.$queryRaw`
        INSERT INTO items (name, description) VALUES (${name}, ${description})
        RETURNING id, name, description, created_at AS createdAt`;
      return rows[0];
    },

    /** Only the fields that were sent are changed. Returns null if the item does not exist. */
    async update(id, { name, description }) {
      const current = await get(id);
      if (!current) return null;
      const rows = await prisma.$queryRaw`
        UPDATE items
        SET name = ${name ?? current.name},
            description = ${description === undefined ? current.description : description}
        WHERE id = ${id}
        RETURNING id, name, description, created_at AS createdAt`;
      return rows[0];
    },

    async remove(id) {
      return (await prisma.$executeRaw`DELETE FROM items WHERE id = ${id}`) > 0;
    },
  };
}
