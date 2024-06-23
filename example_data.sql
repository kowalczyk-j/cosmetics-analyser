INSERT INTO users (username, email, password, skin_type, skin_problems, registration_date, specialization)
VALUES
('Jan Kowalski3', 'jan.kowalski3@example.com', 'password123', 'normalna', 'trądzik', '2024-01-01', NULL),
('Anna Nowak3', 'anna.nowak3@example.com', 'password123', 'sucha', 'łuszczyca', '2024-01-05', 'kosmetolog');

INSERT INTO cosmetics (product_name, manufacturer, barcode, description, category)
VALUES
('Krem nawilżający', 'Nivea', '5902169049751', 'Krem nawilżający do twarzy', 'krem'),
('Serum przeciwzmarszczkowe', 'LOreal', '59032129049751', 'Serum redukujące zmarszczki', 'serum');

INSERT INTO cosmetic_ingredients (cosmetic_id, ingredient_id)
VALUES
(1, '94753'),
(2, '94896');

INSERT INTO reviews (cosmetic_id, user_id, title, content, rating, review_date)
VALUES
(1, 1, 'Świetny krem!', 'Naprawdę dobrze nawilża skórę.', 5, '2024-01-10'),
(2, 2, 'Bardzo dobre serum', 'Zmniejsza zmarszczki już po kilku dniach.', 4, '2024-01-15');

INSERT INTO care_plans (user_id, plan_name, description, start_date, end_date)
VALUES
(1, 'Plan nawilżający', 'Plan pielęgnacji dla skóry normalnej', '2024-01-01', '2024-06-01'),
(2, 'Plan przeciwzmarszczkowy', 'Plan pielęgnacji dla skóry suchej', '2024-01-05', NULL);

INSERT INTO care_plan_contents (plan_id, cosmetic_id, frequency, time_of_day, notes)
VALUES
(1, 1, 'codziennie', 'rano', 'Stosować na czystą skórę'),
(2, 2, 'codziennie', 'wieczorem', NULL);

INSERT INTO care_plan_ratings (plan_id, user_id, rating)
VALUES
(1, 1, 'positive'),
(2, 2, 'positive');

INSERT INTO favorite_products (user_id, cosmetic_id)
VALUES
(1, 1),
(2, 2);
