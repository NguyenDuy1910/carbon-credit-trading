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
  @ApiQuery({ name: 'projectId', required: true, type: Number })
  public async create(
    @Body() createCarbonCreditDto: CreateCreditDto,
    @Query('projectId', ParseIntPipe) projectId: number,
  ): Promise<CarbonCredit> {
    if (!projectId) {
      throw new Error('Project ID and Company ID are required.');
    }
    const carbonCreditData = {
      ...createCarbonCreditDto,
    };

    return await this.carbonCreditService.create(carbonCreditData, projectId);
  }

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
