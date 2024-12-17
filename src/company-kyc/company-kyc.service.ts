import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyKycRepository } from './infrastructure/persistence/company_kyc.repository';
import { CompanyKyc } from './domain/company-kyc';
import { NullableType } from '../utils/types/nullable.type';
import { CompanyService } from '../company/company.service';
import { FilesLocalService } from '../files/infrastructure/uploader/local/files.service';
import { Company } from '../company/domain/company';
import { FileResponseDto } from '../files/infrastructure/uploader/s3/dto/file-response.dto';

@Injectable()
export class CompanyKycService {
  constructor(
    private readonly companyKycRepository: CompanyKycRepository,
    private readonly companyService: CompanyService,
    private readonly fileService: FilesLocalService,
  ) {}

  async create(
    data: Omit<CompanyKyc, 'id' | 'createdAt' | 'updatedAt' | 'company'>,
    companyId: number,
  ): Promise<CompanyKyc> {
    if (!companyId) {
      throw new BadRequestException('Invalid companyId');
    }
    const company = await this.companyService.findById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found.');
    }
    const companyKyc = { ...data, company };
    return this.companyKycRepository.create(companyKyc);
  }

  async findById(id: CompanyKyc['id']): Promise<NullableType<CompanyKyc>> {
    return this.companyKycRepository.findById(id);
  }

  async findByIds(ids: CompanyKyc['id'][]): Promise<CompanyKyc[]> {
    return this.companyKycRepository.findByIds(ids);
  }

  async remove(id: CompanyKyc['id']): Promise<void> {
    await this.companyKycRepository.remove(id);
  }
  async uploadDocument(
    file: Express.Multer.File,
    companyId: Company['id'],
  ): Promise<FileResponseDto> {
    // const company = await this.companyService.findById(companyId);
    // if (!company) {
    //   return null;
    // }
    return this.fileService.create(file);
  }
}
