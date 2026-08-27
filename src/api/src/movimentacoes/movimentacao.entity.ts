import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Usuario } from '../usuarios/usuario.entity';
// import { Material } from '../materiais/material.entity';

@Entity('Movimentacoes')
export class Movimentacao {
  @ApiProperty({
    example: 1,
    description: 'Identificador único da movimentação',
  })
  @PrimaryGeneratedColumn('identity', {
    type: 'smallint',
    generatedIdentity: 'ALWAYS',
    primaryKeyConstraintName: 'pk_movimentacoes',
  })
  declare id: number;

  @ApiProperty({
    example: '2026-08-26T10:30:00',
    description: 'Data e hora da movimentação',
  })
  @Column({ type: 'timestamp' })
  declare data: Date;

  @ApiProperty({
    example: 'E',
    description: 'Tipo de operação realizada (E = Entrada, S = Saída)',
  })
  @Column({ type: 'varchar', length: 1 })
  declare operacao: string;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de material movimentada',
  })
  @Column({ type: 'smallint' })
  declare quantidade: number;

  @ApiProperty({
    example: 'Entrada de produtos no estoque',
    description: 'Motivo da movimentação',
  })
  @Column({ type: 'text' })
  declare motivo: string;

  @ApiProperty({
    example: 1,
    description: 'Identificador do usuário responsável pela movimentação',
  })
  @Column({ type: 'smallint' })
  declare usuario_id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({
    name: 'usuario_id',
    foreignKeyConstraintName: 'fk_usuario_id',
  })
  declare usuario: Usuario;

  @ApiProperty({
    example: 1,
    description: 'Identificador do material movimentado',
  })
  @Column({ type: 'smallint' })
  declare material_id: number;

  // @ManyToOne(() => Material)
  // @JoinColumn({
  //   name: 'material_id',
  //   foreignKeyConstraintName: 'fk_material_id',
  // })
  // declare material: Material;

  @ApiProperty({
    example: 'OP-2026-001',
    description: 'Ordem de Produção relacionada, quando aplicável',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  declare ordem_producao: string | null;

  @ApiProperty({
    example: false,
    description: 'Indica se a movimentação foi estornada',
  })
  @Column({ type: 'boolean', default: false })
  declare is_estornado: boolean;

  @ApiProperty({
    example: 'Estorno solicitado por erro de lançamento',
    description: 'Motivo do estorno da movimentação',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  declare motivo_estorno: string | null;
}