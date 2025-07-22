import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(
    @Req() req: RequestWithUser,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(req.user.userId, addToCartDto);
  }

  @Get()
  async getCartItems(@Req() req: RequestWithUser): Promise<CartResponseDto[]> {
    return this.cartService.getCartItems(req.user.userId);
  }

  @Put(':id')
  async updateCartItem(
    @Req() req: RequestWithUser,
    @Param('id') itemId: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(req.user.userId, itemId, updateCartDto);
  }

  @Delete(':id')
  async removeCartItem(
    @Req() req: RequestWithUser,
    @Param('id') itemId: string,
  ): Promise<void> {
    return this.cartService.removeCartItem(req.user.userId, itemId);
  }

  @Delete()
  async clearCart(@Req() req: RequestWithUser): Promise<void> {
    return this.cartService.clearCart(req.user.userId);
  }
}