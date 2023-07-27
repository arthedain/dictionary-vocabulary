import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./entities/quiz.entity";
import { QuizController } from "./quiz.controller";
import { Vocabulary } from "../vocabulary/entities/vocabulary.entity";

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [TypeOrmModule.forFeature([Quiz, Vocabulary])],
})
export class QuizModule {}
