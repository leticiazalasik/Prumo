import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateFornecedorDto {
  @ApiPropertyOptional({ example: 'Letícia Maria' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nome?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  cnpj?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
