create database if not exists flexpath_final;
use flexpath_final;

-- Include tables from the larger-scope schema so this script can also reset an
-- existing development database created before the project scope was reduced.
drop table if exists
    user_logs,
    project_resource_logs,
    photos,
    milestones,
    project_materials,
    project_tools,
    project_yarns,
    stash_tools,
    stash_yarns,
    pattern_materials,
    pattern_tools,
    pattern_yarns,
    project_tags,
    projects,
    pattern_tags,
    tags,
    tools,
    yarns,
    patterns,
    roles,
    users;

create table users (
    username varchar(255) primary key,
    password varchar(255) not null
);

create table roles (
    username varchar(255) not null,
    role varchar(250) not null,
    primary key (username, role),
    constraint fk_roles_users
        foreign key (username) references users(username) on delete cascade
);

create table patterns (
    pattern_id int primary key auto_increment,
    username varchar(255) not null,
    category varchar(255),
    technique varchar(255),
    name varchar(255) not null,
    designer varchar(255),
    description varchar(1000),
    difficulty varchar(255),
    link varchar(1000),
    image_url varchar(1000),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    constraint fk_patterns_users
        foreign key (username) references users(username) on delete cascade
);

create table tags (
    tag_id int primary key auto_increment,
    username varchar(255) not null,
    name varchar(255) not null,
    constraint uq_tags_username_name unique (username, name),
    constraint fk_tags_users
        foreign key (username) references users(username) on delete cascade
);

create table pattern_tags (
    pattern_id int not null,
    tag_id int not null,
    primary key (pattern_id, tag_id),
    constraint fk_pattern_tags_patterns
        foreign key (pattern_id) references patterns(pattern_id) on delete cascade,
    constraint fk_pattern_tags_tags
        foreign key (tag_id) references tags(tag_id) on delete cascade
);

create table projects (
    project_id int primary key auto_increment,
    username varchar(255) not null,
    pattern_id int not null,
    name varchar(255) not null,
    status varchar(255) not null default 'Not Started',
    is_public boolean not null default false,
    care varchar(1000),
    gauge varchar(255),
    date_started date,
    date_finished date,
    date_needed_by date,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    constraint fk_projects_users
        foreign key (username) references users(username) on delete cascade,
    constraint fk_projects_patterns
        foreign key (pattern_id) references patterns(pattern_id) on delete cascade
);

create table project_tags (
    project_id int not null,
    tag_id int not null,
    primary key (project_id, tag_id),
    constraint fk_project_tags_projects
        foreign key (project_id) references projects(project_id) on delete cascade,
    constraint fk_project_tags_tags
        foreign key (tag_id) references tags(tag_id) on delete cascade
);

create table pattern_yarns (
    pattern_yarn_id int primary key auto_increment,
    pattern_id int not null,
    description varchar(1000),
    weight int,
    yardage int,
    grams float,
    constraint fk_pattern_yarns_patterns
        foreign key (pattern_id) references patterns(pattern_id) on delete cascade
);

create table pattern_tools (
    pattern_tool_id int primary key auto_increment,
    pattern_id int not null,
    tool_type varchar(255) not null,
    size_mm float,
    constraint fk_pattern_tools_patterns
        foreign key (pattern_id) references patterns(pattern_id) on delete cascade
);

create table pattern_materials (
    pattern_material_id int primary key auto_increment,
    pattern_id int not null,
    name varchar(255) not null,
    description varchar(1000),
    quantity int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    constraint fk_pattern_materials_patterns
        foreign key (pattern_id) references patterns(pattern_id) on delete cascade
);

create table milestones (
    milestone_id int primary key auto_increment,
    project_id int not null,
    note text,
    row_count int,
    repeat_count int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    constraint fk_milestones_projects
        foreign key (project_id) references projects(project_id) on delete cascade
);

create table user_logs (
    user_log_id int primary key auto_increment,
    username varchar(255) not null,
    action varchar(255) not null,
    entity_type varchar(255),
    entity_id int not null,
    created_at datetime not null default current_timestamp,
    constraint fk_user_logs_users
        foreign key (username) references users(username) on delete cascade
);

-- Seed users. The BCrypt passwords are "admin" for admin and "password" for
-- each standard user.
insert into users (username, password) values
    ('admin', '$2a$10$AWqhtgbVfRZf4jIeB.Y/RudGQHvzg6VOiHpfihg33MgwOtQNTCzX.'),
    ('ava', '$2a$10$hbqrcwIwWH9d.w5lFbj0XuHtQD38VWOPvaCJxmXQ3z4RM14q45En2'),
    ('ben', '$2a$10$hbqrcwIwWH9d.w5lFbj0XuHtQD38VWOPvaCJxmXQ3z4RM14q45En2'),
    ('chloe', '$2a$10$hbqrcwIwWH9d.w5lFbj0XuHtQD38VWOPvaCJxmXQ3z4RM14q45En2'),
    ('diego', '$2a$10$hbqrcwIwWH9d.w5lFbj0XuHtQD38VWOPvaCJxmXQ3z4RM14q45En2');

insert into roles (username, role) values
    ('admin', 'ADMIN'),
    ('ava', 'USER'),
    ('ben', 'USER'),
    ('chloe', 'USER'),
    ('diego', 'USER');

-- Tags belong to individual accounts, so users can reuse familiar tag names
-- without sharing or exposing one another's tag records.
insert into tags (tag_id, username, name) values
    (1, 'admin', 'cozy'),
    (2, 'admin', 'gift'),
    (3, 'admin', 'quick'),
    (4, 'admin', 'home-decor'),
    (5, 'ava', 'colorful'),
    (6, 'ava', 'gift'),
    (7, 'ava', 'wearable'),
    (8, 'ava', 'amigurumi'),
    (9, 'ben', 'outdoor'),
    (10, 'ben', 'home-decor'),
    (11, 'ben', 'wearable'),
    (12, 'ben', 'beginner'),
    (13, 'chloe', 'elegant'),
    (14, 'chloe', 'gift'),
    (15, 'chloe', 'home-decor'),
    (16, 'chloe', 'winter'),
    (17, 'diego', 'modern'),
    (18, 'diego', 'summer'),
    (19, 'diego', 'home-decor'),
    (20, 'diego', 'amigurumi');

-- Give each account between three and five patterns. Explicit IDs make the
-- project and milestone seed relationships easy to audit and remain safe
-- because all tables are recreated above.
insert into patterns
    (pattern_id, username, category, technique, name, designer, description, difficulty, link, image_url)
values
    (1, 'admin', 'Home', 'Crochet', 'Textured Throw', 'Seed Studio', 'A warm throw with alternating textured panels.', 'Intermediate', null, null),
    (2, 'admin', 'Accessory', 'Knitting', 'Ribbed Winter Hat', 'Seed Studio', 'A stretchy ribbed hat for cold weather.', 'Beginner', null, null),
    (3, 'admin', 'Garment', 'Crochet', 'Everyday Cardigan', 'Seed Studio', 'A relaxed cardigan with simple shaping.', 'Advanced', null, null),

    (4, 'ava', 'Accessory', 'Knitting', 'Harbor Scarf', 'North Loop', 'A long scarf with a reversible texture.', 'Beginner', null, null),
    (5, 'ava', 'Home', 'Crochet', 'Sunburst Pillow', 'Ava Lane', 'A colorful round pillow cover.', 'Intermediate', null, null),
    (6, 'ava', 'Garment', 'Knitting', 'Meadow Vest', 'Ava Lane', 'A lightweight layering vest.', 'Intermediate', null, null),
    (7, 'ava', 'Toy', 'Crochet', 'Pocket Fox', 'Tiny Stitches', 'A small amigurumi fox.', 'Beginner', null, null),

    (8, 'ben', 'Accessory', 'Crochet', 'Trail Beanie', 'Ben Makes', 'A close-fitting beanie with a folded brim.', 'Beginner', null, null),
    (9, 'ben', 'Home', 'Knitting', 'Cable Cushion', 'Ben Makes', 'A square cushion with a central cable.', 'Intermediate', null, null),
    (10, 'ben', 'Garment', 'Knitting', 'Lakeside Pullover', 'Blue Heron', 'A classic crew-neck pullover.', 'Advanced', null, null),
    (11, 'ben', 'Accessory', 'Crochet', 'Market Tote', 'Blue Heron', 'A reusable openwork shopping bag.', 'Beginner', null, null),
    (12, 'ben', 'Home', 'Crochet', 'Moss Stitch Blanket', 'Ben Makes', 'A simple color-block baby blanket.', 'Beginner', null, null),

    (13, 'chloe', 'Garment', 'Crochet', 'Willow Wrap', 'Chloe Crafts', 'A draped wrap with a lace border.', 'Intermediate', null, null),
    (14, 'chloe', 'Accessory', 'Knitting', 'Twilight Mittens', 'Chloe Crafts', 'Warm mittens with a star motif.', 'Advanced', null, null),
    (15, 'chloe', 'Home', 'Crochet', 'Basket Set', 'Cozy Fiber Co', 'Three nesting storage baskets.', 'Beginner', null, null),

    (16, 'diego', 'Accessory', 'Knitting', 'Metro Cowl', 'Diego Ruiz', 'A quick circular-knit cowl.', 'Beginner', null, null),
    (17, 'diego', 'Garment', 'Crochet', 'Coastal Tee', 'Diego Ruiz', 'A breathable warm-weather tee.', 'Intermediate', null, null),
    (18, 'diego', 'Home', 'Knitting', 'Chevron Runner', 'Modern Skein', 'A chevron table runner.', 'Intermediate', null, null),
    (19, 'diego', 'Toy', 'Crochet', 'Sleepy Sloth', 'Modern Skein', 'A soft sloth toy with long arms.', 'Beginner', null, null);

-- Every pattern has at least one tag, with a second tag added where it helps
-- demonstrate multi-tag filtering in the UI.
insert into pattern_tags (pattern_id, tag_id) values
    (1, 1), (1, 4),
    (2, 3),
    (3, 1),
    (4, 7),
    (5, 5), (5, 6),
    (6, 7),
    (7, 6), (7, 8),
    (8, 9), (8, 12),
    (9, 10),
    (10, 11),
    (11, 9), (11, 12),
    (12, 10), (12, 12),
    (13, 13),
    (14, 14), (14, 16),
    (15, 15),
    (16, 17),
    (17, 17), (17, 18),
    (18, 17), (18, 19),
    (19, 20);

-- Yarn requirements use the application's 1-7 yarn-weight scale. Every
-- pattern has at least one required yarn; colorwork and contrasting-detail
-- patterns demonstrate two or three separate yarn requirements.
insert into pattern_yarns (pattern_id, description, weight, yardage, grams) values
    (1, 'Main color, warm neutral', 5, 900, 850),
    (1, 'Contrast color, light neutral', 5, 450, 425),
    (1, 'Accent color', 5, 250, 235),
    (2, 'Soft worsted-weight wool', 5, 220, 100),
    (3, 'Main color, washable wool blend', 4, 1100, 500),
    (3, 'Ribbing contrast color', 4, 220, 100),

    (4, 'Ocean-blue merino', 4, 550, 250),
    (5, 'Golden yellow cotton', 4, 260, 120),
    (5, 'Coral cotton', 4, 180, 85),
    (5, 'Cream cotton', 4, 180, 85),
    (6, 'Sage sport-weight wool', 3, 850, 390),
    (6, 'Button-band contrast yarn', 3, 140, 65),
    (7, 'Rust cotton for the body', 4, 160, 75),
    (7, 'Cream cotton for the face and tail', 4, 45, 25),

    (8, 'Weather-resistant wool blend', 5, 240, 110),
    (9, 'Aran-weight cushion yarn', 5, 420, 200),
    (10, 'Main-color wool', 4, 1250, 575),
    (10, 'Ribbing and trim color', 4, 280, 130),
    (11, 'Durable cotton', 4, 500, 230),
    (12, 'Primary blanket color', 4, 700, 325),
    (12, 'Secondary blanket color', 4, 500, 230),
    (12, 'Border color', 4, 260, 120),

    (13, 'Main-color bamboo blend', 3, 720, 330),
    (13, 'Lace-border contrast yarn', 3, 180, 85),
    (14, 'Main-color fingering wool', 2, 330, 150),
    (14, 'Star-motif contrast yarn', 2, 90, 45),
    (15, 'Sturdy cotton cord', 6, 650, 600),

    (16, 'Soft worsted-weight wool', 5, 300, 140),
    (17, 'Main-color cotton-linen blend', 3, 900, 415),
    (17, 'Neck and sleeve trim yarn', 3, 160, 75),
    (18, 'Main-color cotton', 3, 480, 220),
    (18, 'Chevron contrast color', 3, 300, 140),
    (19, 'Gray-brown cotton for the body', 4, 210, 100),
    (19, 'Cream cotton for the face', 4, 55, 30);

-- Each pattern requires one primary hook or needle size appropriate for its
-- technique and yarn weight.
insert into pattern_tools (pattern_id, tool_type, size_mm) values
    (1, 'Crochet hook', 6.0),
    (2, 'Circular knitting needles', 4.5),
    (3, 'Crochet hook', 5.0),
    (4, 'Knitting needles', 4.0),
    (5, 'Crochet hook', 4.5),
    (6, 'Circular knitting needles', 3.75),
    (7, 'Crochet hook', 3.5),
    (8, 'Crochet hook', 5.0),
    (9, 'Knitting needles', 5.0),
    (10, 'Circular knitting needles', 4.0),
    (11, 'Crochet hook', 4.5),
    (12, 'Crochet hook', 5.0),
    (13, 'Crochet hook', 4.0),
    (14, 'Double-pointed knitting needles', 2.75),
    (15, 'Crochet hook', 8.0),
    (16, 'Circular knitting needles', 4.5),
    (17, 'Crochet hook', 3.75),
    (18, 'Knitting needles', 3.5),
    (19, 'Crochet hook', 3.5);

-- Materials are optional and are included only for patterns that need notions,
-- structural inserts, stuffing, or finishing hardware beyond yarn and tools.
insert into pattern_materials (pattern_id, name, description, quantity) values
    (3, 'Buttons', '25 mm washable cardigan buttons', 6),
    (5, 'Pillow insert', 'Round 16-inch pillow form', 1),
    (6, 'Buttons', '18 mm vest buttons', 5),
    (7, 'Safety eyes', '9 mm black safety eyes', 2),
    (7, 'Fiberfill', 'Small bag of washable toy stuffing', 1),
    (9, 'Pillow insert', 'Square 18-inch pillow form', 1),
    (10, 'Stitch holders', 'Large locking stitch holders for sleeve separation', 2),
    (14, 'Waste yarn', 'Smooth scrap yarn for holding thumb stitches', 1),
    (15, 'Plastic canvas', 'Flexible sheets for reinforcing basket bases', 3),
    (17, 'Stitch markers', 'Locking markers for neckline and sleeve shaping', 6),
    (19, 'Safety eyes', '10 mm black safety eyes', 2),
    (19, 'Fiberfill', 'Medium bag of washable toy stuffing', 1);

-- Each account has eight projects: four public and four private. Every pattern
-- is referenced by at least one project.
insert into projects
    (project_id, username, pattern_id, name, status, is_public, care, gauge, date_started, date_finished, date_needed_by)
values
    (1, 'admin', 1, 'Living Room Throw', 'In Progress', true, 'Machine wash cold', '14 stitches / 4 in', '2026-01-05', null, '2026-10-01'),
    (2, 'admin', 2, 'Blue Ribbed Hat', 'Completed', true, 'Hand wash', '20 stitches / 4 in', '2026-01-12', '2026-01-26', null),
    (3, 'admin', 3, 'Charcoal Cardigan', 'Not Started', true, 'Hand wash and lay flat', '16 stitches / 4 in', null, null, '2026-12-15'),
    (4, 'admin', 1, 'Guest Room Throw', 'In Progress', true, 'Machine wash cold', '14 stitches / 4 in', '2026-03-02', null, null),
    (5, 'admin', 2, 'Gift Hat', 'Completed', false, 'Hand wash', '20 stitches / 4 in', '2026-02-01', '2026-02-14', null),
    (6, 'admin', 3, 'Spring Cardigan', 'In Progress', false, 'Lay flat to dry', '16 stitches / 4 in', '2026-04-10', null, null),
    (7, 'admin', 1, 'Scrap Yarn Throw', 'Not Started', false, 'Machine wash cold', '14 stitches / 4 in', null, null, null),
    (8, 'admin', 2, 'Weekend Hat', 'In Progress', false, 'Hand wash', '20 stitches / 4 in', '2026-06-08', null, null),

    (9, 'ava', 4, 'Ocean Harbor Scarf', 'In Progress', true, 'Hand wash', '22 stitches / 4 in', '2026-01-08', null, null),
    (10, 'ava', 5, 'Golden Pillow', 'Completed', true, 'Spot clean', '15 stitches / 4 in', '2026-01-15', '2026-02-01', null),
    (11, 'ava', 6, 'Sage Meadow Vest', 'Not Started', true, 'Lay flat to dry', '21 stitches / 4 in', null, null, '2026-11-01'),
    (12, 'ava', 7, 'Rust Pocket Fox', 'Completed', true, 'Spot clean', '18 stitches / 4 in', '2026-02-10', '2026-02-18', null),
    (13, 'ava', 4, 'Travel Scarf', 'In Progress', false, 'Hand wash', '22 stitches / 4 in', '2026-03-06', null, null),
    (14, 'ava', 5, 'Nursery Pillow', 'Not Started', false, 'Spot clean', '15 stitches / 4 in', null, null, '2026-09-10'),
    (15, 'ava', 6, 'Cream Meadow Vest', 'In Progress', false, 'Lay flat to dry', '21 stitches / 4 in', '2026-05-04', null, null),
    (16, 'ava', 7, 'Tiny Gray Fox', 'Completed', false, 'Spot clean', '18 stitches / 4 in', '2026-06-01', '2026-06-07', null),

    (17, 'ben', 8, 'Forest Trail Beanie', 'In Progress', true, 'Machine wash gentle', '17 stitches / 4 in', '2026-01-03', null, null),
    (18, 'ben', 9, 'Navy Cable Cushion', 'Completed', true, 'Hand wash', '19 stitches / 4 in', '2026-01-20', '2026-02-12', null),
    (19, 'ben', 10, 'Gray Lakeside Pullover', 'In Progress', true, 'Lay flat to dry', '20 stitches / 4 in', '2026-02-15', null, '2026-12-01'),
    (20, 'ben', 11, 'Green Market Tote', 'Completed', true, 'Machine wash cold', '16 stitches / 4 in', '2026-03-01', '2026-03-16', null),
    (21, 'ben', 12, 'Baby Moss Blanket', 'Not Started', false, 'Machine wash cold', '18 stitches / 4 in', null, null, '2026-10-20'),
    (22, 'ben', 8, 'Black Trail Beanie', 'Completed', false, 'Machine wash gentle', '17 stitches / 4 in', '2026-04-02', '2026-04-12', null),
    (23, 'ben', 9, 'Oatmeal Cable Cushion', 'In Progress', false, 'Hand wash', '19 stitches / 4 in', '2026-05-09', null, null),
    (24, 'ben', 10, 'Blue Lakeside Pullover', 'Not Started', false, 'Lay flat to dry', '20 stitches / 4 in', null, null, null),

    (25, 'chloe', 13, 'Rose Willow Wrap', 'In Progress', true, 'Hand wash', '18 stitches / 4 in', '2026-01-11', null, null),
    (26, 'chloe', 14, 'Midnight Mittens', 'Completed', true, 'Hand wash', '24 stitches / 4 in', '2026-01-28', '2026-02-20', null),
    (27, 'chloe', 15, 'Entryway Baskets', 'In Progress', true, 'Spot clean', '12 stitches / 4 in', '2026-02-22', null, null),
    (28, 'chloe', 13, 'Ivory Willow Wrap', 'Not Started', true, 'Hand wash', '18 stitches / 4 in', null, null, '2026-11-20'),
    (29, 'chloe', 14, 'Snowfall Mittens', 'In Progress', false, 'Hand wash', '24 stitches / 4 in', '2026-03-18', null, null),
    (30, 'chloe', 15, 'Office Baskets', 'Completed', false, 'Spot clean', '12 stitches / 4 in', '2026-04-05', '2026-04-24', null),
    (31, 'chloe', 13, 'Sea Glass Wrap', 'In Progress', false, 'Hand wash', '18 stitches / 4 in', '2026-05-12', null, null),
    (32, 'chloe', 14, 'Gift Mittens', 'Not Started', false, 'Hand wash', '24 stitches / 4 in', null, null, '2026-12-05'),

    (33, 'diego', 16, 'Graphite Metro Cowl', 'In Progress', true, 'Hand wash', '19 stitches / 4 in', '2026-01-07', null, null),
    (34, 'diego', 17, 'Sand Coastal Tee', 'Completed', true, 'Lay flat to dry', '17 stitches / 4 in', '2026-01-25', '2026-03-03', null),
    (35, 'diego', 18, 'Dining Chevron Runner', 'In Progress', true, 'Hand wash', '21 stitches / 4 in', '2026-03-10', null, null),
    (36, 'diego', 19, 'Brown Sleepy Sloth', 'Completed', true, 'Spot clean', '16 stitches / 4 in', '2026-03-21', '2026-04-02', null),
    (37, 'diego', 16, 'Red Metro Cowl', 'Not Started', false, 'Hand wash', '19 stitches / 4 in', null, null, '2026-10-15'),
    (38, 'diego', 17, 'Blue Coastal Tee', 'In Progress', false, 'Lay flat to dry', '17 stitches / 4 in', '2026-05-01', null, null),
    (39, 'diego', 18, 'Holiday Chevron Runner', 'Not Started', false, 'Hand wash', '21 stitches / 4 in', null, null, '2026-12-01'),
    (40, 'diego', 19, 'Gray Sleepy Sloth', 'In Progress', false, 'Spot clean', '16 stitches / 4 in', '2026-06-14', null, null);

-- Every project has at least one tag. These associations are intentionally
-- independent of the pattern tags so project-specific tags such as "gift"
-- can be added without changing the source pattern.
insert into project_tags (project_id, tag_id) values
    (1, 1), (1, 4),
    (2, 3),
    (3, 1),
    (4, 4),
    (5, 2), (5, 3),
    (6, 1),
    (7, 1), (7, 4),
    (8, 3),
    (9, 7),
    (10, 5),
    (11, 7),
    (12, 6), (12, 8),
    (13, 7),
    (14, 5), (14, 6),
    (15, 7),
    (16, 8),
    (17, 9), (17, 12),
    (18, 10),
    (19, 11),
    (20, 9), (20, 12),
    (21, 10),
    (22, 9),
    (23, 10),
    (24, 11),
    (25, 13),
    (26, 16),
    (27, 15),
    (28, 13),
    (29, 16),
    (30, 15),
    (31, 13),
    (32, 14), (32, 16),
    (33, 17),
    (34, 18),
    (35, 17), (35, 19),
    (36, 20),
    (37, 17),
    (38, 18),
    (39, 19),
    (40, 20);

-- The first project for each account gets a ten-entry progress history.
insert into milestones (project_id, note, row_count, repeat_count, created_at)
select
    p.project_id,
    concat('Progress note ', n.note_number, ' for ', p.name),
    n.note_number * 10,
    n.note_number,
    timestampadd(day, n.note_number - 1, p.date_started)
from projects p
cross join (
    select 1 as note_number union all select 2 union all select 3 union all select 4 union all select 5
    union all select 6 union all select 7 union all select 8 union all select 9 union all select 10
) n
where p.project_id in (1, 9, 17, 25, 33);

-- Every other project gets an initial milestone note.
insert into milestones (project_id, note, row_count, repeat_count, created_at)
select
    project_id,
    concat('Project started: ', name),
    10,
    1,
    coalesce(date_started, created_at)
from projects
where project_id not in (1, 9, 17, 25, 33);
