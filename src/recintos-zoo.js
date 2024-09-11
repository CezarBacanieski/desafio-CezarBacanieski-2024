export class RecintosZoo {
  constructor() {
    this.recintos = [
      {
        numero: 1,
        bioma: 'savana',
        tamanho: 10,
        animais: [{ especie: 'MACACO', quantidade: 3 }],
      },
      { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
      {
        numero: 3,
        bioma: 'savana e rio',
        tamanho: 7,
        animais: [{ especie: 'GAZELA', quantidade: 1 }],
      },
      { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
      {
        numero: 5,
        bioma: 'savana',
        tamanho: 9,
        animais: [{ especie: 'LEAO', quantidade: 1 }],
      },
    ];

    this.animais = {
      LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
    };
  }

  analisaRecintos(animal, quantidade) {
    // Verifica se o animal é válido
    if (!this.animais[animal]) {
      return { erro: 'Animal inválido' };
    }

    // Verifica se a quantidade é válida
    if (quantidade < 1) {
      return { erro: 'Quantidade inválida' };
    }

    const recintosViaveis = this.recintos
      .filter((recinto) => this.isRecintoViavel(recinto, animal, quantidade))
      .map((recinto) => this.formatarRecinto(recinto, animal, quantidade));

    if (recintosViaveis.length === 0) {
      return { erro: 'Não há recinto viável' };
    }

    return { recintosViaveis };
  }

  isRecintoViavel(recinto, animal, quantidade) {
    const especieAnimal = this.animais[animal];

    // Verifica se o bioma é compatível
    if (
      !especieAnimal.biomas.includes(recinto.bioma) &&
      !(
        recinto.bioma === 'savana e rio' &&
        especieAnimal.biomas.includes('savana')
      )
    ) {
      return false;
    }

    // Verifica se é um recinto carnívoro e se o animal é carnívoro
    if (
      especieAnimal.carnivoro &&
      recinto.animais.length > 0 &&
      recinto.animais[0].especie !== animal
    ) {
      return false;
    }

    // Verifica se há espaço suficiente
    const espacoOcupado = this.calcularEspacoOcupado(recinto);
    const espacoNecessario =
      especieAnimal.tamanho * quantidade +
      (recinto.animais.length > 0 && !especieAnimal.carnivoro && quantidade > 0
        ? Math.max(1, quantidade - 1)
        : 0);

    if (recinto.tamanho - espacoOcupado < espacoNecessario) {
      return false;
    }

    // Verifica se há macacos e se eles estão sozinhos
    if (
      animal === 'MACACO' &&
      quantidade === 1 &&
      recinto.animais.length === 0
    ) {
      return false; // Macacos não gostam de ficar sozinhos
    }

    // Verifica regra dos hipopótamos
    if (
      animal === 'HIPOPOTAMO' &&
      recinto.bioma !== 'savana e rio' &&
      recinto.animais.length > 0
    ) {
      return false; // Hipopótamos só aceitam convivência em biomas savana e rio
    }

    return true;
  }

  calcularEspacoOcupado(recinto) {
    let espacoOcupado = 0;

    for (let animal of recinto.animais) {
      espacoOcupado += this.animais[animal.especie].tamanho * animal.quantidade;
    }

    // Se houver mais de uma espécie, acrescentar 1 espaço extra
    if (recinto.animais.length > 1) {
      espacoOcupado += 1;
    }

    return espacoOcupado;
  }

  formatarRecinto(recinto, animal, quantidade) {
    const espacoOcupado = this.calcularEspacoOcupado(recinto);
    const espacoNecessario =
      this.animais[animal].tamanho * quantidade +
      (recinto.animais.length > 0 && !this.animais[animal].carnivoro ? 1 : 0);
    const espacoLivre = recinto.tamanho - (espacoOcupado + espacoNecessario);
    return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
  }
}
