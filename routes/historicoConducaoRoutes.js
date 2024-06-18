const express = require('express');
const router = express.Router();


function historicoConducaoRoutes(db) {

    
    router.post('/historico-conducao', (req, res) => {
        const { id_motorista, id_veiculo, data_historico_conducao, disponibilidade, status_saude, pronto_para_viagem, nome_completo } = req.body;

        if (!id_motorista || !id_veiculo || !data_historico_conducao) {
            return res.status(400).send('Erro: Todos os campos obrigatórios devem ser fornecidos.');
        }

        db.query('INSERT INTO Historico_Conducao (id_motorista, id_veiculo, data_historico_conducao, disponibilidade, status_saude, pronto_para_viagem, nome_completo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_motorista, id_veiculo, data_historico_conducao, disponibilidade, status_saude, pronto_para_viagem, nome_completo],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao criar registro no histórico de condução');
                }
                res.send('Registro criado com sucesso');
            });
    });

    // Rota para buscar um registro por ID
    router.get('/historico-conducao/:id', (req, res) => {
        const id_historico_conducao = req.params.id;

        db.query('SELECT * FROM Historico_Conducao WHERE id_historico_conducao = ?', [id_historico_conducao], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar registro no histórico de condução');
            }
            if (results.length === 0) {
                return res.status(404).send('Registro não encontrado');
            }
            res.json(results[0]);
        });
    });

    // Rota para buscar todos os registros
    router.get('/historico-conducao', (req, res) => {
        db.query('SELECT * FROM Historico_Conducao', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar registros do histórico de condução');
            }
            res.json(results);
        });
    });

    // Rota para atualizar um registro existente
    router.put('/historico-conducao/:id', (req, res) => {
        const id_historico_conducao = req.params.id;
        const { id_motorista, id_veiculo, data_historico_conducao, disponibilidade, status_saude, pronto_para_viagem, nome_completo } = req.body;

        db.query('UPDATE Historico_Conducao SET id_motorista = ?, id_veiculo = ?, data_historico_conducao = ?, disponibilidade = ?, status_saude = ?, pronto_para_viagem = ?, nome_completo = ? WHERE id_historico_conducao = ?',
            [id_motorista, id_veiculo, data_historico_conducao, disponibilidade, status_saude, pronto_para_viagem, nome_completo, id_historico_conducao],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao atualizar registro no histórico de condução');
                }
                res.send('Registro atualizado com sucesso');
            });
    });

    // Rota para excluir um registro
    router.delete('/historico-conducao/:id', (req, res) => {
        const id_historico_conducao = req.params.id;

        db.query('DELETE FROM Historico_Conducao WHERE id_historico_conducao = ?', [id_historico_conducao], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao excluir registro no histórico de condução');
            }
            res.send('Registro excluído com sucesso');
        });
    });

    return router;
}

module.exports = historicoConducaoRoutes;
