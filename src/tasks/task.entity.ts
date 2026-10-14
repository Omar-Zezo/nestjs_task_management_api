import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum Status {
  Pending = 'pending',
  In_progress = 'in_progress',
  Completed = 'completed',
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: Status, default: Status.Pending })
  status: Status;

  @Column({ type: 'enum', enum: Priority, default: Priority.Medium })
  priority: Priority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
