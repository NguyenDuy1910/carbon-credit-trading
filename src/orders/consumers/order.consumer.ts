import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '../../queue/sqs/decorator/sqs.decorator';
import { Message } from '@aws-sdk/client-sqs';
import { CarbonProject } from '../../carbon-project/domain/carbon-project';
import { CacheRedisService } from '../../cache-redis/cache-redis.service';
import { CarbonProjectService } from '../../carbon-project/carbon-project.service';

@Injectable()
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);

  constructor(
    private readonly redisService: CacheRedisService,
    private readonly carbonProjectService: CarbonProjectService,
  ) {}

  @SqsMessageHandler('test.fifo')
  async handleTestMessage(message: Message): Promise<void> {
    const { projectId, order } = JSON.parse(message.Body || '{}');

    if (!projectId || !order) {
      this.logger.error('Invalid message: Missing projectId or order data');
      return; // Gracefully exit without further processing
    }

    this.logger.log(`Processing order for project ID: ${projectId}`);

    const success = await this.processOrder(projectId, order);

    if (success) {
      this.logger.log(
        `Order successfully processed for project ID: ${projectId}`,
      );
    } else {
      this.logger.warn(`Failed to process order for project ID: ${projectId}`);
    }
  }

  private async processOrder(projectId: number, order: any): Promise<boolean> {
    const carbonProject =
      await this.getCarbonProjectFromCacheOrService(projectId);

    if (!carbonProject) {
      this.logger.warn(
        `Carbon project with ID ${projectId} could not be retrieved.`,
      );
      return false; // Exit gracefully if the project cannot be retrieved
    }

    const credit = this.findCarbonCredit(carbonProject, order.carbonCreditId);

    if (!credit) {
      this.logger.warn(
        `Carbon credit with ID ${order.carbonCreditId} not found in project ${projectId}.`,
      );
      return false;
    }

    if (!this.validateCreditQuantity(credit, order.quantity)) {
      this.logger.warn(
        `Insufficient credits for credit ID ${credit.id} in project ID ${projectId}.`,
      );
      return false;
    }

    credit!.availableVolumeCredits! -= order.quantity;

    await this.updateCacheWithUpdatedProject(carbonProject, projectId);
    this.logger.log(
      `Updated available credits for credit ID ${credit.id}: ${credit.availableVolumeCredits}`,
    );

    return true;
  }

  private async getCarbonProjectFromCacheOrService(
    projectId: number,
  ): Promise<CarbonProject | null> {
    const cacheKey = `carbon-project:${projectId}`;

    let carbonProject = await this.redisService.get<CarbonProject>(cacheKey);

    if (carbonProject) {
      this.logger.log(`Cache hit for project ID: ${projectId}`);
      return carbonProject;
    }

    this.logger.warn(
      `Cache miss for project ID: ${projectId}. Fetching from service.`,
    );
    carbonProject =
      await this.carbonProjectService.findProjectByIdWithRelations(projectId);

    if (!carbonProject) {
      this.logger.warn(
        `Carbon project with ID ${projectId} not found in service.`,
      );
      return null;
    }

    await this.redisService.set(cacheKey, carbonProject, 600);
    return carbonProject;
  }

  private findCarbonCredit(
    carbonProject: CarbonProject,
    carbonCreditId: number,
  ) {
    const credit = carbonProject.carbonCredit.find(
      (c) => c.id === carbonCreditId,
    );
    return credit || null;
  }

  private validateCreditQuantity(credit: any, quantity: number): boolean {
    return credit.availableVolumeCredits >= quantity;
  }

  private async updateCacheWithUpdatedProject(
    carbonProject: CarbonProject,
    projectId: number,
  ) {
    const cacheKey = `carbon-project:${projectId}`;
    await this.redisService.set(cacheKey, carbonProject, 600);
    this.logger.log(`Cache updated for project ID: ${projectId}`);
  }
}
