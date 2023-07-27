import { Module } from "@nestjs/common";
import { VocabularyModule } from "./vocabulary/vocabulary.module";
import { FileModule } from "./file/file.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizModule } from "./quiz/quiz.module";
import databaseConfig from "./config/database.config";
import { Vocabulary } from "./vocabulary/entities/vocabulary.entity";
import { Quiz } from "./quiz/entities/quiz.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [Vocabulary, Quiz],
        synchronize: true,
      }),
    }),
    VocabularyModule,
    FileModule,
    QuizModule,
  ],
})
export class AppModule {}
