import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
  HttpCode,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiCreatedResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CarbonCredit } from '../carbon-credit/domain/carbon-credit';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':creditId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Order created successfully.',
    type: CarbonCredit,
  })
  @ApiParam({
    name: 'creditId',
    required: true,
    description: 'ID of the carbon credit',
    type: Number,
    example: 10,
  })
  async createOrder(
    @Param('creditId') creditId: number,
    @Body() order: CreateOrderDto,
  ): Promise<{ message: string }> {
    try {
      // Call the service to create the order
      await this.ordersService.createOrder(order, creditId);

      return {
        message: `Order created successfully with credit ID ${creditId}`,
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
