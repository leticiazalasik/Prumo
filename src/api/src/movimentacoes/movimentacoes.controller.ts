import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MovimentacaoService } from "./movimentacao.service";
import { Movimentacao } from "./movimentacao.entity";
import { CreateMovimentacaoDto } from "./dto/create-movimentacao.dto";

@ApiTags('Movimentações')
@Controller('movimentacoes')
export class MovimentacaoController {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

    @ApiOperation({
    summary: 'Criar uma nova movimentação',
  })
  @ApiResponse({
    status: 201,
    description: 'Movimentação criada com sucesso.',
    type: Movimentacao,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createMovimentacaoDto: CreateMovimentacaoDto,
    @Req() req: Request,
  ): Promise<Movimentacao> {
    const usuarioId = (req as any).user.id;
    return this.movimentacaoService.create(
      createMovimentacaoDto,
      usuarioId,
    );
  }

 @ApiOperation({ summary: 'Listar movimentações' })
@ApiResponse({
  status: 200,
  description: 'Lista de movimentações.',
  type: [Movimentacao],
})
@Get()
@UseGuards(JwtAuthGuard)
findAll() {
  return this.movimentacaoService.findAll();
}

 @ApiOperation({ summary: 'Buscar movimentação por ID' })
@ApiParam({
  name: 'id',
  example: 1,
  description: 'ID da movimentação',
})
@ApiResponse({
  status: 200,
  description: 'Movimentação encontrada.',
  type: Movimentacao,
})
@ApiResponse({
  status: 404,
  description: 'Movimentação não encontrada.',
})
@Get(':id')
@UseGuards(JwtAuthGuard)
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.movimentacaoService.findOne(id);
}

  
}