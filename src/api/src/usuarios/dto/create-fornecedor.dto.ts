import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFornecedorDto {
  @ApiProperty({
    example: 'Prumo Ltda',
    description: 'Nome do fornecedor',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nome!: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ do fornecedor',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  cnpj!: string;

  @ApiProperty({
    example: true,
    description: 'Define se o fornecedor está ativo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
