import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    eid!: number;

    @Column()
    name!: string;

    @Column()
    age!: number;

}