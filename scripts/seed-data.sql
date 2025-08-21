-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
('Generative AI', 'generative-ai', 'Articles about generative AI models and applications', '#8B5CF6'),
('Computer Vision', 'computer-vision', 'Computer vision and image processing topics', '#06B6D4'),
('Deep Learning', 'deep-learning', 'Deep learning architectures and techniques', '#10B981'),
('Natural Language Processing', 'nlp', 'NLP and language model topics', '#F59E0B'),
('AI Ethics', 'ai-ethics', 'Ethical considerations in AI development', '#EF4444'),
('Future Tech', 'future-tech', 'Future trends and predictions in AI', '#8B5CF6'),
('AI Research', 'ai-research', 'Latest research papers and breakthroughs', '#6366F1')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, description, content, category, tags, featured_image, status, views) VALUES
(
  'The Evolution of Generative Adversarial Networks: From GAN to StyleGAN-3',
  'evolution-of-gans',
  'Explore the development of GAN architectures, highlighting key milestones like Progressive GAN, StyleGAN-1, StyleGAN-2, and the latest advancements in StyleGAN-3.',
  '<p>Generative Adversarial Networks (GANs) have revolutionized the field of artificial intelligence since their introduction by Ian Goodfellow and his colleagues in 2014...</p>',
  'Generative AI',
  ARRAY['GAN', 'StyleGAN', 'Deep Learning', 'Image Generation'],
  'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2000&h=1000&auto=format&fit=crop',
  'published',
  2340
),
(
  'AI in 2025: Transforming Daily Life',
  'ai-in-2025',
  'Discuss how generative AI has integrated into everyday activities by 2025, providing personal style tips, translating conversations, analyzing diets, and more.',
  '<p>As we approach 2025, artificial intelligence has become deeply integrated into our daily lives in ways that were once the realm of science fiction...</p>',
  'Future Tech',
  ARRAY['AI', 'Future', 'Technology', 'Daily Life'],
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2000&h=1000&auto=format&fit=crop',
  'published',
  1890
),
(
  'The Rise of Multimodal AI Models: Bridging Text, Image, and Beyond',
  'multimodal-ai-models',
  'Examine the emergence of multimodal AI models that process and generate multiple data types, such as text, images, and videos, and their applications in various industries.',
  '<p>Artificial intelligence has undergone a remarkable evolution in recent years, with one of the most significant developments being the rise of multimodal AI models...</p>',
  'AI Research',
  ARRAY['Multimodal', 'AI Models', 'Text', 'Images'],
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&h=1000&auto=format&fit=crop',
  'published',
  1560
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subscribers
INSERT INTO subscribers (email, status) VALUES
('john.doe@example.com', 'active'),
('sarah.smith@example.com', 'active'),
('mike.johnson@example.com', 'active'),
('emma.wilson@example.com', 'active'),
('david.brown@example.com', 'active')
ON CONFLICT (email) DO NOTHING;
