~~~ SQL
#####################################################################	DATA BASE	#####################################################################
create database Atheos;
use Atheos;
-- drop database Atheos;
drop table transacoes;
drop table metas;
drop table categorias;
-- drop table usuarios;


#####################################################################	TABELAS		#####################################################################

create table if not exists usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(150),
	email VARCHAR(200) UNIQUE,
	senha VARCHAR(255),
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


create table if not exists transacoes (
	id INT auto_increment PRIMARY KEY,
    tipo ENUM('entrada', 'saida') NOT NULL,
    valor DECIMAL(12,2) NOT NULL CHECK (valor >= 0.01),
    data DATE NOT NULL,
    descricao TEXT,
    transferido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    #######################################################################################################
    usuario_id int NOT NULL,
    CONSTRAINT fk_transacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

    
    CONSTRAINT chk_transacao_tipo CHECK (tipo IN ('entrada', 'saida')),
    INDEX idx_transacao_usuario (usuario_id),
    INDEX idx_transacao_data (data)
);


create table if not exists metas (
	id INT auto_increment PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_limite DECIMAL(12,2) NOT NULL CHECK (valor_limite >= 0),
    mes TINYINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    ano SMALLINT NOT NULL CHECK (ano BETWEEN 2006 AND 2100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    
	#######################################################################################################
    usuario_id int NOT NULL,
    CONSTRAINT fk_metas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,

    
    INDEX idx_metas_usuario (usuario_id),
    INDEX idx_metas_periodo (mes, ano)
);

#################################################################################################################################
#													INSERT INTO																	#
#################################################################################################################################
INSERT INTO usuarios (nome, email, senha) VALUES 
('Samuel Juan', 'samuel@email.com', '1234'),
('João Certinato', 'joao@email.com', '2020'),
('Roberto Migales', 'roberto@email.com', 'tes12'),
('Jurema Santista', 'jurema@email.com', '44455'),
('Ruan Robert', 'ruan@email.com', '88888');

INSERT INTO categorias (nome, tipo, usuario_id)
VALUES 
  ('Salário', 'entrada', '8'),
  ('Alimentação', 'saida', '6'),
  ('Transporte', 'saida', '8'),
  ('Freelance', 'entrada', '6'),
  ('Lazer', 'saida', '6'),
  ('Educação', 'saida', '8'),
  ('Investimentos', 'saida', '6'),
  ('Saúde', 'saida', '6'),
  ('Outros Ganhos', 'entrada', '6'),
  ('Doações', 'saida', '8');


INSERT INTO transacoes (tipo, valor, data, descricao, usuario_id, categoria_id)
VALUES 
  ('entrada', 3500.00, '2025-05-01', 'Salário de Maio', '1', '1'),
  ('saida', 75.50, '2025-05-03', 'Compra no mercado', '1', '2'),
  ('saida', 15.00, '2025-05-04', 'Passagem de ônibus', '1', '3'),
  ('entrada', 850.00, '2025-05-10', 'Projeto freelance finalizado', '1', '4'),
  ('saida', 120.00, '2025-05-11', 'Cinema e pizza com amigos', '1', '5'),
  ('saida', 300.00, '2025-05-12', 'Curso online de SQL', '1', '6'),
  ('saida', 500.00, '2025-05-14', 'Aplicação em fundo de renda fixa', '1', '7'),
  ('saida', 45.00, '2025-05-15', 'Consulta médica particular', '1', '8'),
  ('entrada', 150.00, '2025-05-16', 'Venda de item usado', '1', '9'),
  ('saida', 20.00, '2025-05-17', 'Ajuda para um amigo', '1', '10');


INSERT INTO metas (nome, valor_limite, mes, ano, usuario_id, categoria_id)
VALUES 
  ('Limite Alimentação Maio', 600.00, 5, 2025, '1', '2'),
  ('Meta Transporte Maio', 200.00, 5, 2025, '1', '3');
  
  
  CREATE VIEW view_transacoes AS
SELECT 
    t.id,
    t.tipo,
    t.valor,
    t.data,
    t.descricao,
    t.usuario_id
FROM 
    transacoes t
ORDER BY 
    t.data DESC;
    
    CREATE VIEW view_metas AS
SELECT 
    m.id,
    m.nome,
    m.valor_limite,
    m.mes,
    m.ano,
    m.usuario_id
FROM 
    metas m
ORDER BY 
    m.ano DESC, m.mes DESC;
~~~