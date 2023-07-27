import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { AnswerDto } from "./dto/answer.dto";
import { QuizService } from "./quiz.service";

@Controller("/api/quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @EventPattern("answer")
  saveAnswer(@Payload() answerDto: AnswerDto) {
    this.quizService.answer(answerDto);
  }

  @MessagePattern("get-quiz-result")
  async getResult(
    @Payload("hash") hash: string,
    @Payload("user_id") userId: number,
  ) {
    return this.quizService.getResult(userId, hash);
  }
  @MessagePattern("all-quiz-results")
  async getAllResults(@Payload("user_id") userId: number) {
    return this.quizService.getAllResults(userId);
  }
}
