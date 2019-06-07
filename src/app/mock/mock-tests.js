module.exports = [
    {
        id: 'A1',
        description: 'A1 - Consulta TJ e CNA',
        robots: ['R1', 'R2'],
        matched: {
            req: ['numeroProcesso']
        }
    },
    {
        id: 'A2',
        description: 'A2 - Consulta no CNA e TJ',
        robots: ['R2', 'R1'],
        matched: {
            req: ['numeroOab']
        }
    },
    {
        id: 'A3',
        description: 'A3 - Consulta TJ, CNA e no Serasa',
        robots: ['R1', 'R2', 'R3'],
        matched: {
            req: ['numeroProcesso'],
            res: ['advogadoNoSerasa']
        }
    },
    {
        id: 'A4',
        description: 'A4 - Consulta TJ retona numeroOab',
        robots: ['R1', 'R2', 'R3'],
        matched: {
            res: ['numeroOab']
        }
    },
    {
        id: 'AN',
        description: 'AN - Agente de erro com robot inexistente',
        robots: ['RN'],
        matched: {
            req: ['robotInvalid']
        }
    }
]
