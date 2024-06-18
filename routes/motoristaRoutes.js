const express = require('express');
const router = express.Router();

// Essa função receberá a conexão com o banco de dados
function motoristaRoutes(db) {
    // Rota para obter todos os motoristas
    router.get('/motoristas', (req, res) => {
        db.query('SELECT * FROM Motorista', (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar motoristas');
            }
            res.json(results);
        });
    });

    // Rota para criar um novo motorista
    router.post('/motoristas', (req, res) => {
        const { nome_motorista, cnh_motorista, validade_cnh, status_saude_motorista } = req.body;
        db.query('INSERT INTO Motorista (nome_motorista, cnh_motorista, validade_cnh, status_saude_motorista) VALUES (?, ?, ?, ?)',
            [nome_motorista, cnh_motorista, validade_cnh, status_saude_motorista],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao criar motorista');
                }
                res.send('Motorista criado com sucesso');
            });
    });

    // Rota para atualizar um motorista existente
    router.put('/motoristas/:id', (req, res) => {
        const id_motorista = req.params.id;
        const { nome_motorista, cnh_motorista, validade_cnh, status_saude_motorista } = req.body;
        db.query('UPDATE Motorista SET nome_motorista=?, cnh_motorista=?, validade_cnh=?, status_saude_motorista=? WHERE id_motorista=?',
            [nome_motorista, cnh_motorista, validade_cnh, status_saude_motorista, id_motorista],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Erro ao atualizar motorista');
                }
                res.send('Motorista atualizado com sucesso');
            });
    });

    // Rota para excluir um motorista
    router.delete('/motoristas/:id', (req, res) => {
        const id_motorista = req.params.id;
        db.query('DELETE FROM Motorista WHERE id_motorista=?', [id_motorista], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir motorista');
            }
            res.send('Motorista excluído com sucesso');
        });
    });

    // Rota para obter motorista por nome
    router.get('/motoristas/nome/:nome', (req, res) => {
        const nome_motorista = req.params.nome;
        db.query('SELECT * FROM Motorista WHERE nome_motorista = ?', [nome_motorista], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar motorista por nome');
            }
            res.json(results);
        });
    });

    // Rota para obter motorista por ID
    router.get('/motoristas/id/:id', (req, res) => {
        const id_motorista = req.params.id;
        db.query('SELECT * FROM Motorista WHERE id_motorista = ?', [id_motorista], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar motorista por ID');
            }
            if (results.length === 0) {
                return res.status(404).send('Motorista não encontrado');
            }
            res.json(results[0]);
        });
    });

    return router;
}

module.exports = motoristaRoutes;
