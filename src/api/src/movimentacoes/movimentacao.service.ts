import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimentacao } from './movimentacao.entity';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
// import { Material } from '../materiais/material.entity';

@Injectable()
export class MovimentacaoService {
  constructor(
    @InjectRepository(Movimentacao)
    private movimentacaoRepository: Repository<Movimentacao>,

    // @InjectRepository(Material)
    // private materialRepository: Repository<Material>,
  ) {}

  async create(
    createMovimentacaoDto: CreateMovimentacaoDto,
    usuarioId: number,
  ): Promise<Movimentacao> {
    const {
      material_id,
      quantidade,
      operacao,
      motivo,
      ordem_producao,
    } = createMovimentacaoDto;

    if (quantidade <= 0) {
      throw new BadRequestException(
        'A quantidade da movimentação deve ser maior que zero.',
      );
    }

    if (!['E', 'S'].includes(operacao)) {
      throw new BadRequestException(
        'A operação deve ser E (Entrada) ou S (Saída).',
      );
    }

    // const material = await this.materialRepository.findOne({
    //   where: { id: material_id },
    // });

    // if (!material) {
    //   throw new NotFoundException(
    //     'Material não encontrado.',
    //   );
    // }

    // if (!material.ativo) {
    //   throw new BadRequestException(
    //     'Não é possível realizar movimentação de um material inativo.',
    //   );
    // }

    // if (
    //   operacao === 'S' &&
    //   quantidade > material.estoque_atual
    // ) {
    //   throw new BadRequestException(
    //     'A quantidade solicitada é maior que o estoque disponível.',
    //   );
    // }

    // if (operacao === 'E') {
    //   material.estoque_atual += quantidade;
    // } else {
    //   material.estoque_atual -= quantidade;
    // }

    // await this.materialRepository.save(material);

    const movimentacao = this.movimentacaoRepository.create({
      material_id,
      quantidade,
      operacao,
      motivo,
      ordem_producao: ordem_producao ?? null,
      usuario_id: usuarioId,
      data: new Date(),
      is_estornado: false,
      motivo_estorno: null,
    });

    const movimentacaoSalva =
      await this.movimentacaoRepository.save(movimentacao);

    // if (material.estoque_atual <= material.estoque_minimo) {
    //   // Aqui entra o serviço responsável pelo envio do alerta
    //   // por e-mail aos usuários responsáveis.
    // }

    return movimentacaoSalva;
  }

  async findAll(): Promise<Movimentacao[]> {
    return this.movimentacaoRepository.find({
      relations: {
        // material: true,
        usuario: true,
      },
    });
  }

  async findOne(id: number): Promise<Movimentacao | null> {
    return this.movimentacaoRepository.findOne({
      where: { id },
      relations: {
        // material: true,
        usuario: true,
      },
    });
  }
}