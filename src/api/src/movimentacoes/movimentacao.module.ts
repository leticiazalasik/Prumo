import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimentacao } from './movimentacao.entity';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoController } from './movimentacoes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Movimentacao])],
    controllers: [MovimentacaoController],
    providers: [MovimentacaoService],
})

export class MovimentacaoModule {}