import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = new this.productModel(dto);
    return product.save();
  }

  findAll() {
    return this.productModel.find().populate('category').exec(); 
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('category').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');

    if (dto.image && product.image) {
      const oldImagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        product.image,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('category')
      .exec();
    return updated;
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.image) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        product.image,
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.productModel.findByIdAndDelete(id).exec();

    return { message: 'Product deleted successfully' };
  }
}
