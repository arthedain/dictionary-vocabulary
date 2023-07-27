import { Injectable } from "@nestjs/common";
import { AnswerDto } from "./dto/answer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Quiz } from "./entities/quiz.entity";
import { Vocabulary } from "../vocabulary/entities/vocabulary.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Vocabulary)
    private vocabularyRepository: Repository<Vocabulary>,
  ) {}
  async answer(answerDto: AnswerDto) {
    await this.quizRepository.save(answerDto);
  }

  async getResult(userId: number, hash: string) {
    const quiz = await this.quizRepository.findBy({
      user_id: userId,
      hash: hash,
    });

    const correctAnswers = quiz.filter((item) => {
      return item.answer_id == item.question_id;
    });
    const wrongAnswers = quiz.filter((item) => {
      return item.answer_id !== item.question_id;
    });

    const quizIds = quiz.map((item) => item.question_id);
    const words = await this.vocabularyRepository.findBy({ id: In(quizIds) });

    const wrongWords = words.filter((item) => {
      return wrongAnswers.some((answer) => answer.question_id == item.id);
    });
    const correctWords = words.filter((item) => {
      return correctAnswers.some((answer) => answer.question_id == item.id);
    });

    return {
      wrong: wrongAnswers.length,
      correct: correctAnswers.length,
      wrong_words: wrongWords,
      correct_words: correctWords,
    };
  }

  async getAllResults(userId: number) {
    const quiz = await this.quizRepository.find({
      where: {
        user_id: userId,
      },
      order: {
        hash: "DESC",
      },
    });

    const groupBy =
      (key) =>
      (array): { [something: string]: Array<Quiz> } =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(
            obj,
          );
          return objectsByKeyValue;
        }, {});
    const groupByHash = groupBy("hash");

    const groupedList = groupByHash(quiz);
    const list = {};
    for (const listKey in groupedList) {
      list[listKey] = {
        correct: groupedList[listKey].filter(
          (item) => item.answer_id == item.question_id,
        ).length,
        wrong: groupedList[listKey].filter(
          (item) => item.answer_id !== item.question_id,
        ).length,
      };
    }

    return {
      list,
    };
  }
}
