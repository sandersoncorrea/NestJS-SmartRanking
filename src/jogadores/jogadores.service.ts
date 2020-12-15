import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
// import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable() // classe que pode ser gerenciada pelo Nest IoC Container
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorExiste = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorExiste) {
      this.atualizar(criarJogadorDto);
    } else this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado)
      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<any> {
    return await this.jogadorModel.remove({ email });
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();
  }
}
