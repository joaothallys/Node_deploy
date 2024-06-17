const express = require('express');
const router = express.Router();

// Essa função receberá a conexão com o banco de dados
function rotasRoutes(db) {

    // Rota para obter todas as rotas
    router.get('/rotas', (req, res) => {
        db.query('SELECT * FROM Rota', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar rotas');
            }
            res.json(results);
        });
    });

    router.post('/rotas', (req, res) => {
        // Verifica se o corpo da solicitação está vazio ou não é um objeto JSON
        if (!req.body || typeof req.body !== 'object') {
            // Retorna um status 400 (Bad Request) e uma mensagem de erro indicando que o corpo da solicitação é inválido
            return res.status(400).send('Erro ao criar rota: Corpo da solicitação inválido');
        }

        const { destino_rota, data_partida_rota, data_chegada_rota, data_prevista, quantidade_volume, id_veiculo } = req.body;
        db.query('INSERT INTO Rota (destino_rota, data_partida_rota, data_chegada_rota, data_prevista, quantidade_volume, id_veiculo) VALUES (?, ?, ?, ?, ?, ?)',
            [destino_rota, data_partida_rota, data_chegada_rota, data_prevista, quantidade_volume, id_veiculo],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao criar rota');
                }
                res.send('Rota criada com sucesso');
            });
    });

    // Rota para atualizar uma rota existente
    router.put('/rotas/:id', (req, res) => {
        const id_rota = req.params.id;
        const { destino_rota, data_partida_rota, data_chegada_rota, data_prevista, quantidade_volume, id_veiculo } = req.body;
        db.query('UPDATE Rota SET destino_rota=?, data_partida_rota=?, data_chegada_rota=?, data_prevista=?, quantidade_volume=?, id_veiculo=? WHERE id_rota=?',
            [destino_rota, data_partida_rota, data_chegada_rota, data_prevista, quantidade_volume, id_veiculo, id_rota],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar rota');
                }
                res.send('Rota atualizada com sucesso');
            });
    });

    // Rota para excluir uma rota
    router.delete('/rotas/:id', (req, res) => {
        const id_rota = req.params.id;
        db.query('DELETE FROM Rota WHERE id_rota=?', [id_rota], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir rota');
            }
            res.send('Rota excluída com sucesso');
        });
    });
    return router;

}
module.exports = rotasRoutes;
