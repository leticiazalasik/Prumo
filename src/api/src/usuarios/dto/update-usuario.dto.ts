import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PerfilUsuario } from '../perfil.enum';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Letícia Maria' })
  nome?: string;

  @ApiPropertyOptional({ example: 'Zalasik' })
  sobrenome?: string;

  @ApiPropertyOptional({ example: 'leticia@email.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'leticiaz' })
  usuario?: string;

  @ApiPropertyOptional({ example: 'novaSenha123' })
  senha?: string;

  @ApiPropertyOptional({ enum: PerfilUsuario, example: PerfilUsuario.ADMIN })
  @IsOptional()
  @IsEnum(PerfilUsuario)
  perfil?: PerfilUsuario;

  @ApiPropertyOptional({ example: true })
  ativo?: boolean;
}