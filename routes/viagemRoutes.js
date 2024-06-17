const express = require('express');
const router = express.Router();

// Essa função receberá a conexão com o banco de dados
function viagemRoutes(db) {

    // Rota para criar uma nova viagem
    router.post('/viagens', (req, res) => {
        const { data_inicio_viagem, data_fim_viagem, destino_viagem, id_rota, id_veiculo, id_motorista } = req.body;

        // Verifica se todos os atributos necessários estão presentes na solicitação
        if (!data_inicio_viagem || !data_fim_viagem || !destino_viagem || !id_rota || !id_veiculo || !id_motorista) {
            return res.status(400).send('Erro ao criar viagem: Todos os atributos devem ser fornecidos.');
        }

        // Verifica se os IDs de rota, veículo e motorista existem nas tabelas correspondentes
        const checkExistenceQuery = 'SELECT COUNT(*) AS count FROM rota WHERE id_rota = ?; SELECT COUNT(*) AS count FROM veiculo WHERE id_veiculo = ?; SELECT COUNT(*) AS count FROM motorista WHERE id_motorista = ?';
        db.query(checkExistenceQuery, [id_rota, id_veiculo, id_motorista], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro interno do servidor ao verificar a existência dos IDs');
            }

            // Verifica se algum dos IDs não existe nas tabelas correspondentes
            if (results[0][0].count === 0 || results[1][0].count === 0 || results[2][0].count === 0) {
                return res.status(400).send('Erro ao criar viagem: Algum dos IDs fornecidos não existe.');
            }

            // Insere os dados no banco de dados
            db.query('INSERT INTO Viagem (data_inicio_viagem, data_fim_viagem, destino_viagem, id_rota, id_veiculo, id_motorista) VALUES (?, ?, ?, ?, ?, ?)',
                [data_inicio_viagem, data_fim_viagem, destino_viagem, id_rota, id_veiculo, id_motorista],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao criar viagem');
                    }
                    res.send('Viagem criada com sucesso');
                });
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
        const { data_inicio_viagem, data_fim_viagem, destino_viagem, id_rota, id_veiculo, id_motorista } = req.body;
        db.query('UPDATE Viagem SET data_inicio_viagem=?, data_fim_viagem=?, destino_viagem=?, id_rota=?, id_veiculo=?, id_motorista=? WHERE id_viagem=?',
            [data_inicio_viagem, data_fim_viagem, destino_viagem, id_rota, id_veiculo, id_motorista, id_viagem],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar viagem');
                }
                res.send('Viagem atualizada com sucesso');
            });
    });
    return router;
}
module.exports = viagemRoutes;