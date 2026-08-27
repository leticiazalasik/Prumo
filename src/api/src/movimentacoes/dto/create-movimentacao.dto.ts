import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMovimentacaoDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador do material que será movimentado',
  })
  @IsInt()
  @IsPositive()
  material_id!: number;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de material a ser movimentada',
  })
  @IsInt()
  @IsPositive()
  quantidade!: number;

  @ApiProperty({
    example: 'E',
    description: 'Tipo de operação: E = Entrada ou S = Saída',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  operacao!: string;

  @ApiProperty({
    example: 'Entrada de produtos no estoque',
    description: 'Motivo da movimentação',
  })
  @IsString()
  @IsNotEmpty()
  motivo!: string;

  @ApiProperty({
    example: 'OP-2026-001',
    description: 'Ordem de Produção, quando aplicável',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ordem_producao?: string;
}