const express = require('express');
const router = express.Router();

// Função que define as rotas para Controle_Rotas
function controleRotasRoutes(db) {
    // Rota para criar um novo registro de rota
    router.post('/controle-rotas', (req, res) => {
        const {
            id_viagem,
            id_veiculo,
            id_motorista,
            quantidade_combustivel,
            primeira_parada,
            data_prevista_primeira_parada,
            data_real_primeira_parada,
            volume_primeira_parada_m3,
            segunda_parada,
            data_prevista_segunda_parada,
            data_real_segunda_parada,
            volume_segunda_parada_m3,
            terceira_parada,
            data_prevista_terceira_parada,
            data_real_terceira_parada,
            volume_terceira_parada_m3,
            parada_final,
            data_prevista_parada_final,
            data_real_parada_final,
            volume_parada_final_m3,
            historico_alteracoes
        } = req.body;

        db.query('INSERT INTO Controle_Rotas (id_viagem, id_veiculo, id_motorista, quantidade_combustivel, primeira_parada, data_prevista_primeira_parada, data_real_primeira_parada, volume_primeira_parada_m3, segunda_parada, data_prevista_segunda_parada, data_real_segunda_parada, volume_segunda_parada_m3, terceira_parada, data_prevista_terceira_parada, data_real_terceira_parada, volume_terceira_parada_m3, parada_final, data_prevista_parada_final, data_real_parada_final, volume_parada_final_m3, historico_alteracoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id_viagem,
                id_veiculo,
                id_motorista,
                quantidade_combustivel,
                primeira_parada,
                data_prevista_primeira_parada,
                data_real_primeira_parada,
                volume_primeira_parada_m3,
                segunda_parada,
                data_prevista_segunda_parada,
                data_real_segunda_parada,
                volume_segunda_parada_m3,
                terceira_parada,
                data_prevista_terceira_parada,
                data_real_terceira_parada,
                volume_terceira_parada_m3,
                parada_final,
                data_prevista_parada_final,
                data_real_parada_final,
                volume_parada_final_m3,
                historico_alteracoes
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao criar registro de rota');
                }
                res.send('Registro de rota criado com sucesso');
            }
        );
    });

    // Rota para buscar todos os registros de rota
    router.get('/controle-rotas', (req, res) => {
        db.query('SELECT * FROM Controle_Rotas', (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar registros de rotas');
            }
            res.json(rows);
        });
    });

    // Rota para buscar um registro de rota pelo ID
    router.get('/controle-rotas/:id', (req, res) => {
        const id_rota = req.params.id;
        db.query('SELECT * FROM Controle_Rotas WHERE id_rota = ?', [id_rota], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar registro de rota');
            }
            if (rows.length === 0) {
                return res.status(404).send('Registro de rota não encontrado');
            }
            res.json(rows[0]);
        });
    });

    // Rota para atualizar um registro de rota pelo ID
    router.put('/controle-rotas/:id', (req, res) => {
        const id_rota = req.params.id;
        const {
            id_viagem,
            id_veiculo,
            id_motorista,
            quantidade_combustivel,
            primeira_parada,
            data_prevista_primeira_parada,
            data_real_primeira_parada,
            volume_primeira_parada_m3,
            segunda_parada,
            data_prevista_segunda_parada,
            data_real_segunda_parada,
            volume_segunda_parada_m3,
            terceira_parada,
            data_prevista_terceira_parada,
            data_real_terceira_parada,
            volume_terceira_parada_m3,
            parada_final,
            data_prevista_parada_final,
            data_real_parada_final,
            volume_parada_final_m3,
            historico_alteracoes
        } = req.body;

        db.query('UPDATE Controle_Rotas SET id_viagem=?, id_veiculo=?, id_motorista=?, quantidade_combustivel=?, primeira_parada=?, data_prevista_primeira_parada=?, data_real_primeira_parada=?, volume_primeira_parada_m3=?, segunda_parada=?, data_prevista_segunda_parada=?, data_real_segunda_parada=?, volume_segunda_parada_m3=?, terceira_parada=?, data_prevista_terceira_parada=?, data_real_terceira_parada=?, volume_terceira_parada_m3=?, parada_final=?, data_prevista_parada_final=?, data_real_parada_final=?, volume_parada_final_m3=?, historico_alteracoes=? WHERE id_rota=?',
            [
                id_viagem,
                id_veiculo,
                id_motorista,
                quantidade_combustivel,
                primeira_parada,
                data_prevista_primeira_parada,
                data_real_primeira_parada,
                volume_primeira_parada_m3,
                segunda_parada,
                data_prevista_segunda_parada,
                data_real_segunda_parada,
                volume_segunda_parada_m3,
                terceira_parada,
                data_prevista_terceira_parada,
                data_real_terceira_parada,
                volume_terceira_parada_m3,
                parada_final,
                data_prevista_parada_final,
                data_real_parada_final,
                volume_parada_final_m3,
                historico_alteracoes,
                id_rota
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar registro de rota');
                }
                res.send('Registro de rota atualizado com sucesso');
            }
        );
    });

    // Rota para excluir um registro de rota pelo ID
    router.delete('/controle-rotas/:id', (req, res) => {
        const id_rota = req.params.id;
        db.query('DELETE FROM Controle_Rotas WHERE id_rota = ?', [id_rota], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir registro de rota');
            }
            res.send('Registro de rota excluído com sucesso');
        });
    });

    return router;
}

module.exports = controleRotasRoutes;
