export type NFeStatus = "Autorizada" | "Pendente" | "Cancelada";

export interface NFe {
  numero: string;
  emissao: string;
  destinatario: string;
  cnpj: string;
  valor: number;
  status: NFeStatus;
  chave: string;
}

export const nfes: NFe[] = [
  { numero: "#000027", emissao: "24/04 14:32", destinatario: "Mercado Boa Vista", cnpj: "12.345.678/0001-90", valor: 348, status: "Autorizada", chave: "3523 0412 3456 7890 1234" },
  { numero: "#000026", emissao: "24/04 13:10", destinatario: "Padaria Central", cnpj: "98.765.432/0001-11", valor: 127.5, status: "Autorizada", chave: "3523 0498 7654 3210 9876" },
  { numero: "#000025", emissao: "24/04 11:45", destinatario: "Lanchonete do João", cnpj: "45.678.901/0001-55", valor: 89.9, status: "Pendente", chave: "aguardando" },
  { numero: "#000024", emissao: "24/04 10:20", destinatario: "Distribuidora Sul", cnpj: "11.222.333/0001-44", valor: 214, status: "Pendente", chave: "aguardando" },
  { numero: "#000023", emissao: "23/04 17:55", destinatario: "Hortifruti Verde", cnpj: "77.888.999/0001-22", valor: 560, status: "Cancelada", chave: "3523 0477 8889 9920 0001" },
  { numero: "#000022", emissao: "23/04 16:20", destinatario: "Restaurante Sabor & Arte", cnpj: "55.444.333/0001-77", valor: 1280.5, status: "Autorizada", chave: "3523 0455 4433 0001 7777" },
  { numero: "#000021", emissao: "23/04 14:08", destinatario: "Mercearia da Vila", cnpj: "22.333.444/0001-66", valor: 432.7, status: "Autorizada", chave: "3523 0422 3344 0001 6666" },
  { numero: "#000020", emissao: "23/04 11:30", destinatario: "Confeitaria Doce Lar", cnpj: "33.444.555/0001-88", valor: 189.9, status: "Autorizada", chave: "3523 0433 4455 0001 8888" },
];

export type LancamentoTipo = "Entrada" | "Saída";
export interface Lancamento {
  hora: string;
  tipo: LancamentoTipo;
  descricao: string;
  categoria: string;
  valor: number;
}

export const lancamentos: Lancamento[] = [
  { hora: "14:32", tipo: "Entrada", descricao: "Venda PDV #00128", categoria: "Vendas PDV", valor: 248.5 },
  { hora: "13:55", tipo: "Entrada", descricao: "Venda Delivery iFood", categoria: "Delivery", valor: 89.9 },
  { hora: "13:10", tipo: "Saída", descricao: "Pagamento Hortifruti Verde", categoria: "Fornecedores", valor: 320 },
  { hora: "12:40", tipo: "Entrada", descricao: "Venda PDV #00127", categoria: "Vendas PDV", valor: 156.7 },
  { hora: "11:30", tipo: "Saída", descricao: "Conta de luz CEMIG", categoria: "Despesas fixas", valor: 480 },
  { hora: "10:45", tipo: "Entrada", descricao: "Venda PDV #00126", categoria: "Vendas PDV", valor: 72.3 },
  { hora: "10:10", tipo: "Saída", descricao: "Compra de embalagens", categoria: "Fornecedores", valor: 145.2 },
  { hora: "09:20", tipo: "Entrada", descricao: "Abertura de caixa", categoria: "Vendas PDV", valor: 200 },
];

export interface Produto {
  nome: string;
  categoria: string;
  qtd: number;
  qtdMin: number;
  unidade: string;
  preco: number;
}

export const produtos: Produto[] = [
  { nome: "Arroz Branco Tipo 1", categoria: "Mercearia", qtd: 48, qtdMin: 20, unidade: "kg", preco: 6.5 },
  { nome: "Feijão Carioca", categoria: "Mercearia", qtd: 12, qtdMin: 15, unidade: "kg", preco: 9.9 },
  { nome: "Óleo de Soja 900ml", categoria: "Mercearia", qtd: 4, qtdMin: 10, unidade: "un", preco: 7.2 },
  { nome: "Açúcar Cristal", categoria: "Mercearia", qtd: 32, qtdMin: 15, unidade: "kg", preco: 4.8 },
  { nome: "Carne Bovina (Patinho)", categoria: "Açougue", qtd: 8, qtdMin: 10, unidade: "kg", preco: 42.9 },
  { nome: "Frango Inteiro", categoria: "Açougue", qtd: 18, qtdMin: 8, unidade: "kg", preco: 14.5 },
  { nome: "Tomate Salada", categoria: "Hortifruti", qtd: 6, qtdMin: 12, unidade: "kg", preco: 8.9 },
  { nome: "Alface Crespa", categoria: "Hortifruti", qtd: 22, qtdMin: 10, unidade: "un", preco: 3.5 },
  { nome: "Coca-Cola 2L", categoria: "Bebidas", qtd: 36, qtdMin: 20, unidade: "un", preco: 12.5 },
  { nome: "Água Mineral 500ml", categoria: "Bebidas", qtd: 2, qtdMin: 24, unidade: "un", preco: 2.5 },
  { nome: "Prato Feito Executivo", categoria: "Self-service", qtd: 50, qtdMin: 30, unidade: "un", preco: 28.9 },
  { nome: "Marmita P", categoria: "Self-service", qtd: 80, qtdMin: 40, unidade: "un", preco: 18.5 },
];

export const produtoStatus = (p: Produto): "OK" | "Estoque baixo" | "Crítico" => {
  if (p.qtd <= p.qtdMin * 0.5) return "Crítico";
  if (p.qtd < p.qtdMin) return "Estoque baixo";
  return "OK";
};

export const salesLast7Days = [
  { dia: "Qui", vendas: 2840 },
  { dia: "Sex", vendas: 3420 },
  { dia: "Sáb", vendas: 2680 },
  { dia: "Dom", vendas: 3120 },
  { dia: "Seg", vendas: 2450 },
  { dia: "Ter", vendas: 3010 },
  { dia: "Hj", vendas: 3840 },
];

export const cashflowLast7Days = [
  { dia: "Qui", entradas: 3240, saidas: 1820 },
  { dia: "Sex", entradas: 3820, saidas: 2150 },
  { dia: "Sáb", entradas: 2980, saidas: 1240 },
  { dia: "Dom", entradas: 3550, saidas: 980 },
  { dia: "Seg", entradas: 2810, saidas: 1670 },
  { dia: "Ter", entradas: 3320, saidas: 1980 },
  { dia: "Hj", entradas: 4320, saidas: 1890 },
];