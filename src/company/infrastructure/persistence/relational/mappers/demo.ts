import { Company } from '../../../../domain/company';
import { createMap } from '@automapper/core';
import { CompanyEntity } from '../entities/company.entity';
import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

// Create and export the mapper
export const mapper = createMapper({
  strategyInitializer: classes(),
});
createMap(mapper, Company, CompanyEntity);
const exampleCompany = new Company();
exampleCompany.id = 1;
exampleCompany.companyCode = 'COMP123';
exampleCompany.companyName = 'Tech Innovators Inc.';
exampleCompany.companyAddress = '123 Innovation Drive, Silicon Valley, CA';
exampleCompany.email = 'contact@techinnovators.com';
exampleCompany.postalCode = '94043';
exampleCompany.website = 'https://techinnovators.com';
exampleCompany.registerNumber = 'REG123456';
exampleCompany.companyType = 'Private';
exampleCompany.description = 'A leading company in innovative tech solutions.';
exampleCompany.representativeName = 'John Doe';
exampleCompany.location = 'California, USA';
const dto = mapper.map(exampleCompany, Company, CompanyEntity);
console.log(dto);
