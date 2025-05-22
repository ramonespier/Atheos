~~~ SQL
-- drop database Atheos;
create database Atheos;
use Atheos;

#####################################################################	TABELAS		#####################################################################

create table if not exists usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(150),
	email VARCHAR(200) UNIQUE,
	senha VARCHAR(255),
	criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



create table if not exists categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(125) NOT NULL,
	tipo ENUM('entrada', 'saida') NOT NULL,
	ultima_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
	###################################################################################################
	usuario_id int NOT NULL,
	CONSTRAINT fk_categoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
	###################################################################################################

	CONSTRAINT chk_categoria_tipo CHECK (tipo IN('entrada', 'saida')),
	INDEX idx_categoria_usuario (usuario_id)
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
    #######################################################################################################
    categoria_id int,
    CONSTRAINT fk_transacao_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    #######################################################################################################
    
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
	#######################################################################################################
    categoria_id int,
    CONSTRAINT fk_metas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
	#######################################################################################################
    
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
  ('Salário', 'entrada', '1'),
  ('Alimentação', 'saida', '1'),
  ('Transporte', 'saida', '1'),
  ('Freelance', 'entrada', '1'),
  ('Lazer', 'saida', '1'),
  ('Educação', 'saida', '1'),
  ('Investimentos', 'saida', '1'),
  ('Saúde', 'saida', '1'),
  ('Outros Ganhos', 'entrada', '1'),
  ('Doações', 'saida', '1');


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


  ############################################### VIEWS ##################################################################

-- USUARIO + CATEGORA

CREATE VIEW view_categorias_por_usuario AS
SELECT c.id AS categoria_id,
		c.nome AS categoria_nome,
		c.tipo AS categoria_tipo,
		c.ultima_movimentacao,
		u.id AS usuario_id,
		u.nome AS usuario_nome,
		u.email AS usuario_email
FROM categorias c
JOIN usuarios u ON c.usuario_id = u.id
ORDER BY u.id, c.tipo, c.nome;

-- USUARIO + META

CREATE VIEW view_metas_por_usuario AS
SELECT 
    m.id AS meta_id,
    m.nome AS meta_nome,
    m.valor_limite,
    m.mes,
    m.ano,
    m.criado_em,
    m.atualizado_em,
    
    -- Dados do usuário
    u.id AS usuario_id,
    u.nome AS usuario_nome,
    u.email AS usuario_email,
    
    -- Dados da categoria (se existir)
    c.id AS categoria_id,
    c.nome AS categoria_nome,
    c.tipo AS categoria_tipo,
    
    -- Campo calculado: descrição do período (ex: "Janeiro/2024")
    CONCAT(
        CASE m.mes
            WHEN 1 THEN 'Janeiro'
            WHEN 2 THEN 'Fevereiro'
            WHEN 3 THEN 'Março'
            WHEN 4 THEN 'Abril'
            WHEN 5 THEN 'Maio'
            WHEN 6 THEN 'Junho'
            WHEN 7 THEN 'Julho'
            WHEN 8 THEN 'Agosto'
            WHEN 9 THEN 'Setembro'
            WHEN 10 THEN 'Outubro'
            WHEN 11 THEN 'Novembro'
            WHEN 12 THEN 'Dezembro'
        END,
        '/',
        m.ano
    ) AS periodo_descricao,
    
    -- campo calculado: progresso (seria atualizado por aplicação)
    0 AS progresso_atual  -- Placeholder para ser atualizado pela aplicação

FROM 
    metas m
INNER JOIN 
    usuarios u ON m.usuario_id = u.id
LEFT JOIN 
    categorias c ON m.categoria_id = c.id
ORDER BY 
    u.nome, m.ano DESC, m.mes DESC, m.nome;

  -- USUARIO + META

CREATE VIEW view_transacoes_por_usuario AS
SELECT 
    t.id AS transacao_id,
    t.tipo,
    t.valor,
    t.data,
    t.descricao,
    t.transferido_em,
    
    -- Formata o valor com sinal (+ para entrada, - para saída)
    CONCAT(
        CASE WHEN t.tipo = 'entrada' THEN '+' ELSE '-' END,
        ' R$ ', 
        FORMAT(t.valor, 2, 'pt_BR')
    ) AS valor_formatado,
    
    -- Dados do usuário
    u.id AS usuario_id,
    u.nome AS usuario_nome,
    u.email AS usuario_email,
    
    -- Dados da categoria (se existir)
    c.id AS categoria_id,
    c.nome AS categoria_nome,
    c.tipo AS categoria_tipo,
    
    -- Campos calculados para facilitar relatórios
    YEAR(t.data) AS ano,
    MONTH(t.data) AS mes,
    DAY(t.data) AS dia,
    
    -- Nome do mês por extenso
    MONTHNAME(t.data) AS mes_nome,
    
    -- Dia da semana
    DAYNAME(t.data) AS dia_semana

FROM 
    transacoes t

INNER JOIN 
    usuarios u ON t.usuario_id = u.id

LEFT JOIN 
    categorias c ON t.categoria_id = c.id

ORDER BY 
    t.data DESC, u.nome;

~~~