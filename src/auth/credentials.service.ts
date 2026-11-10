
import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/entities/user.entity.js';
import { SignUpDto } from './dto/auth.dto.js';
import { sign } from 'crypto';
@Injectable()
export class CredentialsService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

async register(dto: SignUpDto): Promise<Omit<User, 'passwordhash'>> {
  const { email, username, password, firstName, lastName } = dto;
  if (await this.UsersService.findByEmail(email)) {
    throw new ConflictException('Email already registered');
  }
  if (await this.UsersService.findByUsername(username)) {
    throw new ConflictException('Username already registered');
  } 

  const user = await this.UsersService.create({
    email,
    username,
    firstName,
    lastName,
    passwordhash: await this.passwordHasher.hash(password),
  });

  const { passwordhash: _, ...newUser } = user;

  return newUser
}

  /** The user, or `null` when the email or the password is wrong. */
  async verify(email: string, password: string): Promise<User | null> {
    const found = await this.UsersService.findCredentials(email);
    const valid = await this.passwordHasher.verify(password, found?.PasswordHash);
    if (!valid || !found?.PasswordHash) {
      return null;
    }
    // The cost settings changed since this hash was stored: upgrade it now,
    // while we have the plaintext.
    // if (this.passwordHasher.needsRehash(found.passwordHash)) {
    //   await this.UsersService.updatePasswordHash(found.user.id, await this.passwordHasher.hash(password));
    // }
    return this.UsersService.findByEmail(email);
  }
}
