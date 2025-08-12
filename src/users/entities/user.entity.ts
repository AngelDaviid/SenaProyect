import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert} from 'typeorm';
import {Profile} from './profile.entity'
import {Post} from "../../posts/entities/post.entity";
import * as bcrypt from 'bcrypt';
import {Exclude} from "class-transformer";

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 255, unique: true})
  email: string;

  @Exclude()
  @Column({type: 'varchar', length: 255})
  password: string;

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at'})
  updatedAt: Date;

  @OneToOne(() => Profile, {nullable: true, cascade: true})
  @JoinColumn({name: 'profile_id'})
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    // Implement password hashing logic here, e.g., using bcrypt
    this.password = await bcrypt.hash(this.password, 10);
  }
}
