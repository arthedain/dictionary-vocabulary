import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { VocabularyService } from "./vocabulary.service";
import { CreateVocabularyDto } from "./dto/create-vocabulary.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../file/file.service";
import { resolve } from "path";
import { Vocabulary } from "./entities/vocabulary.entity";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import * as fs from "fs";
import { UpdateVocabularyDto } from "./dto/update-vocabulary.dto";

@Controller("api/vocabulary")
export class VocabularyController {
  constructor(
    private readonly vocabularyService: VocabularyService,
    private readonly fileService: FileService,
  ) {}

  @Post("/create-using-file")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  async createWords(
    @UploadedFile("file") uploadedFile: Express.Multer.File,
  ): Promise<any> {
    const file = await this.fileService.save(uploadedFile);

    const path = resolve(__dirname, "..", `storage/${file}`);

    const data = await this.vocabularyService.parseExcel(path);

    for (const dataKey in data) {
      const dto = new CreateVocabularyDto();

      dto.name = data[dataKey][0].toString();
      dto.translation = data[dataKey][1].toString();
      dto.transcription = data[dataKey][2].toString();

      await this.vocabularyService.create(dto);
    }

    fs.rmSync(path);

    return {};
  }

  @MessagePattern("get-all")
  async all(): Promise<Vocabulary[]> {
    return await this.vocabularyService.findAll();
  }

  @MessagePattern("get-random")
  async random(@Payload("count") count: number): Promise<Vocabulary[]> {
    return await this.vocabularyService.random(count);
  }

  @MessagePattern("paginate")
  async paginate(
    @Payload("page") page: number,
    @Payload("search") search: string,
  ): Promise<any> {
    return await this.vocabularyService.paginate(page, search);
  }

  @EventPattern("create")
  async create(@Payload() createVocabularyDto: CreateVocabularyDto) {
    await this.vocabularyService.create(createVocabularyDto);
  }
  @EventPattern("update")
  async update(
    @Payload("id") id: number,
    @Payload() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    await this.vocabularyService.update(id, updateVocabularyDto);
  }

  @EventPattern("delete")
  async delete(@Payload("id") id: number) {
    await this.vocabularyService.remove(id);
  }
}
