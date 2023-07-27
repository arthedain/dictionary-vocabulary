import { Injectable } from "@nestjs/common";
import { CreateVocabularyDto } from "./dto/create-vocabulary.dto";
import { UpdateVocabularyDto } from "./dto/update-vocabulary.dto";
import { ILike, In, Repository } from "typeorm";
import { Vocabulary } from "./entities/vocabulary.entity";
import { existsSync } from "fs";
import readXlsxFile from "read-excel-file/node";
import { Row } from "read-excel-file/node";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepository: Repository<Vocabulary>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<Vocabulary> {
    return await this.vocabularyRepository.save(createVocabularyDto);
  }

  async findAll(): Promise<Vocabulary[]> {
    return this.vocabularyRepository.find();
  }

  async findOne(id: number): Promise<Vocabulary> {
    return this.vocabularyRepository.findOne({ where: { id } });
  }

  async update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularyRepository.update(id, updateVocabularyDto);
  }

  remove(id: number) {
    return this.vocabularyRepository.delete(id);
  }

  async parseExcel(path: string): Promise<Row[]> {
    if (existsSync(path)) {
      return await readXlsxFile(path);
    }
  }

  async random(count: number): Promise<Vocabulary[]> {
    const wordCount = await this.vocabularyRepository.count();
    let ids = [];
    for (let i = 1; i <= count; i++) {
      ids = [...ids, this.getRandomBetween(wordCount)];
    }

    return await this.vocabularyRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  private getRandomBetween(max: number): number {
    return Math.floor(Math.random() * (max - 1)) + 1;
  }

  async paginate(page: number, search: string) {
    const take = 20;
    const skip = page ? take * (page - 1) : 0;

    const query = {
      where: [],
      take: take,
      skip: skip,
    };
    if (search.length) {
      query.where = [
        { name: ILike(`%${search}%`) },
        { translation: ILike(`%${search}%`) },
      ];
    }

    const [result, total] = await this.vocabularyRepository.findAndCount({
      order: {
        name: "ASC",
      },
      ...query,
    });

    const lastPage = Math.ceil(total / take);

    return {
      data: result,
      total,
      last_page: lastPage,
    };
  }
}
