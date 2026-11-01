import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { EmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
    constructor(@InjectRepository(Employee) private employeeRepository: Repository<Employee>) { }

    async createEmployee(employee: EmployeeDto): Promise<Employee> {
        const employeeEntity = this.employeeRepository.create(employee);
        return this.employeeRepository.save(employeeEntity);
    }

    async findAllEmployees(): Promise<Employee[]> {
        return await this.employeeRepository.find();
    }

    async findEmployeeById(eid: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({ where: { eid } });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${eid} not found`);
        }
        return employee;
    }

    async updateEmployee(eid: number, employeeData: EmployeeDto): Promise<Employee> {
        const employee = await this.findEmployeeById(eid);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${eid} not found`);
        }
        Object.assign(employee, employeeData);
        return this.employeeRepository.save(employee);
    }

    async deleteEmployee(eid: number): Promise<{ message: string }> {
        const employee = await this.findEmployeeById(eid);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${eid} not found`);
        }
        await this.employeeRepository.delete(employee);
        return { message: `Employee with ID ${eid} deleted successfully` };
    }

    async search(filter:{ name?: string; age?: number }): Promise<Employee[]> {
        const query = this.employeeRepository.createQueryBuilder('employee');
        if (filter.name) {
            query.andWhere('employee.name ILIKE :name', { name: `%${filter.name}%` });
        }
        if (filter.age) {
            query.andWhere('employee.age = :age', { age: filter.age });
        }
        return await query.getMany();
    }
}
