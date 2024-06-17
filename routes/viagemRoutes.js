const express = require('express');
const router = express.Router();

// Essa função receberá a conexão com o banco de dados
function viagemRoutes(db) {

    // Rota para criar uma nova viagem
    router.post('/viagens', (req, res) => {
        const { primeira_parada, data_prevista_1, quantidade_volume, data_real_1, segunda_parada, data_prevista_2, data_real_2, id_rota, id_veiculo, id_motorista } = req.body;

        // Verifica se todos os atributos necessários estão presentes na solicitação
        if (!primeira_parada || !data_prevista_1 || !quantidade_volume || !data_real_1 || !segunda_parada || !data_prevista_2 || !data_real_2 || !id_rota || !id_veiculo || !id_motorista) {
            return res.status(400).send('Erro ao criar viagem: Todos os atributos devem ser fornecidos.');
        }

        // Função para verificar a existência de um ID em uma tabela
        const checkExistence = (table, column, value) => {
            return new Promise((resolve, reject) => {
                db.query(`SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`, [value], (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0].count > 0);
                });
            });
        };

        // Verifica se os IDs de rota, veículo e motorista existem nas tabelas correspondentes
        Promise.all([
            checkExistence('Rota', 'id_rota', id_rota),
            checkExistence('Veiculo', 'id_veiculo', id_veiculo),
            checkExistence('Motorista', 'id_motorista', id_motorista)
        ])
        .then(([rotaExists, veiculoExists, motoristaExists]) => {
            if (!rotaExists || !veiculoExists || !motoristaExists) {
                return res.status(400).send('Erro ao criar viagem: Algum dos IDs fornecidos não existe.');
            }

            // Insere os dados no banco de dados
            db.query('INSERT INTO Viagem (primeira_parada, data_prevista_1, quantidade_volume, data_real_1, segunda_parada, data_prevista_2, data_real_2, id_rota, id_veiculo, id_motorista) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [primeira_parada, data_prevista_1, quantidade_volume, data_real_1, segunda_parada, data_prevista_2, data_real_2, id_rota, id_veiculo, id_motorista],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao criar viagem');
                    }
                    res.send('Viagem criada com sucesso');
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Erro interno do servidor ao verificar a existência dos IDs');
        });
    });

    // Rota para buscar uma viagem por ID
    router.get('/viagens/:id', (req, res) => {
        const id_viagem = req.params.id;
        db.query('SELECT * FROM Viagem WHERE id_viagem = ?', [id_viagem], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar viagem por ID');
            }
            res.json(results);
        });
    });

    // Rota para buscar todas as viagens
    router.get('/viagens', (req, res) => {
        db.query('SELECT * FROM Viagem', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar viagens');
            }
            res.json(results);
        });
    });

    // Rota para atualizar uma viagem existente
    router.put('/viagens/:id', (req, res) => {
        const id_viagem = req.params.id;
        const { primeira_parada, data_prevista_1, quantidade_volume, data_real_1, segunda_parada, data_prevista_2, data_real_2, id_rota, id_veiculo, id_motorista } = req.body;

        db.query('UPDATE Viagem SET primeira_parada=?, data_prevista_1=?, quantidade_volume=?, data_real_1=?, segunda_parada=?, data_prevista_2=?, data_real_2=?, id_rota=?, id_veiculo=?, id_motorista=? WHERE id_viagem=?',
            [primeira_parada, data_prevista_1, quantidade_volume, data_real_1, segunda_parada, data_prevista_2, data_real_2, id_rota, id_veiculo, id_motorista, id_viagem],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar viagem');
                }
                res.send('Viagem atualizada com sucesso');
            });
    });

    // Rota para excluir uma viagem
    router.delete('/viagens/:id', (req, res) => {
        const id_viagem = req.params.id;
        db.query('DELETE FROM Viagem WHERE id_viagem = ?', [id_viagem], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir viagem');
            }
            res.send('Viagem excluída com sucesso');
        });
    });

    return router;
}

module.exports = viagemRoutes;
