import { IsInt, IsString } from "class-validator";

export class EmployeeDto {
@IsString()
name!: string;

@IsInt()
age!: number;
}