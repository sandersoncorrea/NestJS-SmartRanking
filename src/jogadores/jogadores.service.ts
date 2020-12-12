import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';

@Injectable() // classe que pode ser gerenciada pelo Nest IoC Container
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorExiste = await this.jogadores.find((j) => j.email === email);

    if (jogadorExiste) {
      this.atualizar(jogadorExiste, criarJogadorDto);
    } else this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadores.find(
      (j) => j.email === email,
    );
    if (!jogadorEncontrado)
      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    // const jogadorEncontrado = await this.jogadores.find(
    //   (j) => j.email === email,
    // );

    this.jogadores = this.jogadores.filter((j) => j.email !== email);
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuid(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'foto123.jpg',
    };
    this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(jogador: Jogador, criarJogadorDto: CriarJogadorDto): void {
    const { nome } = criarJogadorDto;

    jogador.nome = nome;
  }
}
