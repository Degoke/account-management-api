import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async loginUser(user: any) {
    const payload = { email: user.email, sub: user._id };
    const currentUser = await this.userService.findById(user.id);
    return {
      message: 'Login success',
      user: currentUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
