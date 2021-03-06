--------------------------
-- Create Careers table
--------------------------

-- Copy .csv file into table
COPY careers from '/Users/Shane/career-buddy-data/ep-tables-cleaned-csv.csv' with delimiter as ' ' with header as false with null as ' ';

--Current problem, can't copy .csv file into psql database 
https://issues.alfresco.com/jira/browse/ALF-14726
http://www.postgresql.org/docs/9.2/static/sql-copy.html

CREATE TABLE careers
(
  career_name     varchar(80) NOT NULL,
  career_occ_code     varchar(10) NOT NULL,
  career_2012_emp     float,
  career_2022_emp     float,
  career_num_emp_change     float,
  career_percent_emp_change float,
  career_percent_self_emp   float,
  career_job_openings   float,
  career_med_ann_wage     float,
  career_edu      varchar(35),
  career_work_exp     varchar(20),
  career_job_training   varchar(50)

);

--------------------------
-- Descriptive stats
--------------------------

-- min/max for various fields

-- .4,145355
select career_2012_emp from careers order by career_2012_emp limit 20; 
select career_2012_emp from careers order by career_2012_emp desc limit 20;

-- -43.3, 53.4
select career_percent_emp_change from careers order by career_percent_emp_change limit 20;
select career_percent_emp_change from careers order by career_percent_emp_change desc limit 20;

-- 18260, 173330
select career_med_ann_wage from careers order by career_med_ann_wage limit 20;
select career_med_ann_wage from careers order by career_med_ann_wage desc limit 20;

--------------------------
-- Other useful queries
--------------------------
-- Column names
select * from careers limit 1;

-- rows with a certain occ code
select career_name from careers where career_occ_code like '29%';

--------------------------
-- Entries missing from inital upload
--------------------------
--Any entries with career_med_ann_wage = '>=$187,200'. 8 occurrences. All of these entries were changed to '$187,200'. 