const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Esta função receberá a conexão com o banco de dados
function login(db) {

    // Função para autenticar o usuário
    router.post('/login', (req, res) => {
        const { email_usuario, senha_usuario } = req.body;

        // Consulta para obter o usuário com o e-mail fornecido
        db.query('SELECT * FROM Usuario WHERE email_usuario = ?', [email_usuario], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Erro interno do servidor');
            }

            // Verifica se o usuário foi encontrado
            if (results.length === 0) {
                return res.status(401).send('E-mail ou senha incorretos');
            }

            const usuario = results[0];

            try {
                // Compara a senha fornecida com a senha armazenada no banco de dados
                const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);

                if (!senhaValida) {
                    return res.status(401).send('E-mail ou senha incorretos');
                }

                // Autenticação bem-sucedida
                res.json({
                    mensagem: 'Login bem-sucedido',
                    nome_usuario: usuario.nome_usuario
                });
            } catch (error) {
                console.log(error);
                res.status(500).send('Erro interno do servidor');
            }
        });
    });

    return router;
}

module.exports = login;