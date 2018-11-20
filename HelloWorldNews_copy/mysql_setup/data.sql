DELETE FROM comment;
DELETE FROM article;
DELETE FROM article_categories;

insert into article_categories values
                                      ("java"),
                                      ("js"),
                                      ("c++");

insert into article values (1,"Lorem Ipsum", "2018-09-01 00:00:00",
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis, mi id lacinia ultricies, metus elit sagittis neque, ac sagittis lacus metus sit amet est. Nullam faucibus consequat quam a dictum. Quisque ultricies, velit eu mollis faucibus, libero purus euismod lacus, eget consectetur velit justo a metus. Integer dapibus, nisi vitae pharetra ultrices, orci elit ultricies urna, vitae posuere nisi neque nec odio. Nulla in dapibus ipsum. Duis sollicitudin nulla leo, sit amet mollis purus suscipit id. Praesent dictum congue erat vel gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus elementum bibendum pellentesque. Suspendisse varius sit amet velit a mollis.

Phasellus ipsum justo, ultrices sit amet odio ut, ultricies scelerisque ipsum. Donec sollicitudin massa vel lobortis ultrices. Praesent consectetur feugiat velit, in gravida ligula. Praesent volutpat nibh eget orci egestas, vitae hendrerit massa aliquet. Donec eget orci et justo egestas laoreet. Morbi efficitur, sem vel rhoncus efficitur, est ante ultricies velit, sed dignissim arcu lacus eu ligula. Suspendisse at elit nunc. Ut et lorem neque. Aenean congue placerat elit quis sagittis. In aliquam non purus sed egestas.

Donec ultrices tristique neque non iaculis. Aenean vitae lorem dictum, consequat leo sagittis, rhoncus velit. Aliquam at nisi vel turpis condimentum egestas non a turpis. Donec hendrerit ex dapibus justo egestas, vitae ultrices dolor cursus. Aliquam ipsum augue, semper sed pellentesque a, laoreet sit amet eros. Maecenas at interdum augue. Mauris varius, nibh eget blandit vehicula, ligula ex suscipit nibh, nec ultrices massa ante nec neque. Integer mattis sagittis erat, sit amet tempor purus vestibulum nec. Curabitur fermentum augue consequat est facilisis, ut scelerisque lorem convallis. Sed vestibulum nisi sit amet auctor faucibus. Maecenas fermentum, massa non volutpat dignissim, tellus eros congue lorem, nec posuere diam est pretium libero. Donec luctus mauris a ante convallis pulvinar. Nulla non lorem nec tellus lobortis tempus. Sed consectetur lacinia semper.

Maecenas elementum luctus tempus. Vivamus vel urna maximus odio congue mollis id eu diam. In pretium a metus dignissim laoreet. Donec imperdiet, libero consequat tristique tempor, magna ligula volutpat erat, a interdum nisl mi sit amet enim. Praesent non egestas augue. Praesent vehicula lorem quis molestie aliquam. Nam eu auctor enim. Praesent eget mi vel libero imperdiet egestas eu et lorem. Nulla ultrices gravida nulla, a dictum nulla aliquet aliquet.

Sed in lorem risus. Mauris fringilla est et lacus faucibus, quis fermentum eros laoreet. Quisque pellentesque lectus vitae libero faucibus tempor. In viverra nisi ut lacus molestie euismod non sed mi. Nulla vestibulum at ante eu convallis. Donec risus nunc, consectetur non fermentum eu, elementum ac purus. Ut elit ligula, hendrerit in eleifend sed, maximus quis dui. Nunc blandit, nunc lacinia mollis blandit, justo enim sodales neque, ut vulputate est arcu sit amet arcu. Mauris tincidunt, ante id euismod pretium, augue felis tempus arcu, vel blandit dui erat sit amet erat. Ut tincidunt dolor eu velit posuere ornare. Pellentesque et neque ornare, lobortis sem egestas, suscipit ipsum. Nam congue vehicula orci, at hendrerit justo.",
                            "/article_images/1.png", "java", 1, 1);
insert into article values (2,"test", "2018-09-05 10:00:00", "testest", "ingen", "java", 1, 1);
insert into article values (3,"test", "2018-09-05 11:00:00", "testest", "ingen", "js", 1, 1);

insert into article values (4,"test2", "2018-09-01 00:00:00", "testest", "ingen", "java", 1, 500);
insert into article values (10,"test2", "2018-08-031 00:00:00", "testest", "ingen", "java", 1, 2000);
insert into article values (11,"test2", "2018-08-031 00:00:00", "testest", "ingen", "java", 1, 10000);
insert into article values (5,"test2", "2018-09-05 10:00:00", "testest", "ingen", "java", 1, 5);
insert into article values (6,"test2", "2018-09-05 11:00:00", "testest", "ingen", "js", 1, 50);


insert into article values (7,"test2", "2018-08-01 00:00:00", "testest", "ingen", "java", 1, 5000);
insert into article values (8,"test2", "2018-08-05 10:00:00", "testest", "ingen", "java", 1, 5000);
insert into article values (9,"test2", "2018-08-05 11:00:00", "testest", "ingen", "js", 1, 5000);

insert into comment (id_article, content, nick) values
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Ho ho ho", "Nicholas" ),
       (1, "Hee Hee Hoo", "Doc Scratch" ),
       (1, "Hee Hee Hoo", "Doc Scratch" ),
       (1, "Hee Hee Hoo", "Doc Scratch" ),
       (1, "Hee Hee Hoo", "Doc Scratch" ),
       (1, "Hee Hee Hoo", "Doc Scratch"),
       (1, "Hee Hee Hoo", "Doc Scratch"),
       (1, "HAHAHAHA", "Caliborn"),
       (1, "HAHAHAHA", "Caliborn")