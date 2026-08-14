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

insert into users (username, password)
values ('admin', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('admin', 'ADMIN');

insert into users (username, password)
values ('user', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('user', 'USER');
