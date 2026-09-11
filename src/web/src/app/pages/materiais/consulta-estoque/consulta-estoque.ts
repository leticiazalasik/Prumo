import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { InputComponent } from '../../../components/input-component/input-component';
import { ButtonComponent } from '../../../components/button-component/button-component';
import { criarPaginatorIntlPtBr } from '../../../shared/paginator-intl-pt-br';


export interface Material {
  id: number;
  codigo: string;
  nome: string;
  equipamento: string;
  fabricante: string;
  unidadeMedida: string;
  localizacao: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  ultimoValor: number;
  ativo: boolean;
}

export type StatusEstoque = 'NORMAL' | 'LIMITE' | 'ABAIXO';
type FiltroStatus = 'TODOS' | StatusEstoque;

@Component({
  selector: 'app-consulta-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './consulta-estoque.html',
  styleUrl: './consulta-estoque.scss',
  providers: [{ provide: MatPaginatorIntl, useFactory: criarPaginatorIntlPtBr }],
})
export class ConsultaEstoque {
  colunasExibidas = [
    'codigo',
    'nome',
    'equipamento',
    'fabricante',
    'estoqueAtual',
    'estoqueMinimo',
    'status',
  ];

  busca = new FormControl('', { nonNullable: true });
  private readonly buscaSignal = toSignal(this.busca.valueChanges, { initialValue: '' });

  filtroStatus = signal<FiltroStatus>('TODOS');

  pageIndex = signal(0);
  pageSize = signal(10);

  // Mock — no lugar entrará a chamada ao service/API (GET /materiais).
  private readonly materiais = signal<Material[]>([
    {
      id: 1,
      codigo: 'PST-001',
      nome: 'Pastilha CNMG 120408',
      equipamento: 'Torno CNC 01',
      fabricante: 'Sandvik',
      unidadeMedida: 'UN',
      localizacao: 'A1-03',
      estoqueAtual: 42,
      estoqueMinimo: 10,
      ultimoValor: 38.9,
      ativo: true,
    },
    {
      id: 2,
      codigo: 'PST-014',
      nome: 'Pastilha DCMT 070204',
      equipamento: 'Torno CNC 02',
      fabricante: 'Mitsubishi',
      unidadeMedida: 'UN',
      localizacao: 'A1-07',
      estoqueAtual: 10,
      estoqueMinimo: 10,
      ultimoValor: 29.5,
      ativo: true,
    },
    {
      id: 3,
      codigo: 'PST-022',
      nome: 'Pastilha TNMG 160408',
      equipamento: 'Torno CNC 03',
      fabricante: 'Kennametal',
      unidadeMedida: 'UN',
      localizacao: 'A2-01',
      estoqueAtual: 6,
      estoqueMinimo: 15,
      ultimoValor: 41.2,
      ativo: true,
    },
    {
      id: 4,
      codigo: 'FRZ-005',
      nome: 'Fresa de topo 10mm',
      equipamento: 'Centro de usinagem 01',
      fabricante: 'Seco Tools',
      unidadeMedida: 'UN',
      localizacao: 'B1-02',
      estoqueAtual: 25,
      estoqueMinimo: 8,
      ultimoValor: 112.0,
      ativo: true,
    },
    {
      id: 5,
      codigo: 'BRC-011',
      nome: 'Broca de metal duro 8mm',
      equipamento: 'Centro de usinagem 02',
      fabricante: 'Sandvik',
      unidadeMedida: 'UN',
      localizacao: 'B1-05',
      estoqueAtual: 0,
      estoqueMinimo: 5,
      ultimoValor: 54.3,
      ativo: true,
    },
    {
      id: 6,
      codigo: 'PST-030',
      nome: 'Pastilha WNMG 080408 (descontinuada)',
      equipamento: 'Torno CNC 01',
      fabricante: 'Iscar',
      unidadeMedida: 'UN',
      localizacao: 'A2-09',
      estoqueAtual: 3,
      estoqueMinimo: 5,
      ultimoValor: 33.0,
      ativo: false,
    },
  ]);

  private readonly materiaisAtivos = computed(() =>
    this.materiais().filter((material) => material.ativo),
  );

  totalAtivos = computed(() => this.materiaisAtivos().length);

  totalAbaixoDoMinimo = computed(
    () => this.materiaisAtivos().filter((m) => this.statusDe(m) === 'ABAIXO').length,
  );

  totalNoLimite = computed(
    () => this.materiaisAtivos().filter((m) => this.statusDe(m) === 'LIMITE').length,
  );

  materiaisFiltrados = computed(() => {
    const termo = (this.buscaSignal() ?? '').trim().toLowerCase();
    const status = this.filtroStatus();

    return this.materiaisAtivos().filter((material) => {
      const combinaTermo =
        !termo ||
        material.nome.toLowerCase().includes(termo) ||
        material.codigo.toLowerCase().includes(termo) ||
        material.equipamento.toLowerCase().includes(termo);

      const combinaStatus = status === 'TODOS' || this.statusDe(material) === status;

      return combinaTermo && combinaStatus;
    });
  });

  materiaisPaginados = computed(() => {
    const inicio = this.pageIndex() * this.pageSize();
    return this.materiaisFiltrados().slice(inicio, inicio + this.pageSize());
  });

  statusDe(material: Material): StatusEstoque {
    if (material.estoqueAtual < material.estoqueMinimo) return 'ABAIXO';
    if (material.estoqueAtual === material.estoqueMinimo) return 'LIMITE';
    return 'NORMAL';
  }

  rotuloStatus(status: StatusEstoque): string {
    const rotulos: Record<StatusEstoque, string> = {
      NORMAL: 'Normal',
      LIMITE: 'No limite',
      ABAIXO: 'Abaixo do mínimo',
    };
    return rotulos[status];
  }

  onBuscaChange(): void {
    this.pageIndex.set(0);
  }

  onFiltroStatusChange(status: FiltroStatus): void {
    this.filtroStatus.set(status);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  limparFiltros(): void {
    this.busca.setValue('');
    this.filtroStatus.set('TODOS');
    this.pageIndex.set(0);
  }

  async exportarExcel(): Promise<void> {
    const XLSX = await import('xlsx');

    const linhas = this.materiaisFiltrados().map((material) => ({
      Código: material.codigo,
      Nome: material.nome,
      Equipamento: material.equipamento,
      Fabricante: material.fabricante,
      'Unidade de medida': material.unidadeMedida,
      Localização: material.localizacao,
      'Estoque atual': material.estoqueAtual,
      'Estoque mínimo': material.estoqueMinimo,
      Status: this.rotuloStatus(this.statusDe(material)),
    }));

    const planilha = XLSX.utils.json_to_sheet(linhas);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, 'Estoque');

    const dataAtual = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(livro, `estoque-materiais-${dataAtual}.xlsx`);
  }
}
