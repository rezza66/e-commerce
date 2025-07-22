import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const { productId, name, image, price, quantity } = addToCartDto;

    // Check if product already exists in cart
    const existingCartItem = await this.cartModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      // Update quantity if product exists
      existingCartItem.quantity += quantity;
      const updatedItem = await existingCartItem.save();
      return this.mapToCartResponseDto(updatedItem);
    }

    // Create new cart item
    const newCartItem = new this.cartModel({
      userId,
      productId,
      name,
      image,
      price,
      quantity,
    });

    const savedItem = await newCartItem.save();
    return this.mapToCartResponseDto(savedItem);
  }

  async getCartItems(userId: string): Promise<CartResponseDto[]> {
    const cartItems = await this.cartModel.find({ userId }).exec();
    return cartItems.map(item => this.mapToCartResponseDto(item));
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartResponseDto> {
    const cartItem = await this.cartModel.findOne({
      _id: itemId,
      userId,
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartDto.quantity <= 0) {
      await this.removeCartItem(userId, itemId);
      return this.mapToCartResponseDto(cartItem);
    }

    cartItem.quantity = updateCartDto.quantity;
    const updatedItem = await cartItem.save();
    return this.mapToCartResponseDto(updatedItem);
  }

  async removeCartItem(userId: string, itemId: string): Promise<void> {
    const result = await this.cartModel.deleteOne({
      _id: itemId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.deleteMany({ userId });
  }

  private mapToCartResponseDto(cartItem: CartDocument): CartResponseDto {
  return {
    id: (cartItem._id as Types.ObjectId).toString(),
    productId: cartItem.productId.toString(),
    name: cartItem.name,
    image: cartItem.image,
    price: cartItem.price,
    quantity: cartItem.quantity,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
  };
}
}