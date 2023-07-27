import { Module } from "@nestjs/common";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyController } from "./vocabulary.controller";
import { FileModule } from "../file/file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vocabulary } from "./entities/vocabulary.entity";

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService],
  imports: [TypeOrmModule.forFeature([Vocabulary]), FileModule],
})
export class VocabularyModule {}
