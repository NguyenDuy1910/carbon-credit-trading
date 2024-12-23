import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { Company } from './domain/company';
import { CompanyType, CreateCompanyDto } from './dto/create-company.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Company')
@Controller({
  path: 'companies',
  version: '1',
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiCreatedResponse({ type: Company })
  @ApiQuery({ name: 'companyType', enum: CompanyType })
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Query('companyType')
    companyType: CompanyType,
  ): Promise<Company> {
    createCompanyDto.companyType = companyType;
    return this.companyService.create(createCompanyDto);
  }
  @Get('filter')
  @ApiQuery({ name: 'companyType', enum: CompanyType })
  public filterByCompanyType(@Query('companyType') companyType: CompanyType) {
    return companyType;
  }

  @Get(':id')
  @ApiOkResponse({ type: Company })
  @ApiNotFoundResponse({ description: 'Company not found' })
  public async findById(@Param('id') id: number): Promise<Company> {
    return this.companyService.findById(id);
  }

  @Get('code/:companyCode')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({ type: Company })
  @ApiNotFoundResponse({ description: 'Company not found' })
  public async findByCompanyCode(
    @Param('companyCode') companyCode: string,
  ): Promise<Company> {
    return this.companyService.findByCompanyCode(companyCode);
  }
}
