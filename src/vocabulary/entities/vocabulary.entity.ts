import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  transcription: string;

  @Column()
  translation: string;
}
