const express = require('express');
const router = express.Router();

// Essa função receberá a conexão com o banco de dados
function veiculosRoutes(db) {

    // Rota para obter todos os veículos
    router.get('/veiculos', (req, res) => {
        db.query('SELECT * FROM Veiculo', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar veículos');
            }
            res.json(results);
        });
    });

    // Rota para criar um novo veículo
    router.post('/veiculos', (req, res) => {
        const { placa_veiculo, modelo_veiculo, status_veiculo } = req.body;
        db.query('INSERT INTO Veiculo (placa_veiculo, modelo_veiculo, status_veiculo) VALUES (?, ?, ?)',
            [placa_veiculo, modelo_veiculo, status_veiculo],
            (err, result) => {
                if (err) {
                    // Verifica se o erro é relacionado a uma violação de chave única
                    if (err.code === 'ER_DUP_ENTRY') {
                        // Retorna uma mensagem de erro informando que a placa já existe
                        return res.status(400).send('Erro ao criar veículo: Esta placa já está sendo utilizada.');
                    }
                    console.log(err);
                    // Retorna um erro interno do servidor para outros tipos de erros
                    return res.status(500).send('Erro interno do servidor ao criar veículo');
                }
                // Retorna uma mensagem de sucesso se o veículo for criado com êxito
                res.send('Veículo criado com sucesso');
            });
    });

    // Rota para atualizar um veículo existente
    router.put('/veiculos/:id', (req, res) => {
        const id_veiculo = req.params.id;
        const { placa_veiculo, modelo_veiculo, status_veiculo } = req.body;
        db.query('UPDATE Veiculo SET placa_veiculo=?, modelo_veiculo=?, status_veiculo=? WHERE id_veiculo=?',
            [placa_veiculo, modelo_veiculo, status_veiculo, id_veiculo],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar veículo');
                }
                res.send('Veículo atualizado com sucesso');
            });
    });

    // Rota para excluir um veículo
    router.delete('/veiculos/:id', (req, res) => {
        const id_veiculo = req.params.id;
        db.query('DELETE FROM Veiculo WHERE id_veiculo=?', [id_veiculo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir veículo');
            }
            res.send('Veículo excluído com sucesso');
        });
    });

    // Rota para buscar veículo pela placa
    router.get('/veiculos/placa/:placa', (req, res) => {
        const placa_veiculo = req.params.placa;
        db.query('SELECT * FROM Veiculo WHERE placa_veiculo = ?', [placa_veiculo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar veículo pela placa');
            }
            if (result.length === 0) {
                return res.status(404).send('Veículo não encontrado');
            }
            res.json(result[0]);
        });
    });

    return router;
}

module.exports = veiculosRoutes;
