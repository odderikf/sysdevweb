DELETE FROM comment;
DELETE FROM article;
DELETE FROM article_categories;

insert into article_categories values
                                      ("Programming"),
                                      ("Web dev"),
                                      ("Politics");

insert into article values (1,"test", "2018-09-01 00:00:00", "testest", "ingen", "Programming", 1, 1);
insert into article values (2,"test", "2018-09-05 10:00:00", "testest", "ingen", "Programming", 1, 1);
insert into article values (3,"test", "2018-09-05 11:00:00", "testest", "ingen", "Web dev", 1, 1);

insert into article values (4,"test2", "2018-09-01 00:00:00", "testest", "ingen", "Programming", 1, 500);
insert into article values (10,"test2", "2018-08-031 00:00:00", "testest", "ingen", "Programming", 1, 2000);
insert into article values (11,"test2", "2018-08-031 00:00:00", "testest", "ingen", "Programming", 1, 10000);
insert into article values (5,"test2", "2018-09-05 10:00:00", "testest", "ingen", "Programming", 1, 5);
insert into article values (6,"test2", "2018-09-05 11:00:00", "testest", "ingen", "Web dev", 1, 50);


insert into article values (7,"test2", "2018-08-01 00:00:00", "testest", "ingen", "Programming", 1, 5000);
insert into article values (8,"test2", "2018-08-05 10:00:00", "testest", "ingen", "Programming", 1, 5000);
insert into article values (9,"test2", "2018-08-05 11:00:00", "testest", "ingen", "Web dev", 1, 5000);