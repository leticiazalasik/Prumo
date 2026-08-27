import { Injectable } from "@nestjs/common";
import { Usuario } from "./usuario.entity";
import { Repository } from 'typeorm';
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { ConflictException } from '@nestjs/common';
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>
  ) {}

 async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
  try {
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, SALT_ROUNDS);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaHash,
    });

    return await this.usuarioRepository.save(usuario);
} catch (error: any) {
        if (error.code === '23505') {
      throw new ConflictException('Usuário ou e-mail já cadastrado.');
    }
    throw error;
  }
}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
    where: {
      ativo: true,
    },
  });
  }

  async findOne(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
        where: { id},
    });

}

async findByUsuario(usuario: string): Promise<Usuario | null> {
  return this.usuarioRepository.findOne({ where: { usuario } });
}

async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
): Promise<Usuario | null>{
    const dados: UpdateUsuarioDto = { ...updateUsuarioDto };

    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS);
    }

    await this.usuarioRepository.update(id, dados);
    return this.findOne(id);
}

async desativar(id: number): Promise<Usuario | null> {
  await this.usuarioRepository.update(id, {
    ativo: false,
  });

  return this.findOne(id);
}
}