``` SQL
create database Atheos;
use Atheos;
# drop database atheos;
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
    nome varchar(50) not null,,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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