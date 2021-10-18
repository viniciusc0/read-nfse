export default class NfceServices {

    xml: Object
    objResponseInitial: Object = {
        countNumeroNota: 1,
        countDataEmissao: 1,
        countValorServicos: 1,
        countCnpjEmissor: 1,
        countCnpjDestinatario: 1,
        cnpjEmissor: '',
        cnpjDestinatario: ''
    }
    objResponse = {} as any
    countValorServicos = 1
    countCnpjEmissor = 1
    countNumeroNota = 1
    countCnpjDestinatario = 1
    countDataEmissao = 1


    constructor(data) {

        this.xml = data?.xml
        // console.log(this.xml, "lido")
        return
    }


    async readXml() {
        try {

            let response = {}
            // response = ({ ...response, nomeArquivo: file })
            this.objResponse = {}
            this.countValorServicos = 1
            this.countCnpjEmissor = 1
            this.countNumeroNota = 1
            this.countCnpjDestinatario = 1
            this.countDataEmissao = 1
            this.objMap(this.xml, response)

            if (
                !("numeroNota" in this.objResponse)
                || !("DataEmissao" in this.objResponse)
                || !("ValorServicos" in this.objResponse)
                || !("cnpjEmissor" in this.objResponse)
                || !("cnpjDestinatario" in this.objResponse)
                || !(this.objResponse.countNumeroNota == 1)
                || !(this.objResponse.countDataEmissao == 1)
                || !(this.objResponse.countValorServicos == 1)
                || !(this.objResponse.countCnpjEmissor == 1)
                || !(this.objResponse.countCnpjDestinatario == 1)
                || !(this.checkCnpjCpf(this.objResponse.cnpjDestinatario))
                || !(this.checkCnpjCpf(this.objResponse.cnpjEmissor))
            ) {
                this.objResponse =
                {
                    ...{
                        error:
                        {
                            numeroNota: ("numeroNota" in this.objResponse),
                            DataEmissao: ("DataEmissao" in this.objResponse),
                            ValorServicos: ("ValorServicos" in this.objResponse),
                            cnpjEmissor: ("cnpjEmissor" in this.objResponse),
                            cnpjDestinatario: ("cnpjDestinatario" in this.objResponse),
                            countNumeroNota: this.objResponse.countNumeroNota,
                            countDataEmissao: this.objResponse.countDataEmissao,
                            countValorServicos: this.objResponse.countValorServicos,
                            countCnpjEmissor: this.objResponse.countCnpjEmissor,
                            countCnpjDestinatario: this.objResponse.countCnpjDestinatario,
                            checkCnpjDestinatario: this.checkCnpjCpf(this.objResponse.cnpjDestinatario),
                            checkCnpjEmissor: this.checkCnpjCpf(this.objResponse.cnpjEmissor),

                        },
                        docRead: {
                            ...this.objResponse,
                        },
                        doc: this.xml,
                        leitura: false

                    }
                }
            }
            else {
                this.objResponse =
                {
                    numeroNota: this.objResponse.numeroNota,
                    DataEmissao: this.objResponse.DataEmissao,
                    ValorServicos: this.objResponse.ValorServicos,
                    cnpjEmissor: this.objResponse.cnpjEmissor,
                    cnpjDestinatario: this.objResponse.cnpjDestinatario,
                    leitura: true
                }

            }

            return this.objResponse

        } catch (error) {
            console.log("error", error)
        }
    }


    checkCnpjCpf(cpf_cnpj) {

        if (!cpf_cnpj || (cpf_cnpj.length != 14 && (cpf_cnpj.length != 11)))
            return false

        return true
    }




    async objMap(obj, response) {
        Object.keys(obj).map(o => {

            if (o.match(/.*val.*serv.*/i)) {
                response = ({ ...response, ValorServicos: obj[o], countValorServicos: this.countValorServicos++ })
            }
            //Inicio cnpj do prestador
            if (o.match(/.*prestador.*/i) || o.match(/.*remeten.*/i)) {
                let cnpj = obj[o][(Object.keys(obj[o]) as any).filter(e => e.match(/.*npj.*/i))]

                if (cnpj) {
                    //existem layouts que o cnpj vem idenficado no inicio e no fim do xml
                    //então se o cnpj do prestador ja tiver sido lido, mas o numero do cnpj for o mesmo lido anteriormente, ele é aceito
                    if (this.countCnpjEmissor == 1 && response.cnpjEmissor != cnpj) {
                        response = ({
                            ...response, countCnpjEmissor: this.countCnpjEmissor++, cnpjEmissor: typeof (cnpj) == "object" ?
                                cnpj[(Object.keys(cnpj) as any).filter(e => e.match(/.*cnpj.*/i))] :
                                cnpj
                        })
                    }

                }
            } else
                if (o.match(/.*prestador.*cnpj.*/i) || o.match(/.*usuario.*cnpj.*/i)) {
                    let cnpj = obj[o]
                    if (cnpj) {
                        response = ({ ...response, countCnpjEmissor: this.countCnpjEmissor++, cnpjEmissor: typeof (cnpj) == "object" ? cnpj[(Object.keys(cnpj) as any).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
                    }
                }
            //Fim cnpj prestador
            if (o.match(/.*tomador.*cnpj.*/i)) {
                let cnpj = obj[o]
                if (cnpj) {
                    response = ({ ...response, countCnpjDestinatario: this.countCnpjDestinatario++, cnpjDestinatario: typeof (cnpj) == "object" ? cnpj[(Object.keys(cnpj) as any).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
                }

            }
            if (o.match(/.*tomador.*razao.*social.*/i)) {
                let razaoSocial = obj[o]
                if (razaoSocial)
                    response = ({ ...response, razaoSocialDestinatario: razaoSocial })
            }
            if (o.match(/.*num.*nfe.*/i) || o.match(/.*num.*nota.*/i)) {
                let numero = obj[o]
                // let ano = numero.substring(0, 4)
                // numero = ano == new Date().getFullYear() ? numero.replace(ano, '') : numero
                if (numero)
                    response = ({ ...response, countNumeroNota: this.countNumeroNota++, numeroNota: String(Number(numero)) })
            }
            if (o.match(/.*infnfse.*/i) || o.match(/.*ident.*nfse.*/i)) {
                let numero = obj[o][(Object.keys(obj[o]) as any).filter(e => e.match(/.*numero.*/i))]
                if (!numero)
                    return false
                // let ano = numero.substring(0, 4)
                // numero = ano == new Date().getFullYear() ? numero.replace(ano, '') : numero
                if (numero)
                    response = ({ ...response, countNumeroNota: this.countNumeroNota++, numeroNota: String(Number(numero)) })
            }
            if (o.match(/.*tomador.*/i)) {
                let cnpj = obj[o][(Object.keys(obj[o]) as any).filter(e => e.match(/.*npj.*/i))]
                let razaoSocial = obj[o][(Object.keys(obj[o]) as any).filter(e => e.match(/.*ocia.*/i))]
                if (cnpj) {
                    response = ({ ...response, countCnpjDestinatario: this.countCnpjDestinatario++, cnpjDestinatario: typeof (cnpj) == "object" ? cnpj[(Object.keys(cnpj) as any).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
                }
                if (razaoSocial)
                    response = ({ ...response, razaoSocialDestinatario: razaoSocial })
            }
            //Data Emissao
            if (o.match(/.*dt.*miss.*/i) || (o.match(/.*data.*miss.*/i)) && o.match(/^((?!Rps).)*$/i)) {

                if (obj[o].indexOf('T') > -1) {
                    obj[o] = obj[o].replace('T', ' ')
                }
                response = ({ ...response, countDataEmissao: this.countDataEmissao++, DataEmissao: obj[o] })
            }

            if (typeof (obj[o]) == "object") {
                return this.objMap(obj[o], response)
            }
        })

        this.objResponse = { ...this.objResponse, ...response }
    }

}