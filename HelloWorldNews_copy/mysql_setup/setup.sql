drop table if exists comment;
drop table if exists article;
drop table if exists article_categories;


CREATE TABLE article_categories(
   name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE article(
  id_article INT primary key AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL ,
  created DATETIME NOT NULL ,
  content TEXT NOT NULL ,
  image VARCHAR(100) NOT NULL ,
  category VARCHAR(20) NOT NULL ,
  FOREIGN KEY (category) REFERENCES article_categories(name),
  important bool DEFAULT FALSE NOT NULL,
  upvotes INT DEFAULT 1
);

CREATE TABLE comment(
  id_comment INT AUTO_INCREMENT,
  id_article INT ,
  primary key (id_comment),
  foreign key (id_article)
    REFERENCES article(id_article)
    ON DELETE CASCADE,
  nick VARCHAR(20) DEFAULT 'anon',
  content TEXT NOT NULL
);

