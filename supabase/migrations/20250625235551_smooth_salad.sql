/*
  # Seed Bakery Content

  1. Initial Data
    - Default "About the Baker" content
    - Sample bakes entries
    - Sample recipes
    - Default settings

  2. Purpose
    - Provide initial content for the website
    - Demonstrate the data structure
    - Allow immediate website functionality
*/

-- Insert default about content
INSERT INTO bakery_about (content, baker_name) VALUES (
  'Welcome to my magical world! I''m Sarah, the heart and soul behind Whisked Away Bakery. My journey into the enchanting realm of baking began in my grandmother''s kitchen when I was just seven years old, standing on a wooden stool, flour dusted on my cheeks, learning that the secret ingredient in every recipe is love.

After studying culinary arts in Paris and working in renowned patisseries across Europe, I returned home with a treasure trove of techniques and an even deeper appreciation for the time-honored traditions that make baking truly special. But it was my grandmother''s handwritten recipe book that inspired me to open Whisked Away Bakery—a place where classic meets whimsical, where every creation tells a story.

Here at the bakery, we believe that the best recipes can''t be measured in cups and teaspoons alone. They require a generous helping of imagination, a sprinkle of wonder, and the kind of care that transforms simple ingredients into moments of pure magic. Every morning, I arrive before dawn, ready to create treats that don''t just satisfy hunger, but feed the soul.

When I''m not in the kitchen, you''ll find me experimenting with new flavor combinations, tending to my herb garden (where I grow lavender and mint for special recipes), or curled up with a good book and a cup of tea. I believe that inspiration can come from anywhere—a sunset''s golden hues might inspire a new cupcake frosting, or the first spring flowers could spark an idea for a seasonal tart.

Thank you for letting me share my passion with you. Every treat is baked with love and a touch of magic just for you! ✨',
  'Sarah'
);

-- Insert sample bakes
INSERT INTO bakery_bakes (title, description, image_url, display_order, is_featured) VALUES
(
  'Enchanted Lavender Honey Cupcakes',
  'Delicate vanilla cupcakes infused with culinary lavender and topped with honey buttercream frosting. Each bite transports you to a peaceful meadow in bloom.',
  'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg',
  1,
  true
),
(
  'Midnight Chocolate Spell Cake',
  'A rich, decadent three-layer chocolate cake with raspberry filling and dark chocolate ganache. It''s pure magic for chocolate lovers.',
  'https://images.pexels.com/photos/6372975/pexels-photo-6372975.jpeg',
  2,
  true
),
(
  'Golden Cinnamon Star Cookies',
  'Traditional spiced cookies cut into star shapes and dusted with edible gold. These treats have been passed down through three generations.',
  'https://images.pexels.com/photos/6479608/pexels-photo-6479608.jpeg',
  3,
  true
),
(
  'Fairy Tale Berry Tart',
  'A buttery pastry shell filled with vanilla custard and topped with fresh seasonal berries arranged like a colorful mandala.',
  'https://images.pexels.com/photos/6812500/pexels-photo-6812500.jpeg',
  4,
  false
),
(
  'Whimsical Unicorn Macarons',
  'Delicate almond macarons in pastel colors with unique flavors like rose, pistachio, and vanilla bean. Each box is a rainbow of joy.',
  'https://images.pexels.com/photos/8473830/pexels-photo-8473830.jpeg',
  5,
  false
),
(
  'Mystic Lemon Bars',
  'Tart lemon curd on a buttery shortbread crust, finished with a light dusting of powdered sugar. Bright, sunny, and absolutely divine.',
  'https://images.pexels.com/photos/6785134/pexels-photo-6785134.jpeg',
  6,
  false
);

-- Insert sample recipes
INSERT INTO bakery_recipes (title, description, prep_time_minutes, cook_time_minutes, servings, difficulty_level, category, is_featured) VALUES
(
  'Grandmother''s Magic Chocolate Chip Cookies',
  'The secret family recipe that started it all. These cookies have the perfect balance of crispy edges and chewy centers, with chunks of premium chocolate in every bite.',
  15,
  12,
  24,
  'easy',
  'cookies',
  true
),
(
  'Enchanted Garden Herb Bread',
  'A rustic sourdough bread infused with fresh herbs from our garden—rosemary, thyme, and a hint of lavender. Perfect with butter and a drizzle of honey.',
  20,
  45,
  8,
  'medium',
  'bread',
  true
),
(
  'Whimsical Vanilla Bean Scones',
  'Tender, buttery scones made with real vanilla bean paste and served with clotted cream and seasonal jam. A delightful treat for afternoon tea.',
  20,
  18,
  8,
  'easy',
  'pastries',
  false
),
(
  'Spellbinding Cinnamon Rolls',
  'Soft, pillowy dough rolled with cinnamon-sugar and topped with cream cheese glaze. These oversized treats are perfect for sharing (though you might not want to!).',
  30,
  25,
  12,
  'medium',
  'pastries',
  true
),
(
  'Fairy Tale Apple Pie',
  'Traditional apple pie with a twist—we use six different apple varieties and a hint of cardamom in our signature flaky crust. Served warm with a scoop of vanilla ice cream.',
  45,
  55,
  8,
  'hard',
  'pies',
  false
),
(
  'Mystic Blueberry Muffins',
  'Bursting with fresh blueberries and topped with a golden crumb topping. These muffins are made with buttermilk for extra tenderness and a touch of lemon zest for brightness.',
  15,
  22,
  12,
  'easy',
  'muffins',
  false
),
(
  'Golden Hour Banana Bread',
  'Moist, rich banana bread made with perfectly ripe bananas, a hint of cinnamon, and optional chocolate chips or walnuts. It''s like sunshine in every slice.',
  15,
  60,
  10,
  'easy',
  'bread',
  false
),
(
  'Enchanted Forest Berry Muffins',
  'A delightful mix of raspberries, blackberries, and blueberries in tender, vanilla-scented muffin batter. Each bite is a burst of summer sweetness.',
  15,
  20,
  12,
  'easy',
  'muffins',
  false
);

-- Insert default settings
INSERT INTO bakery_settings (setting_key, setting_value, description) VALUES
('site_title', 'Whisked Away Bakery', 'Main website title'),
('tagline', 'Where every bite is pure magic ✨', 'Main tagline displayed on homepage'),
('contact_email', 'info@whiskedawaybakery.com', 'Primary contact email'),
('contact_phone', '(555) 123-BAKE', 'Primary contact phone number'),
('address', '123 Magic Lane, Whimsical Heights, WH 12345', 'Bakery physical address'),
('instagram_url', 'https://instagram.com/whiskedawaybakery', 'Instagram profile URL'),
('facebook_url', 'https://facebook.com/whiskedawaybakery', 'Facebook page URL'),
('pinterest_url', 'https://pinterest.com/whiskedawaybakery', 'Pinterest profile URL');