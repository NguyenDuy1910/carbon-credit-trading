import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CarbonCreditService } from './carbon-credit.service';
import { CreditStatus } from './infrastructure/persistence/relational/enums/credit-status.enum';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CarbonCredit } from './domain/carbon-credit';

@ApiTags('Carbon Credit')
@Controller({
  path: 'carbon-credits',
  version: '1',
})
export class CarbonCreditController {
  constructor(private readonly carbonCreditService: CarbonCreditService) {}

  // CREATE a Carbon Credit
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CarbonCredit })
  @ApiQuery({ name: 'creditStatus', enum: CreditStatus, required: false })
  @ApiQuery({ name: 'projectId', required: true, type: Number })
  @ApiQuery({ name: 'companyId', required: true, type: Number })
  public async create(
    @Body() createCarbonCreditDto: CreateCreditDto,
    @Query('creditStatus') creditStatus: CreditStatus,
    @Query('projectId', ParseIntPipe) projectId: number,
    @Query('companyId', ParseIntPipe) companyId: number,
  ): Promise<CarbonCredit> {
    // Validation to ensure projectId and companyId are provided
    if (!projectId || !companyId) {
      throw new Error('Project ID and Company ID are required.');
    }

    // Set default status if not provided
    const carbonCreditData = {
      ...createCarbonCreditDto,
      status: creditStatus || createCarbonCreditDto.status,
    };

    return await this.carbonCreditService.create(
      carbonCreditData,
      companyId,
      projectId,
    );
  }

  // FIND a Carbon Credit by ID
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve a Carbon Credit by ID',
    type: CarbonCredit,
  })
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CarbonCredit | null> {
    return await this.carbonCreditService.findById(id);
  }
  @Get()
  @ApiOkResponse({
    type: [CarbonCredit],
    description: 'Retrieve all Carbon Credits',
  })
  public async findAll(): Promise<CarbonCredit[]> {
    return await this.carbonCreditService.findAll();
  }
}
