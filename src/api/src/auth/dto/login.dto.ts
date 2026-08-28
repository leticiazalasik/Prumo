import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'leticiaz' })
  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  senha!: string;
}
