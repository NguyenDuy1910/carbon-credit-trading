import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCompanyKycDto } from './dto/create-company-kyc.dto';
import { CompanyKycService } from './company-kyc.service';
import { CompanyKyc } from './domain/company-kyc';
import { NullableType } from '../utils/types/nullable.type';
import { KycStatus } from './infrastructure/persistence/relational/enums/kyc-status.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponseDto } from '../files/infrastructure/uploader/local/dto/file-response.dto';

@ApiTags('Company KYC')
@Controller({
  path: 'company-kyc',
  version: '1',
})
export class CompanyKycController {
  constructor(private readonly companyKycService: CompanyKycService) {}

  /**
   * Create a new Company KYC record
   */
  @Post()
  @ApiCreatedResponse({ type: CompanyKyc })
  @ApiQuery({ name: 'kycStatus', enum: KycStatus, required: false })
  @ApiQuery({ name: 'companyId', type: Number, required: true })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanyKycDto: CreateCompanyKycDto,
    @Query('kycStatus') kycStatus: KycStatus,
    @Query('companyId') companyId: number,
  ): Promise<CompanyKyc> {
    const now = new Date();
    const companyKycData = {
      ...createCompanyKycDto,
      status: kycStatus || createCompanyKycDto.status,
      checkDay: createCompanyKycDto.checkDay || now,
      verifiedAt: createCompanyKycDto.verifiedAt || now,
    };

    return this.companyKycService.create(companyKycData, companyId);
  }

  /**
   * Upload KYC Document
   */
  @Post('upload-document')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  public async uploadDocument(
    @Query('companyId') companyId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new Error('File upload failed. Please upload a valid document.');
    }

    // Call service to save the document path
    return await this.companyKycService.uploadDocument(file, companyId);
  }
  /**
   * Find Company KYC by ID
   */
  @Get(':id')
  @ApiCreatedResponse({ type: CompanyKyc })
  public async findById(
    @Param('id') id: number,
  ): Promise<NullableType<CompanyKyc>> {
    return await this.companyKycService.findById(id);
  }

  /**
   * Find Company KYC by multiple IDs
   */
  @Post('find-by-ids')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { ids: { type: 'array', items: { type: 'number' } } },
    },
  })
  @ApiCreatedResponse({ type: [CompanyKyc] })
  public async findByIds(@Body('ids') ids: number[]): Promise<CompanyKyc[]> {
    return await this.companyKycService.findByIds(ids);
  }

  /**
   * Delete Company KYC by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: number): Promise<void> {
    await this.companyKycService.remove(id);
  }
}