export default class NfeServices {
  xml: Object;

  constructor(data) {
    this.xml = data;
  }

  async readXml() {
    try {
     return this.objMap(this.xml);
    } catch (error) {
      console.log("error", error);
    }
  }

  checkCnpjCpf(cpf_cnpj) {
    if (!cpf_cnpj || (cpf_cnpj.length != 14 && cpf_cnpj.length != 11))
      return false;

    return true;
  }

  async objMap(obj) {

    const data = obj.nfeProc.NFe.infNFe;

    return {
      header: {
        versao: data.versao,
        chave: data.chave,
        ...data.ide,
      },
      emissor: {
        ...data.emit,
      },
      destinatario: {
        ...data.dest,
      },
      itens: {
        ...data.det,
      },
      total: {
        ...data.total,
      },
      transporte: {
        ...data.transp,
      },
      cobranca: {
        ...data.cobr,
      },
      pagamento: {
        ...data.pag,
      },
      informacaoAdicional: {
        ...data.infAdic,
      },
    };
  }
}
