import {
  Body,
  Controller,
  Post,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':projectId')
  async createOrder(
    @Param('projectId') projectId: number,
    @Body('creditId') creditId: number,
  ): Promise<{ message: string }> {
    if (!projectId) {
      throw new HttpException('Project ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!creditId) {
      throw new HttpException('Credit ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.ordersService.createOrder(projectId, creditId);
      return {
        message: `Order created successfully for project ID ${projectId} with credit ID ${creditId}`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
