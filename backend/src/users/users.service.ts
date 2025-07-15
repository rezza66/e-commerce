import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password');

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string): Promise<UserDocument> {
    const deleted = await this.userModel.findByIdAndDelete(id).select('-password');
    if (!deleted) throw new NotFoundException('User not found');
    return deleted;
  }
}
