CREATE TABLE `node-complete`.`products` (
     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     price DOUBLE NOT NULL,
     description TEXT NOT NULL,
     imageUrl VARCHAR(255) NOT NULL,
     UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

INSERT INTO `products` (title, price, description, imageUrl)
     VALUES ('Book', '12.99', 'The best sql book.', 'https://www.elginpubliclibrary.org/news-events/library-calendar/2941362fb20214e05a75b5f6baa8af52_books-book-clipart-black-and-book-clip-art-images_589-291.jpeg');

