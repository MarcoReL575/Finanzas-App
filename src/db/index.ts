import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
//  import * as tables from "./schema/index";
// import * as relations from "./relations/relations";

// `const schema = {
//   ...tables,
//   ...relations
// };`

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
