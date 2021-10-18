
const fs = require('fs');
const path = require('path');
const xml = require('./xml.json')
var convert = require('xml2json');
let objResponse = []
let countValorServicos = 1
let countCnpjEmissor = 1
let countNumeroNota = 1
let countCnpjDestinatario = 1
let countDataEmissao = 1



let tes = fs.readdirSync(__dirname)
    .filter(function (file) {
        return (
            (file.slice(-3) == 'xml')
        );
    })

const checkCnpjCpf = (cpf_cnpj) => {

    if(cpf_cnpj.length != 14 && (cpf_cnpj.length != 11))
        return false
    
    
    
    
    return true
}





function objMap(obj, response) {
    Object.keys(obj).map(o => {

        if (o.match(/.*val.*serv.*/i)) {
            response = ({ ...response, ValorServicos: obj[o], countValorServicos: countValorServicos++ })
        }
        if (o.match(/.*prestador.*/i) || o.match(/.*remeten.*/i)) {
            let cnpj = obj[o][Object.keys(obj[o]).filter(e => e.match(/.*npj.*/i))]
            if (cnpj) {
                response = ({ ...response, countCnpjEmissor: countCnpjEmissor++, cnpjEmissor: typeof (cnpj) == "object" ? cnpj[Object.keys(cnpj).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
            }
        }
        if (o.match(/.*prestador.*cnpj.*/i)) {
            // console.log(Number(obj[o]))
            let cnpj = obj[o]
            if (cnpj) {
                response = ({ ...response, countCnpjEmissor: countCnpjEmissor++, cnpjEmissor: typeof (cnpj) == "object" ? cnpj[Object.keys(cnpj).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
            }
        }
        if (o.match(/.*tomador.*cnpj.*/i)) {
            let cnpj = obj[o]
            if (cnpj) {
                response = ({ ...response, countCnpjDestinatario: countCnpjDestinatario++, cnpjDestinatario: typeof (cnpj) == "object" ? cnpj[Object.keys(cnpj).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
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
                response = ({ ...response, countNumeroNota: countNumeroNota++, numeroNota: String(Number(numero)) })
        }
        if (o.match(/.*infnfse.*/i) || o.match(/.*ident.*nfse.*/i)) {
            let numero = obj[o][Object.keys(obj[o]).filter(e => e.match(/.*numero.*/i))]
            if (!numero)
                return false
            // let ano = numero.substring(0, 4)
            // numero = ano == new Date().getFullYear() ? numero.replace(ano, '') : numero
            if (numero)
                response = ({ ...response, countNumeroNota: countNumeroNota++, numeroNota: String(Number(numero)) })
        }
        if (o.match(/.*tomador.*/i)) {
            let cnpj = obj[o][Object.keys(obj[o]).filter(e => e.match(/.*npj.*/i))]
            let razaoSocial = obj[o][Object.keys(obj[o]).filter(e => e.match(/.*ocia.*/i))]
            if (cnpj) {
                response = ({ ...response, countCnpjDestinatario: countCnpjDestinatario++, cnpjDestinatario: typeof (cnpj) == "object" ? cnpj[Object.keys(cnpj).filter(e => e.match(/.*cnpj.*/i))] : cnpj })
            }
            if (razaoSocial)
                response = ({ ...response, razaoSocialDestinatario: razaoSocial })
        }
        if (o.match(/.*dt.*miss.*/i) || (o.match(/.*data.*miss.*/i)) && o.match(/^((?!Rps).)*$/i)) {

            response = ({ ...response, countDataEmissao: countDataEmissao++, DataEmissao: obj[o] })
        }

        if (typeof (obj[o]) == "object") {
            return objMap(obj[o], response)
        }
    })

    objResponse = { ...objResponse, ...response }
}


tes.forEach(function (file, index) {
    setTimeout(() => {
        console.log(file)
        try {
            var xml = require('fs').readFileSync(`./${file}`, 'utf8');
            var result = convert.toJson(xml)
            result = JSON.parse(result)
           



            let response = {}
            response = ({ ...response, nomeArquivo: file })
            objResponse = []
            countValorServicos = 1
            countCnpjEmissor = 1
            countNumeroNota = 1
            countCnpjDestinatario = 1
            countDataEmissao = 1
            objMap(result, response, countValorServicos, countCnpjEmissor, countNumeroNota, countCnpjDestinatario, countDataEmissao)

            if (!("nomeArquivo" in objResponse)
                || !("numeroNota" in objResponse)
                || !("DataEmissao" in objResponse)
                || !("ValorServicos" in objResponse)
                || !("cnpjEmissor" in objResponse)
                || !("cnpjDestinatario" in objResponse)
                || !(objResponse.countNumeroNota == 1)
                || !(objResponse.countDataEmissao == 1)
                || !(objResponse.countValorServicos == 1)
                || !(objResponse.countCnpjEmissor == 1)
                || !(objResponse.countCnpjDestinatario == 1)
                || !(checkCnpjCpf(objResponse.cnpjDestinatario))
                || !(checkCnpjCpf(objResponse.cnpjEmissor))
            ) {
                objResponse = {
                    ...objResponse, ...{ leitura: false }
                }
            }
            else {
                objResponse = { ...objResponse, ...{ leitura: true } }
            }

            console.log(objResponse)


        } catch (error) {
            console.log(error)
        }

    }, 1000 * (index + 1));
});





