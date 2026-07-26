const { PrismaClient } = require('../node_modules/.prisma/client');
const p = new PrismaClient();
p.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .then(r => { console.log(JSON.stringify(r.map(x => x.name))); return p.$disconnect(); })
  .catch(e => { console.error(e.message); return p.$disconnect(); });
