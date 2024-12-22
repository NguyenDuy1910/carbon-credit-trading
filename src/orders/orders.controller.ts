import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
  HttpCode,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CarbonCredit } from '../carbon-credit/domain/carbon-credit';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Order created successfully.',
    type: CarbonCredit,
  })
  async createOrder(
    @Body() order: CreateOrderDto,
    @Query('projectId') projectId: number, // Add projectId as query parameter
  ): Promise<{ message: string }> {
    try {
      // Call the service to create the order
      await this.ordersService.createOrder(order, projectId);

      return {
        message: `Order created successfully with credit ID ${order.carbonCreditId}`,
      };
    } catch (error) {
      // Enhanced error handling with detailed messages
      throw new HttpException(
        `Failed to create order: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
