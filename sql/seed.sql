-- Seed data for Papeleria Santa Fé

-- Insert categories
INSERT INTO categories (name) VALUES
('Escola'),
('Escritório'),
('Arte'),
('Informática'),
('Papel'),
('Escrita')
ON CONFLICT (name) DO NOTHING;

-- Insert 18 products based on the specification
INSERT INTO products (name, category_id, description, price, stock, image_url) VALUES
('Caderno Universitário', 1, 'Capa dura, 200 folhas', 24.90, 50, '/images/whatsapp-20image-202025-11-19-20at-2022.jpeg'),
('Kit Lápis', 6, '12 unidades com borracha', 12.90, 100, '/images/whatsapp-20image-202025-11-19-20at-2022.jpeg'),
('Mochila Escolar', 1, 'Resistente, vários compartimentos', 89.90, 20, '/placeholder.svg?height=400&width=400'),
('Grampeador de Mesa', 2, 'Metálico, até 30 folhas', 34.90, 40, '/images/whatsapp-20image-202025-11-19-20at-2022.jpeg'),
('Organizador de Mesa', 2, 'Organiza com estilo', 45.90, 60, '/images/whatsapp-20image-202025-11-19-20at-2022.jpeg'),
('Estojo', 1, 'Grande capacidade', 15.90, 80, '/placeholder.svg?height=400&width=400'),
('Canetas Esferográficas', 6, 'Pacote com 10 unidades', 8.90, 200, '/placeholder.svg?height=400&width=400'),
('Papel Sulfite A4', 5, '500 folhas, 75g/m²', 34.90, 80, '/placeholder.svg?height=400&width=400'),
('Tinta para Impressora', 4, 'Cartucho preto', 49.90, 30, '/placeholder.svg?height=400&width=400'),
('Bloco de Notas', 5, '80 folhas adesivas', 6.90, 120, '/placeholder.svg?height=400&width=400'),
('Kit Canetinhas', 3, '24 cores vibrantes', 29.90, 70, '/placeholder.svg?height=400&width=400'),
('Pasta Sanfonada', 2, '12 divisórias A4', 19.90, 90, '/placeholder.svg?height=400&width=400'),
('Adesivos Decorativos', 3, 'Variados designs', 4.50, 200, '/placeholder.svg?height=400&width=400'),
('Cola Branca', 3, '250g tubo', 5.90, 150, '/placeholder.svg?height=400&width=400'),
('Régua 30cm', 6, 'Plástica transparente', 3.50, 300, '/placeholder.svg?height=400&width=400'),
('Envelopes A4', 5, 'Pacote com 25', 12.00, 500, '/placeholder.svg?height=400&width=400'),
('Caderno de Desenho', 3, '50 folhas especiais', 18.90, 100, '/placeholder.svg?height=400&width=400'),
('Agenda 2025', 2, 'Semanal capa couro', 49.90, 45, '/images/whatsapp-20image-202025-11-19-20at-2022.jpeg')
ON CONFLICT DO NOTHING;

-- Note: Admin user will be created via the seed-admin script
-- Email: admin@papeleriasantafe.com
-- Password: Admin123!
