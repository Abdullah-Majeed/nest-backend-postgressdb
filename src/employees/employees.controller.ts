import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { EmployeeDto } from './dto/employee.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth/supabase-auth.guard';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    async createEmployee(@Body() employeeData: EmployeeDto): Promise<Employee> {
        const employee = await this.employeesService.createEmployee(employeeData);
        return employee;
    }
    @UseGuards(SupabaseAuthGuard)
    @Get()
    async findAllEmployees(): Promise<Employee[]> {
        return await this.employeesService.findAllEmployees();
    }
    @Get('search')
    async searchEmployees(@Query('name') name?: string, @Query('age') age?: number): Promise<Employee[]> {
        const filter = { name, age };
        return await this.employeesService.search(filter);
    }
    @Get(':eid')
    async findEmployeeById(@Param('eid') eid: number): Promise<Employee> {
        return await this.employeesService.findEmployeeById(eid);
    }

    @Put(':eid')
    async updateEmployee(@Param('eid') eid: number, @Body() employeeData: EmployeeDto): Promise<Employee> {
        return await this.employeesService.updateEmployee(eid, employeeData);
    }

    @Patch(':eid')
    async partialUpdateEmployee(@Param('eid') eid: number, @Body() employeeData: Partial<EmployeeDto>): Promise<Employee> {
        const existingEmployee = await this.employeesService.findEmployeeById(eid);
        const updatedEmployeeData = { ...existingEmployee, ...employeeData };
        return await this.employeesService.updateEmployee(eid, updatedEmployeeData);
    }

    @Delete(':eid')
    async deleteEmployee(@Param('eid') eid: number): Promise<{ message: string }> {
        return await this.employeesService.deleteEmployee(eid);
    }

    
}
