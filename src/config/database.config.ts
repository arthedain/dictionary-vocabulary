import { Vocabulary } from "../vocabulary/entities/vocabulary.entity";
import { Quiz } from "../quiz/entities/quiz.entity";

export default () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Vocabulary, Quiz],
  synchronize: true,
});
