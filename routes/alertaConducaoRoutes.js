const express = require('express');
const router = express.Router();

// Função que define as rotas para Alerta_Conducao
function alertaConducaoRoutes(db) {

    // Rota para criar um novo alerta de condução
    router.post('/alerta-conducao', (req, res) => {
        const { tipo_alerta_conducao, descricao_alerta_conducao, gravidade_alerta, tratativa_alerta, data_alerta_conducao, id_motorista, id_veiculo, id_viagem } = req.body;

        if (!tipo_alerta_conducao || !gravidade_alerta || !tratativa_alerta) {
            return res.status(400).send('Erro: Todos os campos obrigatórios devem ser fornecidos.');
        }

        db.query('INSERT INTO Alerta_Conducao (tipo_alerta_conducao, descricao_alerta_conducao, gravidade_alerta, tratativa_alerta, data_alerta_conducao, id_motorista, id_veiculo, id_viagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tipo_alerta_conducao, descricao_alerta_conducao, gravidade_alerta, tratativa_alerta, data_alerta_conducao, id_motorista, id_veiculo, id_viagem],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao criar alerta de condução');
                }
                res.send('Alerta criado com sucesso');
            });
    });

    // Rota para buscar um alerta por ID
    router.get('/alerta-conducao/:id', (req, res) => {
        const id_alerta_conducao = req.params.id;

        db.query('SELECT * FROM Alerta_Conducao WHERE id_alerta_conducao = ?', [id_alerta_conducao], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar alerta de condução');
            }
            if (results.length === 0) {
                return res.status(404).send('Alerta não encontrado');
            }
            res.json(results[0]);
        });
    });

    // Rota para buscar todos os alertas
    router.get('/alerta-conducao', (req, res) => {
        db.query('SELECT * FROM Alerta_Conducao', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar alertas de condução');
            }
            res.json(results);
        });
    });

    // Rota para atualizar um alerta existente
    router.put('/alerta-conducao/:id', (req, res) => {
        const id_alerta_conducao = req.params.id;
        const { tipo_alerta_conducao, descricao_alerta_conducao, gravidade_alerta, tratativa_alerta, data_alerta_conducao, id_motorista, id_veiculo, id_viagem } = req.body;

        db.query('UPDATE Alerta_Conducao SET tipo_alerta_conducao = ?, descricao_alerta_conducao = ?, gravidade_alerta = ?, tratativa_alerta = ?, data_alerta_conducao = ?, id_motorista = ?, id_veiculo = ?, id_viagem = ? WHERE id_alerta_conducao = ?',
            [tipo_alerta_conducao, descricao_alerta_conducao, gravidade_alerta, tratativa_alerta, data_alerta_conducao, id_motorista, id_veiculo, id_viagem, id_alerta_conducao],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao atualizar alerta de condução');
                }
                res.send('Alerta atualizado com sucesso');
            });
    });

    // Rota para excluir um alerta
    router.delete('/alerta-conducao/:id', (req, res) => {
        const id_alerta_conducao = req.params.id;

        db.query('DELETE FROM Alerta_Conducao WHERE id_alerta_conducao = ?', [id_alerta_conducao], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao excluir alerta de condução');
            }
            res.send('Alerta excluído com sucesso');
        });
    });

    return router;
}

module.exports = alertaConducaoRoutes;
