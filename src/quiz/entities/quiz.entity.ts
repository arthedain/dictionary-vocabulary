import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  user_id: number;

  @Column()
  question_id: number;

  @Column()
  answer_id: number;

  @Column()
  hash: string;
}
