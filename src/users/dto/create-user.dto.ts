import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Alice', maxLength: 100 })
    email: string;
    passwordhash: string;
    username: string;
    firstName: string;
    lastName: string;
}
