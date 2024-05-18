const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


function usuarioRoutes(db) {


    router.post('/usuarios', async (req, res) => {
        const { nome_usuario, email_usuario, senha_usuario, id_permissao } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(senha_usuario, 10);


            db.query('INSERT INTO Usuario (nome_usuario, email_usuario, senha_usuario, id_permissao) VALUES (?, ?, ?, ?)',
                [nome_usuario, email_usuario, hashedPassword, id_permissao],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao criar usuário');
                    }
                    res.send('Usuário criado com sucesso');
                }
            );
        } catch (err) {
            console.error('Erro ao hashear a senha:', err);
            res.status(500).send('Erro ao criar usuário');
        }
    });

    // Obtém todos os usuários
    router.get('/usuarios', (req, res) => {
        db.query('SELECT * FROM Usuario', (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar usuários');
            }
            res.json(rows);
        });
    });

    // Obtém um usuário pelo ID
    router.get('/usuarios/:id', (req, res) => {
        const id_usuario = req.params.id;
        db.query('SELECT * FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar usuário');
            }
            if (rows.length === 0) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.json(rows[0]);
        });
    });

    // Atualiza um usuário pelo ID
    router.put('/usuarios/:id', async (req, res) => {
        const id_usuario = req.params.id;
        const { nome_usuario, email_usuario, senha_usuario, id_permissao } = req.body;

        try {
            let hashedPassword;

            // Se uma nova senha for fornecida, hasheie-a
            if (senha_usuario) {
                hashedPassword = await bcrypt.hash(senha_usuario, 10);
            }

            // Atualiza o usuário no banco de dados
            db.query(
                'UPDATE Usuario SET nome_usuario=?, email_usuario=?, senha_usuario=?, id_permissao=? WHERE id_usuario=?',
                [nome_usuario, email_usuario, hashedPassword, id_permissao, id_usuario],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao atualizar usuário');
                    }
                    res.send('Usuário atualizado com sucesso');
                }
            );
        } catch (err) {
            console.error('Erro ao hashear a senha:', err);
            res.status(500).send('Erro ao atualizar usuário');
        }
    });

    router.put('/usuario/senha', async (req, res) => {
        const { email_usuario, nova_senha } = req.body;
    
        try {
            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(nova_senha, 10);
    
            // Pesquisa o ID do usuário pelo e-mail
            db.query('SELECT id_usuario FROM Usuario WHERE email_usuario=?', 
                [email_usuario],
                async (err, rows) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao buscar usuário');
                    }
                    if (rows.length === 0) {
                        return res.status(404).send('Usuário não encontrado');
                    }
    
                    const id_usuario = rows[0].id_usuario;
    
                    // Atualiza a senha no banco de dados usando o ID do usuário
                    db.query('UPDATE Usuario SET senha_usuario=? WHERE id_usuario=?',
                        [hashedPassword, id_usuario],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send('Erro ao trocar a senha');
                            }
                            if (result.affectedRows === 0) {
                                return res.status(404).send('Usuário não encontrado');
                            }
                            res.send('Senha trocada com sucesso');
                        }
                    );
                }
            );
        } catch (err) {
            console.error('Erro ao hashear a senha:', err);
            res.status(500).send('Erro ao trocar a senha');
        }
    });
    

    // Deleta um usuário pelo ID
    router.delete('/usuarios/:id', (req, res) => {
        const id_usuario = req.params.id;
        db.query('DELETE FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao deletar usuário');
            }
            res.send('Usuário deletado com sucesso');
        });
    });

    // Obtém um usuário pelo nome
    router.get('/usuarios/nome/:nome', (req, res) => {
        const nome_usuario = req.params.nome;
        db.query('SELECT * FROM Usuario WHERE nome_usuario = ?', [nome_usuario], (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao buscar usuário');
            }
            if (rows.length === 0) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.json(rows[0]);
        });
    });

    return router;
};

module.exports = usuarioRoutes;